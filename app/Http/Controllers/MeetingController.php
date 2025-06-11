<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingController extends Controller
{
    public function index()
    {
        return Inertia::render('User/JadwalkanMeeting/Index');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'tanggal' => 'required|date',
            'waktu' => 'required',
            'jenis' => 'required|string',
            'catatan' => 'nullable|string',
        ]);

        $request->user()->meetings()->create($data);

        return redirect()->route('user.jadwalkan-meeting')
            ->with('success', 'Pengajuan meeting terkirim.');
    }
}
