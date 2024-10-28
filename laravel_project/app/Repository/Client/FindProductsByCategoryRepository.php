<?php

namespace App\Repository\Client;

use App\Models\Products;
use App\Repository\Interface\client\FindProductsByCategoryInterface;

class FindProductsByCategoryRepository implements FindProductsByCategoryInterface
{

    public function getProductsByCategory($categoryId, $brandName = null)
    {

        $products = Products::with('brand')
            ->where('idCategory', $categoryId);

            if (!empty($brandName)) {
                $products->whereHas('brand', function ($q) use ($brandName) {
                    $q->where('name', 'like', "%$brandName%");
                });
            }

        return $products->get();
    }

}