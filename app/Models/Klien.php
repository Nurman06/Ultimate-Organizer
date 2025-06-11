<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Klien extends Model
{
    use HasFactory;

    protected $table = 'klien';   // opsional, karena Laravel otomatis mencari tabel "klien"

    protected $fillable = [
        'nama',
        'email',
        'lokasi',
        'tanggal_acara',
        'paket',
        'harga',
    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
