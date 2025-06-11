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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->foreignId('klien_id')->constrained('klien')->onDelete('cascade');
            $table->date('tanggal_invoice');
            $table->decimal('subtotal', 15, 2);
            $table->decimal('ppn', 15, 2)->default(0);
            $table->decimal('total', 15, 2);
            $table->string('status')->default('unpaid'); // unpaid/paid
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
