// resources/js/Pages/Admin/BajuAdat/Index.tsx

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AppPagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { toast } from 'sonner';

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
});

interface BajuAdat {
    id: number;
    nama: string;
    gambar: string | null;
    harga: number;
    stok: number;
}

interface Props {
    bajuAdat: {
        data: BajuAdat[];
        current_page: number;
        per_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search: string;
        per_page: number;
    };
}

export default function AdminBajuAdat({ bajuAdat, filters }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedBajuAdat, setSelectedBajuAdat] = useState<BajuAdat | null>(null);

    const [perPage, setPerPage] = useState(bajuAdat.per_page);

    const form = useForm({
        nama: '',
        gambar: null as File | null,
        harga: 0,
        stok: 0,
    });

    const editForm = useForm({
        id: 0,
        nama: '',
        gambar: null as File | null,
        existingGambar: '',
        harga: 0,
        stok: 0,
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        form.reset();
        setIsModalOpen(false);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nama', form.data.nama);
        formData.append('harga', form.data.harga.toString());
        formData.append('stok', form.data.stok.toString());
        if (form.data.gambar) {
            formData.append('gambar', form.data.gambar);
        }

        form.post(route('admin.baju-adat.store'), {
            onSuccess: () => {
                toast.success('Baju adat berhasil ditambahkan');
                closeModal();
            },
            onError: () => {
                toast.error('Gagal menambahkan baju adat');
            },
            forceFormData: true,
        });
    };

    const openEditModal = (baju: BajuAdat) => {
        setSelectedBajuAdat(baju);
        editForm.setData({
            id: baju.id,
            nama: baju.nama,
            existingGambar: baju.gambar || '',
            harga: baju.harga,
            stok: baju.stok,
            gambar: null,
        });
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedBajuAdat(null);
        editForm.reset();
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nama', editForm.data.nama);
        formData.append('harga', editForm.data.harga.toString());
        formData.append('stok', editForm.data.stok.toString());
        formData.append('_method', 'PUT');
        if (editForm.data.gambar) {
            formData.append('gambar', editForm.data.gambar);
        }

        form.post(route('admin.baju-adat.store'), {
            onSuccess: () => {
                toast.success('Baju adat berhasil ditambahkan');
                closeModal();
            },
            onError: () => {
                toast.error('Gagal menambahkan baju adat');
            },
            forceFormData: true,
        });
    };

    const deleteBajuAdat = (id: number) => {
        if (confirm('Yakin ingin menghapus baju adat ini?')) {
            router.delete(route('admin.baju-adat.destroy', id));
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.currentTarget.search as HTMLInputElement;
        router.get(route('admin.baju-adat.index'), { search: target.value, per_page: perPage }, { preserveState: true, replace: true });
    };

    const handlePerPageChange = (value: number) => {
        setPerPage(value);
        router.get(route('admin.baju-adat.index'), { per_page: value, search: filters.search }, { preserveState: true, replace: true });
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Manajemen Baju Adat', href: route('admin.baju-adat.index') }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Baju Adat" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Manajemen Baju Adat</h1>
                    <p className="text-muted-foreground">Kelola koleksi gaun dan baju adat tradisional</p>
                </div>

                <div className="grid auto-rows-min gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <form onSubmit={handleSearch} className="flex items-center space-x-2">
                            <Input name="search" placeholder="Cari berdasarkan nama" defaultValue={filters.search} className="w-64" />
                            <Button type="submit">Search</Button>
                        </form>

                        <div className="flex items-center space-x-2">
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

                            <Button onClick={openModal}>Tambah Baju Adat</Button>
                        </div>
                    </div>

                    <div className="text-sm text-gray-700">
                        Menampilkan {bajuAdat.from} sampai {bajuAdat.to} dari total {bajuAdat.total} baju adat
                    </div>

                    <div className="overflow-x-auto rounded-lg bg-white shadow">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell>Nama Baju Adat</TableCell>
                                    <TableCell>Gambar</TableCell>
                                    <TableCell>Harga</TableCell>
                                    <TableCell>Stok</TableCell>
                                    <TableCell>Aksi</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bajuAdat.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.nama}</TableCell>
                                        <TableCell>
                                            {item.gambar && (
                                                <img src={`/storage/${item.gambar}`} alt={item.nama} className="h-12 w-12 rounded object-cover" />
                                            )}
                                        </TableCell>
                                        <TableCell>{rupiahFormatter.format(item.harga)}</TableCell>
                                        <TableCell>{item.stok}</TableCell>
                                        <TableCell className="flex space-x-2">
                                            <Button size="sm" variant="outline" onClick={() => openEditModal(item)}>
                                                Edit
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => deleteBajuAdat(item.id)}>
                                                Hapus
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {bajuAdat.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-4 text-center">
                                            Tidak ada data baju adat.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4">
                        <AppPagination links={bajuAdat.links} />
                    </div>
                </div>

                {/* Modal Tambah */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogOverlay className="fixed inset-0 flex items-center justify-center bg-black/50" />

                    <DialogContent className="max-w-lg rounded-lg bg-white p-6 shadow-lg">
                        <DialogTitle className="mb-4 text-xl font-semibold">Tambah Baju Adat</DialogTitle>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Nama Baju Adat</label>
                                <Input type="text" value={form.data.nama} onChange={(e) => form.setData('nama', e.target.value)} required />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Gambar</label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            form.setData('gambar', e.target.files[0]);
                                        }
                                    }}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Harga (Rp)</label>
                                <CurrencyInput
                                    placeholder="Rp 0"
                                    className="w-full rounded border px-3 py-2"
                                    prefix="Rp "
                                    groupSeparator="."
                                    decimalSeparator=","
                                    decimalsLimit={2}
                                    onValueChange={(value) => {
                                        const numeric = value ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : 0;
                                        form.setData('harga', numeric);
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Stok</label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={form.data.stok}
                                    onChange={(e) => form.setData('stok', parseInt(e.target.value) || 0)}
                                    required
                                />
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
                        <DialogTitle className="mb-4 text-xl font-semibold">Edit Baju Adat</DialogTitle>

                        <form onSubmit={submitEdit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Nama Baju Adat</label>
                                <Input value={editForm.data.nama} onChange={(e) => editForm.setData('nama', e.target.value)} required />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Gambar</label>
                                {editForm.data.existingGambar && (
                                    <div className="mb-2">
                                        <img
                                            src={`/storage/${editForm.data.existingGambar}`}
                                            alt="Current"
                                            className="h-20 w-20 rounded object-cover"
                                        />
                                    </div>
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            editForm.setData('gambar', e.target.files[0]);
                                        }
                                    }}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Harga (Rp)</label>
                                <CurrencyInput
                                    placeholder="Rp 0"
                                    className="w-full rounded border px-3 py-2"
                                    prefix="Rp "
                                    groupSeparator="."
                                    decimalSeparator=","
                                    decimalsLimit={2}
                                    value={editForm.data.harga.toString()}
                                    onValueChange={(value) => {
                                        const numeric = value ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : 0;
                                        editForm.setData('harga', numeric);
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Stok</label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={editForm.data.stok}
                                    onChange={(e) => editForm.setData('stok', parseInt(e.target.value) || 0)}
                                    required
                                />
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
