<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BajuAdat extends Model
{
    use HasFactory;

    protected $table = 'baju_adat';

    protected $fillable = ['nama', 'gambar', 'harga', 'stok'];
}
