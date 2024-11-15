<?php

namespace Database\Seeders;

use App\Models\ProductAttribute;
use App\Models\Products;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DeleteProductsDataFakeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProductAttribute::where('created_at', '>=', '2024-11-15 00:00:00')->delete();

        // Xóa các sản phẩm được tạo từ thời điểm nhất định
        Products::where('created_at', '>=', '2024-11-15 00:00:00')->delete();
    }
}
