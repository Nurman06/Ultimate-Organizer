import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { FormEvent } from 'react';

// Interface item progress acara
interface ProgressAcaraItem {
    id: number;
    kegiatan: string;
    deskripsi: string;
    tanggal: string;
    status: 'Belum' | 'Dalam Proses' | 'Selesai';
}

interface Props {
    items: ProgressAcaraItem[];
    filters: {
        search: string;
    };
}

export default function ProgressAcara({ items, filters }: Props) {
    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const q = (e.currentTarget.search as HTMLInputElement).value;
        router.get(route('user.progress-acara.index'), { search: q }, { preserveState: true, replace: true });
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Progress Acara', href: route('user.progress-acara.index') }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Progress Acara" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="space-y-6 p-4">
                    {/* Judul & Subjudul */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">Progress Terkini</h1>
                        <p className="text-muted-foreground">Pantau perkembangan persiapan pernikahan Anda</p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex items-center space-x-2">
                        <Input name="search" placeholder="Cari berdasarkan nama" defaultValue={filters.search} className="w-64" />
                        <Button type="submit">Search</Button>
                    </form>

                    {/* Cards in 2 Columns */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {items.length > 0 ? (
                            items.map((item) => (
                                <Card key={item.id} className="relative flex w-full flex-col justify-between rounded-lg bg-gray-100 p-4">
                                    {/* Badge status pojok kanan atas */}
                                    <div className="absolute top-4 right-4">
                                        <Badge
                                            className={
                                                item.status === 'Belum'
                                                    ? 'bg-gray-300 text-gray-700'
                                                    : item.status === 'Dalam Proses'
                                                      ? 'bg-yellow-400 text-black'
                                                      : 'bg-green-400 text-white'
                                            }
                                        >
                                            {item.status === 'Belum' ? 'Belum Dimulai' : item.status === 'Dalam Proses' ? 'Proses' : 'Selesai'}
                                        </Badge>
                                    </div>

                                    {/* Judul dan dot status */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`h-3 w-3 rounded-full ${
                                                    item.status === 'Belum'
                                                        ? 'bg-gray-400'
                                                        : item.status === 'Dalam Proses'
                                                          ? 'bg-yellow-400'
                                                          : 'bg-green-400'
                                                }`}
                                            />
                                            <h3 className="text-lg font-semibold">{item.kegiatan}</h3>
                                        </div>

                                        {/* Deskripsi dan tanggal diselaraskan */}
                                        <div className="pl-5">
                                            <p className="text-sm text-black">{item.deskripsi}</p>
                                            <p className="text-xs text-black">Tanggal: {format(new Date(item.tanggal), 'dd MMM yyyy')}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="text-muted-foreground col-span-full py-8 text-center">Tidak ada progress acara.</div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
