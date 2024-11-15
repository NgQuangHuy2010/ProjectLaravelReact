<?php

namespace Database\Seeders;

use App\Models\ProductAttribute;
use App\Models\Products;
use App\Services\ServicesAdmin\ProductService;
use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductDataFakeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }
    public function run(): void
    {

          // Số lượng sản phẩm cần tạo
          $totalProducts = 1000;

          // Các giá trị ngẫu nhiên cho attribute_definition_id
          $sizeOptions = ['55inch', '43inch'];
          $resolutionOptions = ['4K', '2K', '8K'];
          $typeOptions = ['Tivi OLED', 'Tivi QLED'];
  
          // Hàm tạo giá ngẫu nhiên trong khoảng từ 5 triệu đến 30 triệu với số chẵn ở hàng trăm
          function generateRandomPrice()
          {
              return rand(5000000, 30000000) - rand(5000000, 30000000) % 1000;
          }
          
          // Tạo sản phẩm và các thuộc tính của nó
          for ($i = 0; $i < $totalProducts; $i++) {
              DB::transaction(function () use ($i, $sizeOptions, $resolutionOptions, $typeOptions) {
                  $productModel = $this->productService->generateProductModel();
                  $price = generateRandomPrice();
                  $discount = rand(1000000, $price / 2) - (rand(1000000, $price / 2) % 1000); // Giảm giá nhỏ hơn giá product
  
                  // Tạo sản phẩm mới
                  $product = Products::create([
                      'name_product' => 'Tivi ' . ($i + 1),
                      'product_model' => $productModel,
                      'price_product' => $price,
                      'discount' => $discount,
                      'image' => 'tivi-image.jpg',
                      'idCategory' => 27,
                      'brand_id' => rand(19, 25),
                  ]);
  
                  // Tạo thuộc tính cho sản phẩm
                  ProductAttribute::create([
                      'product_id' => $product->id,
                      'attribute_definition_id' => 1,
                      'attribute_value' => $sizeOptions[array_rand($sizeOptions)],
                  ]);
  
                  ProductAttribute::create([
                      'product_id' => $product->id,
                      'attribute_definition_id' => 2,
                      'attribute_value' => $resolutionOptions[array_rand($resolutionOptions)],
                  ]);
  
                  ProductAttribute::create([
                      'product_id' => $product->id,
                      'attribute_definition_id' => 3,
                      'attribute_value' => $typeOptions[array_rand($typeOptions)],
                  ]);
              });
          }
  
    }
}
