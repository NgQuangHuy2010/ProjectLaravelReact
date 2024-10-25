<?php

namespace App\Repository\Client;

use App\Models\Products;
use App\Repository\Interface\client\FeaturedProductClientInterface;

class FeaturedProductClientRepository implements FeaturedProductClientInterface
{

    public function getAll()
    {
        $product = Products::inRandomOrder()->take(16)->get();

        return $product;
    }
}