// resources/js/Pages/Admin/TimelineKegiatan/Index.tsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AppPagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import React, { useState } from 'react';

interface TimelineKegiatan {
    id: number;
    kegiatan: string;
    nama_klien: string;
    deskripsi: string;
    tanggal: string;
    status: string;
}

interface MeetingSubmission {
    id: number;
    jenis: string;
    catatan: string;
    tanggal: string;
    waktu: string;
    status: string;
    user: { name: string };
}

interface UserOption {
    id: number;
    name: string;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    per_page: number;
    from: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    timelineKegiatan: Paginated<TimelineKegiatan>;
    meetings: Paginated<MeetingSubmission>;
    users: UserOption[];
    filters: {
        search: string;
        per_page: number;
        meeting_search?: string;
        meeting_per_page?: number;
    };
}

export default function AdminTimelineKegiatan({ timelineKegiatan, filters, users, meetings }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedTimeline, setSelectedTimeline] = useState<TimelineKegiatan | null>(null);
    const [perPage, setPerPage] = useState(timelineKegiatan.per_page);
    const [meetingSearch, setMeetingSearch] = useState(filters.meeting_search || '');
    const [meetingPerPage, setMeetingPerPage] = useState(filters.meeting_per_page || meetings.per_page);

    const form = useForm({
        kegiatan: '',
        timeline_kegiatan_id: null as number | null,
        deskripsi: '',
        tanggal: '',
        status: 'Belum',
    });

    const editForm = useForm({
        id: 0,
        kegiatan: '',
        timeline_kegiatan_id: null as number | null,
        deskripsi: '',
        tanggal: '',
        status: 'Belum',
    });

    const statusClassMap: Record<string, string> = {
        Belum: [
            'rounded-[4px]', // corner radius 4px
            'bg-[rgba(151,151,151,0.1)]', // fill #979797 @10%
            'text-[#979797]', // teks #979797 @100%
            'drop-shadow', // efek drop shadow
            'px-[10px]',
            'py-[4px]', // padding 10px × 4px
            'selection:bg-[rgba(151,151,151,0.1)]', // bg saat teks diseleksi
            'selection:text-[#979797]', // teks saat diseleksi
        ].join(' '),
        'Dalam Proses': [
            'rounded-[4px]',
            'bg-[rgba(157,119,83,0.1)]',
            'bg-[repeating-linear-gradient(to_right,rgba(157,119,83,0.2)_0px,_rgba(157,119,83,0.2)_1px,_transparent_1px_10px),repeating-linear-gradient(to_bottom,rgba(157,119,83,0.2)_0px,_rgba(157,119,83,0.2)_1px,_transparent_1px_10px)]',
            'bg-[length:10px_10px]',
            'text-[#9D7753]',
            'drop-shadow',
            'px-[10px] py-[4px]',
        ].join(' '),
        Selesai: [
            'rounded-[4px]', // corner radius 4px
            'bg-[rgba(63,194,138,0.1)]', // fill #3FC28A @10% opacity
            'text-[#3FC28A]', // teks #3FC28A @100%
            'drop-shadow', // efek drop shadow
            'px-[10px]',
            'py-[4px]', // padding horisontal & vertikal
            // selection colors: background #3FC28A@10%, teks #3FC28A@100%
            'selection:bg-[rgba(63,194,138,0.1)]',
            'selection:text-[#3FC28A]',
        ].join(' '),
    };

    // Handlers for open/close modals
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        form.reset();
        setIsModalOpen(false);
    };
    const openEditModal = (item: TimelineKegiatan) => {
        setSelectedTimeline(item);
        editForm.setData({
            id: item.id,
            kegiatan: item.kegiatan,
            timeline_kegiatan_id: item.id,
            deskripsi: item.deskripsi,
            tanggal: item.tanggal,
            status: item.status,
        });
        setEditModalOpen(true);
    };
    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedTimeline(null);
        editForm.reset();
    };

    // Submit tambah
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.data.kegiatan || !form.data.timeline_kegiatan_id || !form.data.deskripsi || !form.data.tanggal || !form.data.status) {
            alert('Semua field wajib diisi!');
            return;
        }
        form.post(route('admin.timeline-kegiatan.store'), {
            onSuccess: () => closeModal(),
            onError: () => alert('Terjadi kesalahan saat menyimpan data.'),
        });
    };

    // Submit edit
    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(route('admin.timeline-kegiatan.update', editForm.data.id), {
            onSuccess: () => closeEditModal(),
            onError: () => alert('Gagal memperbarui data.'),
        });
    };

    const deleteTimeline = (id: number) => {
        if (confirm('Yakin ingin menghapus kegiatan ini?')) {
            router.delete(route('admin.timeline-kegiatan.destroy', id));
        }
    };

    // Pagination & search handlers
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.currentTarget.search as HTMLInputElement;
        router.get(route('admin.timeline-kegiatan.index'), { search: target.value, per_page: perPage }, { preserveState: true, replace: true });
    };
    const handlePerPageChange = (value: number) => {
        setPerPage(value);
        router.get(route('admin.timeline-kegiatan.index'), { search: filters.search, per_page: value }, { preserveState: true, replace: true });
    };
    const handleMeetingSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(
            route('admin.timeline-kegiatan.index'),
            {
                search: filters.search,
                per_page: perPage,
                meeting_search: meetingSearch,
                meeting_per_page: meetingPerPage,
            },
            { preserveState: true, replace: true },
        );
    };
    const handleMeetingPerPageChange = (value: number) => {
        setMeetingPerPage(value);
        router.get(
            route('admin.timeline-kegiatan.index'),
            {
                search: filters.search,
                per_page: perPage,
                meeting_search: meetingSearch,
                meeting_per_page: value,
            },
            { preserveState: true, replace: true },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Timeline Kegiatan', href: route('admin.timeline-kegiatan.index') }];
    const statusOptions = [
        { value: 'Belum', label: 'Belum' },
        { value: 'Dalam Proses', label: 'Dalam Proses' },
        { value: 'Selesai', label: 'Selesai' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Timeline Kegiatan" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Timeline Kegiatan</h1>
                    <p className="text-muted-foreground">Kelola kegiatan dan pengajuan meeting klien</p>
                </div>

                {/* Timeline Section */}
                <div className="grid auto-rows-min gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <form onSubmit={handleSearch} className="flex items-center space-x-2">
                            <Input name="search" placeholder="Cari kegiatan atau klien" defaultValue={filters.search} className="w-64" />
                            <Button type="submit">Search</Button>
                        </form>
                        <div className="flex items-center space-x-2">
                            <Select value={perPage.toString()} onValueChange={(v) => handlePerPageChange(Number(v))}>
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Per Page" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 25, 50, 100].map((n) => (
                                        <SelectItem key={n} value={n.toString()}>
                                            {n}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={openModal}>Tambah Kegiatan</Button>
                        </div>
                    </div>

                    <div className="text-sm text-gray-700">
                        Menampilkan {timelineKegiatan.from}–{timelineKegiatan.to} dari total {timelineKegiatan.total} kegiatan
                    </div>
                    <div className="overflow-x-auto rounded-lg bg-white shadow">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell>Kegiatan</TableCell>
                                    <TableCell>Klien</TableCell>
                                    <TableCell>Deskripsi</TableCell>
                                    <TableCell>Tanggal</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Aksi</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {timelineKegiatan.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.kegiatan}</TableCell>
                                        <TableCell>{item.nama_klien}</TableCell>
                                        <TableCell>{item.deskripsi.length > 50 ? item.deskripsi.slice(0, 50) + '...' : item.deskripsi}</TableCell>
                                        <TableCell>{format(new Date(item.tanggal), 'dd MMM yyyy')}</TableCell>
                                        <TableCell>
                                            <Badge className={statusClassMap[item.status] ?? ''}>{item.status}</Badge>
                                        </TableCell>
                                        <TableCell className="flex space-x-2">
                                            <Button size="sm" variant="outline" onClick={() => openEditModal(item)}>
                                                Edit
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => deleteTimeline(item.id)}>
                                                Hapus
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {timelineKegiatan.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-4 text-center">
                                            Tidak ada data kegiatan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <AppPagination links={timelineKegiatan.links} />
                </div>

                {/* Meeting Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold">Pengajuan Meeting</h2>
                    <div className="my-4 flex items-center justify-between">
                        <form onSubmit={handleMeetingSearch} className="flex items-center space-x-2">
                            <Input
                                placeholder="Cari jenis atau klien"
                                value={meetingSearch}
                                onChange={(e) => setMeetingSearch(e.currentTarget.value)}
                                className="w-64"
                            />
                            <Button type="submit">Search</Button>
                        </form>
                        <Select value={meetingPerPage.toString()} onValueChange={(v) => handleMeetingPerPageChange(Number(v))}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Per Page" />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 25, 50, 100].map((n) => (
                                    <SelectItem key={n} value={n.toString()}>
                                        {n}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <p className="mb-2 text-sm text-gray-700">
                        Menampilkan {meetings.from}–{meetings.to} dari {meetings.total} pengajuan
                    </p>
                    <div className="overflow-x-auto rounded-lg bg-white shadow">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell>Jenis Pengajuan</TableCell>
                                    <TableCell>Nama Klien</TableCell>
                                    <TableCell>Catatan</TableCell>
                                    <TableCell>Tanggal & Waktu</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {meetings.data.map((m) => (
                                    <TableRow key={m.id}>
                                        <TableCell>{m.jenis}</TableCell>
                                        <TableCell>{m.user.name}</TableCell>
                                        <TableCell>{m.catatan}</TableCell>
                                        <TableCell>
                                            {new Date(`${m.tanggal}T${m.waktu}`).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {meetings.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-4 text-center">
                                            Tidak ada pengajuan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <AppPagination links={meetings.links} />
                </div>

                {/* Modal Tambah */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogOverlay className="fixed inset-0 flex items-center justify-center bg-black/50" />

                    <DialogContent className="max-w-lg rounded-lg bg-white p-6 shadow-lg">
                        <DialogTitle className="mb-4 text-xl font-semibold">Tambah Kegiatan</DialogTitle>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Kegiatan</label>
                                <Input type="text" value={form.data.kegiatan} onChange={(e) => form.setData('kegiatan', e.target.value)} required />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Nama Klien</label>
                                <Select
                                    value={form.data.timeline_kegiatan_id?.toString() || ''}
                                    onValueChange={(val) => form.setData('timeline_kegiatan_id', Number(val))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Klien" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((u) => (
                                            <SelectItem key={u.id} value={u.id.toString()}>
                                                {u.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.errors.timeline_kegiatan_id && <p className="mt-1 text-sm text-red-600">{form.errors.timeline_kegiatan_id}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Deskripsi</label>
                                <Textarea
                                    value={form.data.deskripsi}
                                    onChange={(e) => form.setData('deskripsi', e.target.value)}
                                    className="w-full max-w-full resize-y break-words"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Tanggal</label>
                                <Input type="date" value={form.data.tanggal} onChange={(e) => form.setData('tanggal', e.target.value)} required />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Status</label>
                                <Select value={form.data.status} onValueChange={(val) => form.setData('status', val)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="mt-6 flex justify-end space-x-2">
                                <Button variant="outline" type="button" onClick={closeModal}>
                                    Batal
                                </Button>
                                <Button type="submit">Tambah</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal Edit */}
                <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogOverlay className="fixed inset-0 flex items-center justify-center bg-black/50" />

                    <DialogContent className="max-w-lg rounded-lg bg-white p-6 shadow-lg">
                        <DialogTitle className="mb-4 text-xl font-semibold">Edit Kegiatan</DialogTitle>
                        <form onSubmit={submitEdit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Kegiatan</label>
                                <Input value={editForm.data.kegiatan} onChange={(e) => editForm.setData('kegiatan', e.target.value)} required />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Nama Klien</label>
                                <Select
                                    value={editForm.data.timeline_kegiatan_id?.toString() || ''}
                                    onValueChange={(val) => editForm.setData('timeline_kegiatan_id', Number(val))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Klien" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((u) => (
                                            <SelectItem key={u.id} value={u.id.toString()}>
                                                {u.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editForm.errors.timeline_kegiatan_id && (
                                    <p className="text-sm text-red-600">{editForm.errors.timeline_kegiatan_id}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Deskripsi</label>
                                <Textarea
                                    value={editForm.data.deskripsi}
                                    onChange={(e) => editForm.setData('deskripsi', e.target.value)}
                                    className="w-full max-w-full resize-y break-words"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Tanggal</label>
                                <Input
                                    type="date"
                                    value={editForm.data.tanggal}
                                    onChange={(e) => editForm.setData('tanggal', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Status</label>
                                <Select value={editForm.data.status} onValueChange={(val) => editForm.setData('status', val)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="mt-6 flex justify-end space-x-2">
                                <Button variant="outline" type="button" onClick={closeEditModal}>
                                    Batal
                                </Button>
                                <Button type="submit">Simpan</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
