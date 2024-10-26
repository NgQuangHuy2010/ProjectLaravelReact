<?php

namespace App\Repository\Client;

use App\Models\Products;
use App\Repository\Interface\client\FindProductsByCategoryInterface;

class FindProductsByCategoryRepository implements FindProductsByCategoryInterface
{

    public function getProductsByCategory($categoryId)
    {
        
        $products = Products::where('idCategory', $categoryId)->get();
        return $products;
    }

}