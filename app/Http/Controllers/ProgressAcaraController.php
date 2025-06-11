<?php

namespace App\Http\Controllers;

use App\Models\TimelineKegiatan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgressAcaraController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $user = $request->user();

        $query = TimelineKegiatan::where('nama_klien', $user->name);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kegiatan', 'like', "%{$search}%")
                    ->orWhere('deskripsi', 'like', "%{$search}%");
            });
        }

        $items = $query
            ->orderBy('tanggal', 'desc')
            ->get();

        return Inertia::render('User/ProgressAcara/Index', [
            'items' => $items,
            'filters' => ['search' => $search],
        ]);
    }
}
