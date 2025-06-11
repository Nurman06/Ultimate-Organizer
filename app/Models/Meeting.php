<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'tanggal', 'waktu', 'jenis', 'catatan', 'status'];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
        'waktu' => 'datetime:H:i',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
