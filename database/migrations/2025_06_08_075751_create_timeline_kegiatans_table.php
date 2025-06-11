<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('timeline_kegiatan', function (Blueprint $table) {
            $table->id();
            $table->string('kegiatan');
            $table->string('nama_klien');
            $table->text('deskripsi');
            $table->date('tanggal');
            $table->string('status')->default('Belum'); // belum, Dalam Proses, Seledai
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timeline_kegiatan');
    }
};
