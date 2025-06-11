<?php

namespace App\Http\Controllers;

use App\Models\Meeting;

class AdminMeetingController extends Controller
{
    public function approve(Meeting $meeting)
    {
        $meeting->status = 'Acc';
        $meeting->save();

        return back()->with('success', 'Meeting disetujui.');
    }

    public function reject(Meeting $meeting)
    {
        $meeting->status = 'Tolak';
        $meeting->save();

        return back()->with('success', 'Meeting ditolak.');
    }
}
