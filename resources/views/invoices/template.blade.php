<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .details, .items { width: 100%; margin-bottom: 20px; }
        .items th, .items td { border-bottom: 1px solid #ddd; padding: 8px; }
        .right { text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <h2>INVOICE</h2>
        <p>No: {{ $invoice->invoice_number }}</p>
        <p>Tanggal: {{ \Carbon\Carbon::parse($invoice->tanggal_invoice)->format('d M Y') }}</p>
    </div>

    <table class="details">
        <tr>
            <td>
                <strong>Bill To:</strong><br>
                {{ $invoice->klien->nama }}<br>
                {{ $invoice->klien->email }}<br>
                {{ $invoice->klien->lokasi }}
            </td>
            <td class="right">
                <strong>Status:</strong><br>
                {{ ucfirst($invoice->status) }}
            </td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th>Deskripsi Layanan</th>
                <th class="right">Harga (Rp)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Paket {{ ucfirst($invoice->klien->paket) }} — {{ \Carbon\Carbon::parse($invoice->klien->tanggal_acara)->format('d M Y') }}</td>
                <td class="right">{{ number_format($invoice->subtotal, 2, ',', '.') }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td class="right"><strong>Subtotal</strong></td>
                <td class="right">{{ number_format($invoice->subtotal, 2, ',', '.') }}</td>
            </tr>
            <tr>
                <td class="right"><strong>PPN</strong></td>
                <td class="right">{{ number_format($invoice->ppn, 2, ',', '.') }}</td>
            </tr>
            <tr>
                <td class="right"><strong>Total</strong></td>
                <td class="right"><strong>{{ number_format($invoice->total, 2, ',', '.') }}</strong></td>
            </tr>
        </tfoot>
    </table>

    <p>Terima kasih atas kepercayaan Anda!</p>
</body>
</html>