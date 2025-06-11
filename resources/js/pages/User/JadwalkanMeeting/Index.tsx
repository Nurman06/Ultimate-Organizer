import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import React from 'react';
import { toast } from 'sonner';

export default function JadwalkanMeeting() {
    const form = useForm({ tanggal: '', waktu: '', jenis: '', catatan: '' });

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Jadwalkan Meeting', href: route('user.jadwalkan-meeting') }];

    // Buat array jam 00:00–23:00
    const timeOptions = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(route('user.jadwalkan-meeting'), {
            onSuccess: () => {
                toast.success('Meeting berhasil diajukan!');
                form.reset(); // reset form jika sukses
            },
            onError: () => {
                toast.error('Gagal mengajukan meeting. Silakan periksa kembali input Anda.');
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwalkan Meeting" />
            <div className="px-6 pt-6">
                <h1 className="text-2xl font-bold">Jadwalkan Meeting</h1>
                <p className="text-muted-foreground">Tentukan jadwal meeting bersama tim kami</p>
            </div>
            <Card className="mx-auto mt-8 max-w-2xl">
                <CardHeader className="px-8 pt-8">
                    <CardTitle>Form Penjadwalan Meeting</CardTitle>
                    <CardDescription>Isi form di bawah untuk mengajukan jadwal meeting</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <form onSubmit={submit} className="space-y-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Pilih Tanggal */}
                            <div className="space-y-2">
                                <Label htmlFor="tanggal">Pilih Tanggal</Label>
                                <Calendar
                                    className="w-full"
                                    mode="single"
                                    selected={form.data.tanggal ? new Date(form.data.tanggal) : undefined}
                                    onSelect={(date) => form.setData('tanggal', date ? format(date, 'yyyy-MM-dd') : '')}
                                />
                                <Input id="tanggal" type="hidden" value={form.data.tanggal} />
                            </div>

                            {/* Pilih Waktu & Jenis */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="waktu">Pilih Waktu</Label>
                                    <Select value={form.data.waktu} onValueChange={(val) => form.setData('waktu', val)}>
                                        <SelectTrigger id="waktu" className="w-full">
                                            <SelectValue placeholder="Pilih jam meeting" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeOptions.map((time) => (
                                                <SelectItem key={time} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="jenis">Jenis Meeting</Label>
                                    <Select value={form.data.jenis} onValueChange={(val) => form.setData('jenis', val)}>
                                        <SelectTrigger id="jenis" className="w-full">
                                            <SelectValue placeholder="Pilih jenis meeting" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Online">Online</SelectItem>
                                            <SelectItem value="Offline">Offline</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Catatan */}
                        <div className="space-y-2">
                            <Label htmlFor="catatan" className="block">
                                Catatan
                            </Label>
                            <Textarea
                                id="catatan"
                                rows={4}
                                value={form.data.catatan}
                                onChange={(e) => form.setData('catatan', e.currentTarget.value)}
                            />
                        </div>

                        {/* Tombol Submit */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={form.processing} className="bg-amber-600 hover:bg-amber-700">
                                Ajukan Meeting
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
