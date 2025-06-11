<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\TimelineKegiatan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimelineKegiatanController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $meetingSearch = $request->input('meeting_search');
        $meetingPerPage = $request->input('meeting_per_page', 10);

        $query = TimelineKegiatan::query();

        if ($search) {
            $query->where('kegiatan', 'like', '%'.$search.'%')
                ->orWhere('nama_klien', 'like', '%'.$search.'%');
        }

        $timelineKegiatan = $query->orderBy('tanggal', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        $users = User::role('user')
            ->select('id', 'name', 'email')
            ->get();

        $meetings = Meeting::with('user')
            ->when($meetingSearch, fn ($q) => $q->whereHas('user', fn ($u) => $u->where('name', 'like', "%{$meetingSearch}%")
            )->orWhere('jenis', 'like', "%{$meetingSearch}%"))
            ->orderBy('created_at', 'desc')
            ->paginate($meetingPerPage)
            ->withQueryString();

        return Inertia::render('Admin/TimelineKegiatan/Index', [
            'timelineKegiatan' => $timelineKegiatan,
            'meetings' => $meetings,
            'users' => $users,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'meeting_search' => $meetingSearch,
                'meeting_per_page' => $meetingPerPage,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kegiatan' => 'required|string|max:255',
            'timeline_kegiatan_id' => 'required|exists:users,id',
            'deskripsi' => 'required|string',
            'tanggal' => 'required|date',
            'status' => 'required|in:Belum,Dalam Proses,Selesai',
        ]);

        $user = User::findOrFail($validated['timeline_kegiatan_id']);

        $timelineKegiatan = TimelineKegiatan::create([
            'kegiatan' => $validated['kegiatan'],
            'nama_klien' => $user->name,
            'deskripsi' => $validated['deskripsi'],
            'tanggal' => $validated['tanggal'],
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.timeline-kegiatan.index')->with('success', 'Kegiatan berhasil ditambahkan.');
    }

    public function update(Request $request, TimelineKegiatan $timelineKegiatan)
    {
        $validated = $request->validate([
            'kegiatan' => 'required|string|max:255',
            'timeline_kegiatan_id' => 'required|exists:users,id',
            'deskripsi' => 'required|string',
            'tanggal' => 'required|date',
            'status' => 'required|in:Belum,Dalam Proses,Selesai',
        ]);

        $user = User::findOrFail($validated['timeline_kegiatan_id']);
        $timelineKegiatan->update([
            'kegiatan' => $validated['kegiatan'],
            'nama_klien' => $user->name,
            'deskripsi' => $validated['deskripsi'],
            'tanggal' => $validated['tanggal'],
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.timeline-kegiatan.index')->with('success', 'Kegiatan berhasil diperbarui.');
    }

    public function destroy(TimelineKegiatan $timelineKegiatan)
    {
        $timelineKegiatan->delete();

        return redirect()->route('admin.timeline-kegiatan.index')->with('success', 'Kegiatan berhasil dihapus.');
    }
}
