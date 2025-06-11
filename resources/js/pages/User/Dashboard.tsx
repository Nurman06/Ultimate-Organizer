// resources/js/pages/User/Dashboard.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar, ChevronRight, MapPin } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'User Dashboard', href: '/user/dashboard' }];

interface ProgressAcaraItem {
    id: number;
    kegiatan: string;
    tanggal: string;
    status: 'Belum' | 'Dalam Proses' | 'Selesai';
}

export default function UserDashboard() {
    const { user, klien, progressPct, items } = usePage<{
        user: { name: string };
        klien: { tanggal_acara: string; lokasi: string; paket: string } | null;
        progressPct: number;
        items: ProgressAcaraItem[];
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Greeting */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                        Hello, {user.name}! <span className="text-2xl">👋</span>
                    </h1>
                    <p className="text-muted-foreground">Welcome back!</p>
                </div>

                {/* Acara Saya */}
                {klien && (
                    <div className="px-6">
                        <Card className="w-full max-w-xl rounded-xl border shadow-none">
                            <CardHeader className="space-y-3 pb-2">
                                <div className="text-brown-800 flex items-center gap-2 text-lg font-semibold">
                                    <Calendar size={20} className="text-brown-600" /> Acara Saya
                                </div>

                                {/* Tanggal dan Lokasi dalam kolom agar rapi di mobile */}
                                <div className="text-muted-foreground flex flex-col gap-1 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        {new Date(klien.tanggal_acara).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={16} />
                                        {klien.lokasi}
                                    </div>
                                </div>

                                <Badge className="bg-muted text-muted-foreground w-fit rounded-md px-3 py-1 text-xs font-medium">{klien.paket}</Badge>
                            </CardHeader>

                            <CardContent className="space-y-4 pt-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Progress Keseluruhan</p>
                                    <div className="flex items-center gap-2">
                                        <Progress value={progressPct} className="h-2 flex-1 bg-gray-200" />
                                        <span className="text-sm font-semibold text-gray-700">{progressPct}%</span>
                                    </div>
                                </div>

                                {/* Tombol dibuat stack di mobile */}
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-brown-800 w-full justify-center border hover:bg-[#e6d6c8]"
                                        onClick={() => router.visit('/user/progress-acara')}
                                    >
                                        Lihat Detail Progress <ChevronRight size={16} className="ml-1" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-brown-800 w-full justify-center border hover:bg-[#e6d6c8]"
                                        onClick={() => router.visit('/user/jadwalkan-meeting')}
                                    >
                                        Jadwalkan Meeting <ChevronRight size={16} className="ml-1" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Progress Terkini */}
                {/* Progress Terkini */}
                {items.length > 0 && (
                    <div className="px-6 pt-8">
                        <h2 className="text-xl font-bold">Progress Terkini</h2>
                        <p className="text-muted-foreground mb-4">Tahapan persiapan pernikahan Anda</p>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {items.map((item) => (
                                <Card key={item.id} className="relative flex flex-col justify-between rounded-lg bg-gray-100 p-4">
                                    {/* Status badge */}
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
                                        {/* Tanggal moved here */}
                                        <p className="mt-1 text-xs text-black">{format(new Date(item.tanggal), 'dd MMM yyyy')}</p>
                                    </div>

                                    {/* Judul + dot */}
                                    <div className="mb-2 flex items-center gap-2">
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
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
