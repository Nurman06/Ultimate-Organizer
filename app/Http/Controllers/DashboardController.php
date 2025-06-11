<?php

namespace App\Http\Controllers;

use App\Models\Klien;
use App\Models\Meeting;
use App\Models\TimelineKegiatan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $roles = $user->roles;
        $roleNames = $roles->pluck('name');

        return Inertia::render('Dashboard', [
            'userRoles' => $roleNames,
        ]);
    }

    public function userDashboard()
    {
        $user = Auth::user();
        $roles = $user->roles;
        $roleNames = $roles->pluck('name');

        $items = TimelineKegiatan::where('nama_klien', $user->name)
            ->orderBy('tanggal', 'desc')
            ->get();

        // Ambil data klien milik user ini (asumsi disimpan berdasarkan email)
        $klien = Klien::where('email', $user->email)->latest()->first();

        // Hitung progress dari timeline kegiatan
        $totalSteps = TimelineKegiatan::where('nama_klien', $user->name)->count();
        $doneSteps = TimelineKegiatan::where('nama_klien', $user->name)
            ->where('status', 'Selesai')
            ->count();
        $progressPct = $totalSteps > 0
            ? round($doneSteps / $totalSteps * 100)
            : 0;

        return Inertia::render('User/Dashboard', [
            'userRoles' => $roleNames,
            'user' => $user,
            'klien' => $klien,
            'progressPct' => $progressPct,
            'items' => $items,
        ]);
    }

    public function adminDashboard(Request $request)
    {
        // Timezone Jakarta
        $today = Carbon::today('Asia/Jakarta');
        $yesterday = Carbon::yesterday('Asia/Jakarta');

        // --- Statistik Klien ---
        $totalKlienToday = Klien::whereDate('created_at', '<=', $today)->count();
        $totalKlienYester = Klien::whereDate('created_at', '<=', $yesterday)->count();
        $pctKlien = $totalKlienYester > 0
            ? round((($totalKlienToday - $totalKlienYester) / $totalKlienYester) * 100)
            : ($totalKlienToday > 0 ? null : 0);

        // --- Statistik Acara Selesai ---
        $totalSelesaiToday = TimelineKegiatan::where('status', 'Selesai')
            ->whereDate('created_at', '<=', $today)->count();
        $totalSelesaiYester = TimelineKegiatan::where('status', 'Selesai')
            ->whereDate('created_at', '<=', $yesterday)->count();
        $pctSelesai = $totalSelesaiYester > 0
            ? round((($totalSelesaiToday - $totalSelesaiYester) / $totalSelesaiYester) * 100)
            : ($totalSelesaiToday > 0 ? null : 0);

        // --- Statistik Acara Aktif (Belum/Dalam Proses) ---
        $totalAktifToday = TimelineKegiatan::whereIn('status', ['Belum', 'Dalam Proses'])
            ->whereDate('created_at', '<=', $today)->count();
        $totalAktifYester = TimelineKegiatan::whereIn('status', ['Belum', 'Dalam Proses'])
            ->whereDate('created_at', '<=', $yesterday)->count();
        $pctAktif = $totalAktifYester > 0
            ? round((($totalAktifToday - $totalAktifYester) / $totalAktifYester) * 100)
            : ($totalAktifToday > 0 ? null : 0);

        // --- Statistik Pendapatan (jika ada field harga di Klien) ---
        $pendapatanToday = Klien::whereDate('created_at', '<=', $today)->sum('harga');
        $pendapatanYester = Klien::whereDate('created_at', '<=', $yesterday)->sum('harga');
        $pctPendapatan = $pendapatanYester > 0
            ? round((($pendapatanToday - $pendapatanYester) / $pendapatanYester) * 100)
            : ($pendapatanToday > 0 ? null : 0);

        // --- Ambil semua meeting untuk timeline ---
        $meetings = Meeting::with('user')
            ->orderBy('tanggal', 'asc')
            ->orderBy('waktu', 'asc')
            ->get(['tanggal', 'waktu', 'jenis', 'catatan', 'user_id', 'status']);

        $events = $meetings->map(function ($m) {
            return [
                'tanggal' => $m->tanggal,                 // YYYY-MM-DD
                'waktu' => $m->waktu,                   // HH:MM:SS
                'nama_klien' => $m->user->name,              // relasi ke User
                'kegiatan' => $m->jenis,                   // judul meeting
                'deskripsi' => $m->catatan,                 // catatan (nullable)
                'status' => $m->status,                  // opsional
            ];
        })->toArray();

        // Kirim ke Inertia
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalKlien' => $totalKlienToday,
                'pctKlien' => $pctKlien,
                'acaraSelesai' => $totalSelesaiToday,
                'pctSelesai' => $pctSelesai,
                'acaraAktif' => $totalAktifToday,
                'pctAktif' => $pctAktif,
                'pendapatan' => $pendapatanToday,
                'pctPendapatan' => $pctPendapatan,
            ],
            'events' => $events,
        ]);
    }
}
