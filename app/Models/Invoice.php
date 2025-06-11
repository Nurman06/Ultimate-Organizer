<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'klien_id',
        'tanggal_invoice',
        'subtotal',
        'ppn',
        'total',
        'status',
    ];

    public function klien()
    {
        return $this->belongsTo(Klien::class);
    }
}
