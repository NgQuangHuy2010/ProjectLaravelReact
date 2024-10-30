<?php

namespace App\Repository\Client;

use App\Models\Products;
use App\Repository\Interface\client\FindProductsByCategoryInterface;

class FindProductsByCategoryRepository implements FindProductsByCategoryInterface
{
    protected $priceRanges = [
        '0-10000000' => [0, 9999999],
        '10000000-15000000' => [10000000, 14999999],
        '15000000-20000000' => [15000000, 19999999],
        '20000000-25000000' => [20000000, 24999999],
        '25000000-99999999' => [25000000, PHP_INT_MAX]
    ];
    public function getProductsByCategory($categoryId, $brandName = null, $priceRange = null, $sort_order = null)
    {

        $products = Products::with('brand')
            ->where('idCategory', $categoryId);

        if (!empty($brandName)) {
            $products->whereHas('brand', function ($q) use ($brandName) {
                $q->where('name', 'like', "%$brandName%");
            });
        }

        // Lọc theo khoảng giá nếu có
        if (!empty($priceRange) && isset($this->priceRanges[$priceRange])) {
            [$minPrice, $maxPrice] = $this->priceRanges[$priceRange];
            $products->whereBetween('discount', [$minPrice, $maxPrice]);
        }

        if (in_array($sort_order, ['asc', 'desc'])) {
            $products->orderBy('discount', $sort_order);
        }


        return $products->get();
    }

}