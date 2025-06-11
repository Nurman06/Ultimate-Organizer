<?php

namespace App\Http\Controllers;

use App\Models\BajuAdat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KatalogBajuAdatController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $query = BajuAdat::query();

        if ($search) {
            $query->where('nama', 'like', "%{$search}%");
        }

        // Ambil semua tanpa paginate
        $bajuAdat = $query
            ->orderBy('nama')
            ->get();

        return Inertia::render('User/KatalogBajuAdat/Index', [
            'bajuAdat' => $bajuAdat,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
