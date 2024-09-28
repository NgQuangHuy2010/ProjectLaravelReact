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
        Schema::table('products', function (Blueprint $table) {
            // Thiết lập khóa ngoại
            // dùng ->onDelete('restrict') để thiết lập Không cho phép xóa bản ghi trong bảng cha nếu còn bản ghi tham chiếu trong bảng con
            $table->foreign('idCategory')->references('id')->on('category')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
