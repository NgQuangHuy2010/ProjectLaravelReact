<?php

namespace App\Repository\Client;

use App\Models\Products;
use App\Repository\Interface\client\SearchProductClientInterface;

class SearchProductClientRepository implements SearchProductClientInterface
{

    public function getSearchAll()
    {
        $product = Products::get();

        return $product;
    }
}