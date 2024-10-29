<?php

namespace Database\Seeders;

use App\Models\Products;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $minPrice = 5000000;  // 5 triệu
        $maxPrice = 30000000; // 30 triệu

        // Lấy tất cả các sản phẩm
        $products = DB::table('products')->get();

        foreach ($products as $product) {
            // Tạo giá sản phẩm ngẫu nhiên với hàng trăm là 0
            $priceProduct = (mt_rand($minPrice / 1000, $maxPrice / 1000) * 1000);

            // Tạo discount nhỏ hơn priceProduct và đảm bảo cũng là số chẵn
            $discount = (mt_rand(0, (int)($priceProduct * 0.9) / 1000) * 1000); // Tạo discount tối đa là 90% của priceProduct

            // Cập nhật giá cho sản phẩm
            DB::table('products')->where('id', $product->id)->update([
                'price_product' => number_format($priceProduct, 2, '.', ''),
                'discount' => number_format($discount, 2, '.', ''),
            ]);
        }
    }
}
