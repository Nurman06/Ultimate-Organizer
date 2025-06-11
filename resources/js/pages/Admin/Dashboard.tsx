import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { CalendarIcon, CheckCircle, Clock, CreditCard, Users } from 'lucide-react';
import React, { useMemo, useState } from 'react';

type EventItem = {
    tanggal: string; // 'YYYY-MM-DD'
    waktu: string; // 'HH:mm'
    nama_klien: string;
    kegiatan: string;
    deskripsi?: string;
};

type Props = {
    stats: {
        totalKlien: number;
        pctKlien: number | null;
        acaraSelesai: number;
        pctSelesai: number | null;
        acaraAktif: number;
        pctAktif: number | null;
        pendapatan: number;
        pctPendapatan: number | null;
    };
    events: EventItem[];
};

export default function AdminDashboard() {
    dayjs.locale('id');
    const todayFormatted = dayjs().format('D MMM YYYY');
    const { stats, events } = usePage<Props>().props;

    // Bulan yang sedang ditampilkan
    const [currentMonth, setCurrentMonth] = useState(dayjs());

    // 1) Filter semua event di bulan aktif
    const eventsThisMonth = useMemo(() => events.filter((e) => dayjs(e.tanggal).isSame(currentMonth, 'month')), [events, currentMonth]);

    // 2) Ekstrak tanggal unik untuk marking
    const blockedDates = useMemo(() => {
        const uniq = Array.from(new Set(eventsThisMonth.map((e) => e.tanggal)));
        return uniq.map((d) => new Date(d));
    }, [eventsThisMonth]);

    // 3) Group events per hari untuk listing
    const eventsByDay = useMemo(() => {
        return eventsThisMonth.reduce<Record<string, EventItem[]>>((acc, e) => {
            (acc[e.tanggal] = acc[e.tanggal] || []).push(e);
            return acc;
        }, {});
    }, [eventsThisMonth]);

    const cards = [
        { title: 'Total Klien', value: stats.totalKlien, pct: stats.pctKlien, icon: <Users />, bg: 'bg-purple-50', color: 'text-purple-600' },
        {
            title: 'Acara Selesai',
            value: stats.acaraSelesai,
            pct: stats.pctSelesai,
            icon: <CheckCircle />,
            bg: 'bg-green-50',
            color: 'text-green-600',
        },
        { title: 'Acara Aktif', value: stats.acaraAktif, pct: stats.pctAktif, icon: <Clock />, bg: 'bg-yellow-50', color: 'text-yellow-600' },
        { title: 'Pendapatan', value: stats.pendapatan, pct: stats.pctPendapatan, icon: <CreditCard />, bg: 'bg-blue-50', color: 'text-blue-600' },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Admin Dashboard', href: '/admin/dashboard' }]}>
            <Head title="Admin Dashboard" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="inline-flex items-center gap-2 text-3xl font-bold">
                        Hello Admin <span className="text-2xl">👋</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">Welcome Back!</p>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row">
                    {/* Statistik Cards: 2 kolom */}
                    <div className="grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
                        {cards.map(({ title, value, pct, icon, bg, color }) => (
                            <Card key={title} className="w-full max-w-[16rem] rounded-lg border">
                                <CardHeader className="flex items-center gap-3 pb-0">
                                    <div className={`${bg} rounded-md p-2`}>{React.cloneElement(icon, { className: `w-5 h-5 ${color}` })}</div>
                                    <span className="font-medium">{title}</span>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="text-3xl font-bold">
                                        {title === 'Pendapatan' ? `Rp ${new Intl.NumberFormat('id-ID').format(value)}` : value}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex items-center justify-between pt-0">
                                    <span className="text-sm text-gray-500">Per: {todayFormatted}</span>
                                    <span
                                        className={`text-sm font-medium ${
                                            pct === null
                                                ? 'bg-blue-100 text-blue-700'
                                                : pct >= 0
                                                  ? 'bg-green-100 text-green-700'
                                                  : 'bg-red-100 text-red-700'
                                        } rounded px-2 py-0.5`}
                                    >
                                        {pct === null ? 'Baru' : `${pct >= 0 ? '▲' : '▼'} ${Math.abs(pct)}`}%
                                    </span>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Timeline Kegiatan Card */}
                    <div className="w-full max-w-sm">
                        <Card className="overflow-hidden rounded-lg border">
                            {/* 1. Header: icon di kiri, title di kanan */}
                            <CardHeader className="relative h-12">
                                <CalendarIcon className="absolute top-3 right-3 h-5 w-5 text-gray-600" />
                                <CardTitle className="absolute top-2 left-3 m-0 text-lg font-semibold">Timeline Kegiatan</CardTitle>
                            </CardHeader>

                            <CardContent className="px-4 pt-1">
                                {' '}
                                {/* dikurangi padding-top */}
                                {/* 2. Calendar: angkat lebih ke atas, beri margin-bottom untuk spasi */}
                                <Calendar
                                    mode="single"
                                    onSelect={() => {}}
                                    selected={undefined}
                                    month={currentMonth.toDate()}
                                    onMonthChange={(date) => setCurrentMonth(dayjs(date))}
                                    modifiers={{ meeting: blockedDates }}
                                    modifiersClassNames={{ meeting: 'bg-purple-600 !text-white' }}
                                    classNames={{ day: 'pointer-events-none' }}
                                    className="mx-auto mb-4"
                                />
                                {/* List semua meeting di bulan ini */}
                                <div className="mt-4 max-h-[150px] overflow-y-auto pr-2">
                                    <div className="flex flex-col items-center space-y-6">
                                        {Object.entries(eventsByDay).map(([tgl, evs]) => (
                                            <div key={tgl} className="space-y-3">
                                                <div className="mb-2 text-sm font-medium">{dayjs(tgl).format('dddd, D MMM YYYY')}</div>
                                                {evs.map((e, i) => (
                                                    <div key={i} className="flex items-start gap-4">
                                                        <div className="w-12 text-base font-bold">{dayjs(e.waktu, 'HH:mm').format('HH:mm')}</div>
                                                        <div className="mt-1 h-6 w-px bg-purple-300" />
                                                        <div className="flex-1">
                                                            <div className="text-xs text-gray-500">Klien {e.nama_klien}</div>
                                                            <div className="text-lg font-semibold">{e.kegiatan}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
