// resources/js/Pages/Admin/Klien/Index.tsx

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AppPagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { toast } from 'sonner';

interface Klien {
    id: number;
    nama: string;
    email: string;
    lokasi: string;
    tanggal_acara: string;
    paket: string;
    harga: number;
    latestInvoiceFile?: string | null;
}

interface UserOption {
    id: number;
    name: string;
    email: string;
}

interface Props {
    klien: {
        data: Klien[];
        current_page: number;
        per_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    users: UserOption[];
    filters: {
        search: string;
        per_page: number;
    };
    userRoles?: string[];
}

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
});

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Klien',
        href: '/admin/klien',
    },
];

export default function AdminKlien({ klien, users, filters, userRoles = [] }: Props) {
    // 1. State untuk toggle modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedKlien, setSelectedKlien] = useState<Klien | null>(null);
    const [selectedEmail, setSelectedEmail] = useState('');
    const [editEmail, setEditEmail] = useState('');

    // 2. State untuk dropdown per-page
    const [perPage, setPerPage] = useState(klien.per_page);

    // 3. useForm dari Inertia untuk form “Tambah Klien”
    const form = useForm({
        klien_id: null as number | null,
        lokasi: '',
        tanggal_acara: '',
        paket: 'basic',
        harga: 0,
    });

    useEffect(() => {
        if (form.data.klien_id) {
            const u = users.find((u) => u.id === form.data.klien_id);
            setSelectedEmail(u ? u.email : '');
        } else {
            setSelectedEmail('');
        }
    }, [form.data.klien_id]);

    // 4. Handlers: buka/tutup modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        form.reset();
        setIsModalOpen(false);
    };

    // 5. Handler untuk submit form “Tambah Klien”
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.data.klien_id || !form.data.lokasi || !form.data.tanggal_acara || !form.data.paket) {
            toast.error('Semua field wajib diisi!');
            return;
        }

        form.post(route('admin.klien.store'), {
            onSuccess: () => {
                toast.success('Klien berhasil ditambahkan');
                closeModal();
            },
            onError: () => {
                toast.error('Gagal menyimpan data klien');
            },
        });
    };

    const editForm = useForm({
        id: 0,
        klien_id: null as number | null,
        lokasi: '',
        tanggal_acara: '',
        paket: 'basic',
        harga: 0,
    });

    useEffect(() => {
        if (selectedKlien) {
            setEditEmail(selectedKlien.email);
        } else {
            setEditEmail('');
        }
    }, [selectedKlien]);

    // Buka modal edit
    const openEditModal = (klien: Klien) => {
        setSelectedKlien(klien);
        editForm.setData({
            id: klien.id,
            klien_id: klien.id,
            lokasi: klien.lokasi,
            tanggal_acara: klien.tanggal_acara,
            paket: klien.paket,
            harga: klien.harga,
        });
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedKlien(null);
        editForm.reset();
    };

    // Submit edit
    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();

        editForm.put(route('admin.klien.update', editForm.data.id), {
            onSuccess: () => {
                toast.success('Data klien berhasil diperbarui');
                closeEditModal();
            },
            onError: () => {
                toast.error('Gagal memperbarui data klien');
            },
        });
    };

    // Hapus klien
    const deleteKlien = (id: number) => {
        if (confirm('Yakin ingin menghapus klien ini?')) {
            router.delete(route('admin.klien.destroy', id));
        }
    };

    // 6. Handler untuk pencarian
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.currentTarget.search as HTMLInputElement;
        const keyword = target.value;

        router.get(route('admin.klien.index'), { search: keyword, per_page: perPage }, { preserveState: true, replace: true });
    };

    // 7. Handler untuk perubahan jumlah data per halaman (perPage)
    const handlePerPageChange = (value: number) => {
        setPerPage(value);

        router.get(route('admin.klien.index'), { search: filters.search, per_page: value }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Klien" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header Halaman (Judul & Sub-Judul) */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Manajemen Klien</h1>
                    <p className="text-muted-foreground">Kelola Data Klien dan Informasi Acara Pernikahan</p>
                </div>

                {/* Konten Utama */}
                <div className="grid auto-rows-min gap-4">
                    {/* Toolbar: Search, Filter, Per-Page, Tambah Klien */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <form onSubmit={handleSearch} className="flex items-center space-x-2">
                            <Input name="search" placeholder="Cari berdasarkan email" defaultValue={filters.search} className="w-64" />
                            <Button type="submit">Search</Button>
                        </form>

                        <div className="flex items-center space-x-2">
                            <Button variant="outline">Filter</Button>

                            <Select value={perPage.toString()} onValueChange={(value) => handlePerPageChange(Number(value))}>
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Per Page" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button onClick={openModal}>Tambah Klien</Button>
                        </div>
                    </div>

                    {/* Keterangan Pagination */}
                    <div className="text-sm text-gray-700">
                        Menampilkan {klien.from} sampai {klien.to} dari total {klien.total} klien
                    </div>

                    {/* Tabel Daftar Klien */}
                    <div className="overflow-x-auto rounded-lg bg-white shadow">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell>Nama Klien</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Lokasi</TableCell>
                                    <TableCell>Tanggal Acara</TableCell>
                                    <TableCell>Tipe Paket</TableCell>
                                    <TableCell>Harga</TableCell>
                                    <TableCell>Aksi</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {klien.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.nama}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.lokasi}</TableCell>
                                        <TableCell>{format(new Date(item.tanggal_acara), 'dd MMM yyyy')}</TableCell>
                                        <TableCell>{item.paket.charAt(0).toUpperCase() + item.paket.slice(1)}</TableCell>
                                        <TableCell>{rupiahFormatter.format(Number(item.harga))}</TableCell>
                                        <TableCell className="flex space-x-2">
                                            {item.latestInvoiceFile && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        window.open(
                                                            route('invoices.show', { filename: item.latestInvoiceFile }),
                                                            '_blank',
                                                            'noopener',
                                                        )
                                                    }
                                                >
                                                    View
                                                </Button>
                                            )}
                                            <Button size="sm" variant="outline" onClick={() => openEditModal(item)}>
                                                Edit
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => deleteKlien(item.id)}>
                                                Hapus
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {klien.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-4 text-center">
                                            Tidak ada data klien.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Links */}
                    <div className="mt-4">
                        <AppPagination links={klien.links} />
                    </div>
                </div>

                {/* Modal “Tambah Klien” */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogOverlay className="fixed inset-0 flex items-center justify-center bg-black/50" />

                    <DialogContent className="max-w-lg rounded-lg bg-white p-6 shadow-lg">
                        <DialogTitle className="mb-4 text-xl font-semibold">Data Klien Baru</DialogTitle>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Dropdown Nama Klien */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">Nama Klien</label>
                                <Select value={form.data.klien_id?.toString() || ''} onValueChange={(val) => form.setData('klien_id', Number(val))}>
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
                                {form.errors.klien_id && <p className="mt-1 text-sm text-red-600">{form.errors.klien_id}</p>}
                            </div>

                            {/* Email otomatis */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">Email</label>
                                <Input type="email" value={selectedEmail} disabled className="bg-gray-100" />
                            </div>

                            {/* Lokasi */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">Lokasi</label>
                                <Input type="text" value={form.data.lokasi} onChange={(e) => form.setData('lokasi', e.target.value)} required />
                                {form.errors.lokasi && <p className="mt-1 text-sm text-red-600">{form.errors.lokasi}</p>}
                            </div>

                            {/* Tanggal Acara */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">Tanggal Acara</label>
                                <Input
                                    type="date"
                                    value={form.data.tanggal_acara}
                                    onChange={(e) => form.setData('tanggal_acara', e.target.value)}
                                    required
                                />
                                {form.errors.tanggal_acara && <p className="mt-1 text-sm text-red-600">{form.errors.tanggal_acara}</p>}
                            </div>

                            {/* Paket Layanan */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">Paket Layanan</label>
                                <Select value={form.data.paket} onValueChange={(value) => form.setData('paket', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Paket" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="basic">Basic</SelectItem>
                                        <SelectItem value="standar">Standar</SelectItem>
                                        <SelectItem value="premium">Premium</SelectItem>
                                    </SelectContent>
                                </Select>

                                {form.errors.paket && <p className="mt-1 text-sm text-red-600">{form.errors.paket}</p>}
                            </div>

                            {/* Harga */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">Harga (Rp)</label>
                                <CurrencyInput
                                    // name harus cocok dengan key di form.useForm
                                    name="harga"
                                    placeholder="Rp 0"
                                    className="w-full rounded border px-3 py-2"
                                    // prefix “Rp ”
                                    prefix="Rp "
                                    // gunakan thousand separator dot, decimal comma
                                    groupSeparator="."
                                    decimalSeparator=","
                                    decimalsLimit={2}
                                    onValueChange={(value) => {
                                        // value adalah string tanpa prefix, contoh: "15000,00"
                                        // kita ubah jadi number JS (misal 15000)
                                        const numeric = value ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : 0;
                                        form.setData('harga', numeric);
                                    }}
                                />
                                {form.errors.harga && <p className="mt-1 text-sm text-red-600">{form.errors.harga}</p>}
                            </div>

                            {/* Tombol Batal dan Tambah Data */}
                            <div className="mt-6 flex justify-end space-x-2">
                                <Button variant="outline" type="button" onClick={closeModal}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={form.processing}>
                                    Tambah Data
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal Edit Klien */}
                <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogOverlay className="fixed inset-0 flex items-center justify-center bg-black/50" />
                    <DialogContent className="max-w-lg rounded-lg bg-white p-6 shadow-lg">
                        <DialogTitle className="mb-4 text-xl font-semibold">Edit Klien</DialogTitle>

                        <form onSubmit={submitEdit} className="space-y-4">
                            {/* Dropdown Nama Klien */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">Nama Klien</label>
                                <Select
                                    value={editForm.data.klien_id?.toString() || ''}
                                    onValueChange={(val) => {
                                        const id = Number(val);
                                        editForm.setData('klien_id', id);
                                        const u = users.find((u) => u.id === id);
                                        setEditEmail(u ? u.email : '');
                                    }}
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
                                {editForm.errors.klien_id && <p className="text-sm text-red-600">{editForm.errors.klien_id}</p>}
                            </div>

                            {/* Email otomatis */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">Email</label>
                                <Input type="email" value={editEmail} disabled className="bg-gray-100" />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Lokasi</label>
                                <Input value={editForm.data.lokasi} onChange={(e) => editForm.setData('lokasi', e.target.value)} required />
                                {editForm.errors.lokasi && <p className="text-sm text-red-600">{editForm.errors.lokasi}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Tanggal Acara</label>
                                <Input
                                    type="date"
                                    value={editForm.data.tanggal_acara}
                                    onChange={(e) => editForm.setData('tanggal_acara', e.target.value)}
                                    required
                                />
                                {editForm.errors.tanggal_acara && <p className="text-sm text-red-600">{editForm.errors.tanggal_acara}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Paket</label>
                                <Select value={editForm.data.paket} onValueChange={(value) => editForm.setData('paket', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Paket" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="basic">Basic</SelectItem>
                                        <SelectItem value="standar">Standar</SelectItem>
                                        <SelectItem value="premium">Premium</SelectItem>
                                    </SelectContent>
                                </Select>
                                {editForm.errors.paket && <p className="text-sm text-red-600">{editForm.errors.paket}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Harga (Rp)</label>
                                <CurrencyInput
                                    // name tidak wajib, tapi boleh disamakan untuk kemudahan debugging
                                    name="harga"
                                    placeholder="Rp 0"
                                    className="w-full rounded border px-3 py-2"
                                    prefix="Rp "
                                    groupSeparator="."
                                    decimalSeparator=","
                                    decimalsLimit={2}
                                    // Untuk edit, ambil value dari editForm.data.harga
                                    value={editForm.data.harga.toString()}
                                    onValueChange={(value) => {
                                        const numeric = value ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : 0;
                                        editForm.setData('harga', numeric);
                                    }}
                                />
                                {editForm.errors.harga && <p className="mt-1 text-sm text-red-600">{editForm.errors.harga}</p>}
                            </div>

                            <div className="mt-6 flex justify-end space-x-2">
                                <Button variant="outline" type="button" onClick={closeEditModal}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={editForm.processing}>
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
