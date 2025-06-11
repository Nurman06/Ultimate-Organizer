<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimelineKegiatan extends Model
{
    use HasFactory;

    protected $table = 'timeline_kegiatan';

    protected $fillable = ['kegiatan', 'nama_klien', 'deskripsi', 'tanggal', 'status'];
}
