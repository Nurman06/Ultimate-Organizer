<?php

namespace App\Http\Controllers;

use App\Models\BajuAdat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BajuAdatController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $query = BajuAdat::query();

        if ($search) {
            $query->where('nama', 'like', '%'.$search.'%');
        }

        $bajuAdat = $query->orderBy('nama', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/BajuAdat/Index', [
            'bajuAdat' => $bajuAdat,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
        ]);

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('baju-adat', 'public');
            $validated['gambar'] = $path;
        }

        BajuAdat::create($validated);

        return redirect()->route('admin.baju-adat.index')->with('success', 'Baju Adat berhasil ditambahkan.');
    }

    public function update(Request $request, BajuAdat $bajuAdat)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
        ]);

        if ($request->hasFile('gambar')) {
            // Hapus gambar lama jika ada
            if ($bajuAdat->gambar) {
                Storage::disk('public')->delete($bajuAdat->gambar);
            }
            $path = $request->file('gambar')->store('baju-adat', 'public');
            $validated['gambar'] = $path;
        } else {
            $validated['gambar'] = $bajuAdat->gambar;
        }

        $bajuAdat->update($validated);

        return redirect()->route('admin.baju-adat.index')->with('success', 'Baju Adat berhasil diperbarui.');
    }

    public function destroy(BajuAdat $bajuAdat)
    {
        if ($bajuAdat->gambar) {
            Storage::disk('public')->delete($bajuAdat->gambar);
        }

        $bajuAdat->delete();

        return redirect()->route('admin.baju-adat.index')->with('success', 'Baju Adat berhasil dihapus.');
    }
}
