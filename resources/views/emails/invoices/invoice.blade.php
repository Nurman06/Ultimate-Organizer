@props(['invoice', 'isUpdate'])

<x-mail::message>

    {{-- Judul dinamis --}}
    @if ($isUpdate)
    ## Invoice Anda Telah Diperbarui
    @else
    ## Invoice Baru Anda
    @endif

    <p>Halo {{ $invoice->klien->nama }},</p>

    {{-- Pesan pembuka --}}
    @if ($isUpdate)
    <p>Silakan cek perbaikan invoice Anda di bawah ini:</p>
    @else
    <p>Terima kasih atas pemesanan Anda! Berikut invoice Anda:</p>
    @endif

    {{-- Tabel detail --}}
    <x-mail::table>
    | Keterangan          | Detail                                                      |
    | ------------------- | ----------------------------------------------------------- |
    | **Nomor Invoice**   | {{ $invoice->invoice_number }}                              |
    | **Tanggal Invoice** | {{ \Carbon\Carbon::parse($invoice->tanggal_invoice)->format('d M Y') }} |
    | **Tanggal Acara**   | {{ \Carbon\Carbon::parse($invoice->klien->tanggal_acara)->format('d M Y') }} |
    | **Paket**           | {{ ucfirst($invoice->klien->paket) }}                       |
    | **Subtotal**        | Rp {{ number_format($invoice->subtotal, 2, ',', '.') }}     |
    | **PPN**             | Rp {{ number_format($invoice->ppn, 2, ',', '.') }}          |
    | **Total**           | **Rp {{ number_format($invoice->total, 2, ',', '.') }}**    |
    </x-mail::table>

    {{-- Tombol view online dengan single‐quote di dalam --}}
    <x-mail::button :url="route('invoices.show', ['filename' => 'invoice_' . $invoice->invoice_number . '.pdf'])">
        Lihat Invoice di Browser
    </x-mail::button>

    <p>Jika ada pertanyaan, silakan balas email ini.</p>

    Terima kasih,<br>
    {{ config('app.name') }}

</x-mail::message>