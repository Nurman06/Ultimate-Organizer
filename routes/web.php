<?php

use App\Http\Controllers\AdminMeetingController;
use App\Http\Controllers\BajuAdatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KatalogBajuAdatController;
use App\Http\Controllers\KlienController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\ProgressAcaraController;
use App\Http\Controllers\TimelineKegiatanController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();
        // Ambil semua nama role user
        $roleNames = $user->roles->pluck('name')->toArray();

        // Cek role secara manual
        if (in_array('admin', $roleNames)) {
            return redirect()->route('admin.dashboard');
        } elseif (in_array('user', $roleNames)) {
            return redirect()->route('user.dashboard');
        }
    }

    // Tampilkan halaman welcome jika belum login
    return Inertia::render('welcome');
})->name('home');

Route::get('/admin/dashboard', [DashboardController::class, 'adminDashboard'])
    ->name('admin.dashboard')
    ->middleware(['auth', 'role:admin']);

Route::get('/user/dashboard', [DashboardController::class, 'userDashboard'])
    ->name('user.dashboard')
    ->middleware(['auth', 'role:user']);

Route::get('/admin/klien', [KlienController::class, 'index'])
    ->name('admin.klien.index')
    ->middleware(['auth', 'role:admin']);

// Rute untuk menyimpan klien baru
Route::post('/admin/klien', [KlienController::class, 'store'])
    ->name('admin.klien.store')
    ->middleware(['auth', 'role:admin']);

// Update data klien
Route::put('/admin/klien/{klien}', [KlienController::class, 'update'])
    ->name('admin.klien.update')
    ->middleware(['auth', 'role:admin']);

// Hapus data klien
Route::delete('/admin/klien/{klien}', [KlienController::class, 'destroy'])
    ->name('admin.klien.destroy')
    ->middleware(['auth', 'role:admin']);

// Katalog Baju Adat
Route::middleware(['auth', 'role:user'])
    ->get('/user/katalog-baju-adat', [KatalogBajuAdatController::class, 'index'])
    ->name('user.katalog-baju-adat');

Route::get('/invoices/{filename}', function ($filename) {
    $path = storage_path("app/invoices/{$filename}");
    if (! File::exists($path)) {
        abort(404);
    }

    // File Responses: tampilkan PDF langsung di browser
    return response()->file($path);
})->name('invoices.show');

// Manajemen Baju Adat
Route::get('/admin/baju-adat', [BajuAdatController::class, 'index'])
    ->name('admin.baju-adat.index')
    ->middleware(['auth', 'role:admin']);

Route::post('/admin/baju-adat', [BajuAdatController::class, 'store'])
    ->name('admin.baju-adat.store')
    ->middleware(['auth', 'role:admin']);

Route::put('/admin/baju-adat/{bajuAdat}', [BajuAdatController::class, 'update'])
    ->name('admin.baju-adat.update')
    ->middleware(['auth', 'role:admin']);

Route::delete('/admin/baju-adat/{bajuAdat}', [BajuAdatController::class, 'destroy'])
    ->name('admin.baju-adat.destroy')
    ->middleware(['auth', 'role:admin']);

// Timeline Kegiatan
Route::get('/admin/timeline-kegiatan', [TimelineKegiatanController::class, 'index'])
    ->name('admin.timeline-kegiatan.index')
    ->middleware(['auth', 'role:admin']);

Route::post('/admin/timeline-kegiatan', [TimelineKegiatanController::class, 'store'])
    ->name('admin.timeline-kegiatan.store')
    ->middleware(['auth', 'role:admin']);

Route::put('/admin/timeline-kegiatan/{timelineKegiatan}', [TimelineKegiatanController::class, 'update'])
    ->name('admin.timeline-kegiatan.update')
    ->middleware(['auth', 'role:admin']);

Route::delete('/admin/timeline-kegiatan/{timelineKegiatan}', [TimelineKegiatanController::class, 'destroy'])
    ->name('admin.timeline-kegiatan.destroy')
    ->middleware(['auth', 'role:admin']);

// Progress Acara untuk User
Route::get('/user/progress-acara', [ProgressAcaraController::class, 'index'])
    ->name('user.progress-acara.index')
    ->middleware(['auth', 'role:user']);

// User routes (role:user)
Route::middleware(['auth', 'role:user'])->group(function () {
    Route::get('/user/jadwalkan-meeting', [MeetingController::class, 'index'])
        ->name('user.jadwalkan-meeting');
    Route::post('/user/jadwalkan-meeting', [MeetingController::class, 'store']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
