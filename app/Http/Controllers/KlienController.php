<?php

namespace App\Http\Controllers;

use App\Mail\InvoiceMail;
use App\Models\Invoice;
use App\Models\Klien;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class KlienController extends Controller
{
    /**
     * Tampilkan daftar klien dengan fitur pencarian dan paginasi dinamis.
     */
    public function index(Request $request)
    {
        // 1. Ambil keyword pencarian (jika ada)
        $search = $request->input('search');

        // 2. Bangun query Eloquent
        $query = Klien::with('invoices');

        // Jika ada parameter "search", filter berdasarkan email
        if ($search) {
            $query->where('email', 'like', '%'.$search.'%');
        }

        // 3. Ambil jumlah per halaman dari request (default 10)
        $perPage = $request->input('per_page', 10);

        // 4. Lakukan paginasi sesuai per_page, urutkan berdasarkan nama, dan sertakan query string
        $klien = $query->orderBy('nama', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        // Transform collection untuk menambahkan field latestInvoiceFile
        $klien->getCollection()->transform(function ($item) {
            $latest = $item->invoices->first();

            return [
                'id' => $item->id,
                'nama' => $item->nama,
                'email' => $item->email,
                'lokasi' => $item->lokasi,
                'tanggal_acara' => $item->tanggal_acara,
                'paket' => $item->paket,
                'harga' => $item->harga,
                'latestInvoiceFile' => $latest
                    ? "invoice_{$latest->invoice_number}.pdf"
                    : null,
            ];
        });
        // 5. Kirim data klien dan filter ke Inertia
        // Ambil daftar user ber-role 'user' untuk dropdown
        $users = User::role('user')
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('Admin/Klien/Index', [
            'klien' => $klien,
            'users' => $users,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Proses penyimpanan klien baru ke database.
     */
    public function store(Request $request)
    {
        // 1. Validasi input (semua wajib diisi)
        $validated = $request->validate([
            'klien_id' => 'required|exists:users,id',
            'lokasi' => 'required|string|max:255',
            'tanggal_acara' => 'required|date',
            'paket' => 'required|string|in:basic,standar,premium',
            'harga' => 'required|numeric|min:0',
        ]);

        // Ambil data user
        $user = User::findOrFail($validated['klien_id']);

        // Simpan ke tabel klien
        $klien = Klien::create([
            'nama' => $user->name,
            'email' => $user->email,
            'lokasi' => $validated['lokasi'],
            'tanggal_acara' => $validated['tanggal_acara'],
            'paket' => $validated['paket'],
            'harga' => $validated['harga'],
        ]);

        // Generate invoice seperti sebelumnya
        do {
            $random = Str::upper(Str::random(8));
            $invoiceNumber = "INV-{$random}";
        } while (Invoice::where('invoice_number', $invoiceNumber)->exists());

        $subtotal = $klien->harga;
        $ppn = 0;
        $total = $subtotal + $ppn;

        $invoice = Invoice::create([
            'invoice_number' => $invoiceNumber,
            'klien_id' => $klien->id,
            'tanggal_invoice' => now()->toDateString(),
            'subtotal' => $subtotal,
            'ppn' => $ppn,
            'total' => $total,
            'status' => 'unpaid',
        ]);

        $pdf = Pdf::loadView('invoices.template', ['invoice' => $invoice->load('klien')]);
        $fileName = "invoice_{$invoiceNumber}.pdf";
        Storage::disk('invoices')->put($fileName, $pdf->output());

        Mail::to($klien->email)
            ->send(new InvoiceMail($invoice));

        return redirect()
            ->route('admin.klien.index')
            ->with('success', 'Pemesanan dan Invoice berhasil dibuat.');
    }

    // Update data klien
    public function update(Request $request, Klien $klien)
    {
        $validated = $request->validate([
            'klien_id' => 'required|exists:users,id',
            'lokasi' => 'required|string|max:255',
            'tanggal_acara' => 'required|date',
            'paket' => 'required|in:basic,standar,premium',
            'harga' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($klien, $validated) {
            // 1. Ambil data user, baru update kolom nama & email
            $user = User::findOrFail($validated['klien_id']);
            $klien->update([
                'nama' => $user->name,
                'email' => $user->email,
                'lokasi' => $validated['lokasi'],
                'tanggal_acara' => $validated['tanggal_acara'],
                'paket' => $validated['paket'],
                'harga' => $validated['harga'],
            ]);

            // 2. Ambil invoice terbaru untuk klien ini
            $invoice = $klien->invoices()->latest()->first();

            if ($invoice) {
                // 3. Hitung ulang subtotal/ppn/total
                $subtotal = $klien->harga;
                $ppn = 0; // atau $subtotal * 0.11
                $total = $subtotal + $ppn;

                // 4. Update record invoice
                $invoice->update([
                    'subtotal' => $subtotal,
                    'ppn' => $ppn,
                    'total' => $total,
                ]);

                // 5. Regenerasi PDF dan overwrite file lama
                $pdf = Pdf::loadView('invoices.template', ['invoice' => $invoice->load('klien')]);
                $fileName = "invoice_{$invoice->invoice_number}.pdf";
                Storage::disk('invoices')->put($fileName, $pdf->output());

                Mail::to($klien->email)
                    ->send(new InvoiceMail($invoice, true));
            }
        });

        return redirect()->route('admin.klien.index')->with('success', 'Data klien berhasil diperbarui.');
    }

    // Hapus data klien
    public function destroy(Klien $klien)
    {
        // 1. Ambil invoice terbaru (atau semua invoice jika ada beberapa)
        $invoice = $klien->invoices()->latest()->first();

        if ($invoice) {
            // 2. Tentukan nama file
            $fileName = "invoice_{$invoice->invoice_number}.pdf";

            // 3. Hapus file PDF dari disk 'invoices'
            Storage::disk('invoices')->delete($fileName);  // :contentReference[oaicite:1]{index=1}
        }

        // 4. Hapus data klien (dengan cascade delete invoice jika relasi diatur)
        $klien->delete();

        return redirect()
            ->route('admin.klien.index')
            ->with('success', 'Data klien dan file invoice berhasil dihapus.');
    }
}
