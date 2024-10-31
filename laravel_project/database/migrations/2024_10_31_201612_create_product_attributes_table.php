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
        Schema::create('product_attributes', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger('product_id'); 
            $table->unsignedBigInteger('attribute_definition_id'); 
            $table->string('attribute_value'); 
            $table->timestamps(); 
            
            // Thiết lập khóa ngoại cho product_id và attribute_definition_id
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('attribute_definition_id')->references('id')->on('attribute_definitions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_attributes');
    }
};
