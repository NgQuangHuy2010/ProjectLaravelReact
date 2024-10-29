<?php

namespace App\Repository\Client;

use App\Models\Products;
use App\Repository\Interface\client\FindProductsByCategoryInterface;

class FindProductsByCategoryRepository implements FindProductsByCategoryInterface
{

    public function getProductsByCategory($categoryId, $brandName = null, $priceRange= null)
    {

        $products = Products::with('brand')
            ->where('idCategory', $categoryId);

            if (!empty($brandName)) {
                $products->whereHas('brand', function ($q) use ($brandName) {
                    $q->where('name', 'like', "%$brandName%");
                });
            }

            $priceRanges = [
                '0-10000000'    => [0, 9999999],           // Dưới 10 triệu
                '10000000-15000000'  => [10000000, 14999999],   // 10 - 15 triệu
                '15000000-20000000'  => [15000000, 19999999],   // 15 - 20 triệu
                '20000000-25000000'  => [20000000, 24999999],   // 20 - 25 triệu
                '25000000-99999999'    => [25000000, PHP_INT_MAX] // Trên 25 triệu
            ];
        
            // Lọc theo khoảng giá nếu có
            if (!empty($priceRange) && isset($priceRanges[$priceRange])) {
                [$minPrice, $maxPrice] = $priceRanges[$priceRange];
                $products->whereBetween('discount', [$minPrice, $maxPrice]);
            }

        return $products->get();
    }

}