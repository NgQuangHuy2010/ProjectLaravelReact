<?php

namespace App\Repository\Interface\client;
interface FindProductsByCategoryInterface
{
    public function getProductsByCategory($categoryId, $brandName = null,$priceRange= null, $sort_order= null,$attributes = [],$perPage);
}