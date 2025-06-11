import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { FormEvent } from 'react';

interface BajuAdat {
    id: number;
    nama: string;
    gambar: string | null;
    harga: number;
    stok: number;
}

interface Props {
    bajuAdat: BajuAdat[];
    filters: {
        search: string;
    };
}

export default function KatalogBajuAdat({ bajuAdat, filters }: Props) {
    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const q = (e.currentTarget.search as HTMLInputElement).value;
        router.get(route('user.katalog-baju-adat'), { search: q }, { preserveState: true, replace: true });
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Katalog Baju Adat', href: route('user.katalog-baju-adat') }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Katalog Baju Adat" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Katalog Baju Adat</h1>
                    <p className="text-muted-foreground">Pilih baju adat tradisional untuk acara pernikahan Anda</p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                    <Input name="search" placeholder="Cari berdasarkan nama" defaultValue={filters.search} className="w-64" />
                    <Button type="submit">Search</Button>
                </form>

                {/* Katalog Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {bajuAdat.length > 0 ? (
                        bajuAdat.map((item) => (
                            <div key={item.id} className="overflow-hidden rounded-lg bg-white shadow-md">
                                <div className="relative">
                                    {item.gambar ? (
                                        <img src={`/storage/${item.gambar}`} alt={item.nama} className="h-95 w-full object-cover" />
                                    ) : (
                                        <div className="h-95 w-full bg-gray-200" />
                                    )}
                                    {item.stok > 0 && (
                                        <span className="absolute bottom-2 left-2 rounded-full bg-yellow-400 px-2 py-1 text-xs font-semibold text-black">
                                            {`Stok ${item.stok}`}
                                        </span>
                                    )}
                                </div>
                                <div className="p-3 text-left">
                                    <h2 className="truncate text-lg leading-tight font-semibold">{item.nama}</h2>
                                    <div className="mt-1 text-base">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga)}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-8 text-center text-gray-500">Tidak ada baju adat yang cocok.</div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
