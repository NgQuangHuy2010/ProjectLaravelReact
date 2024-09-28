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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table ->string("name_product");
            $table->text('description')->nullable();  
            $table->decimal('price_product', 15, 2)->nullable();
            $table->decimal('discount', 15, 2)->nullable(); 
            $table->string('image')->nullable();  
            $table->json('images')->nullable();  
            $table->unsignedBigInteger('idCategory'); 
            $table->boolean('status')->default(true)->nullable();
            $table->string('product_model')->nullable();
            $table->string('origin')->nullable();
            $table->string('image_specifications')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
        
    }
};
