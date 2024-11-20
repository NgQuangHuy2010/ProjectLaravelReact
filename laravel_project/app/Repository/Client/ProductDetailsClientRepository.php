<?php

namespace App\Repository\Client;

use App\Models\Products;
use App\Repository\Interface\client\ProductDetailsClientInterface;
use DB;



class ProductDetailsClientRepository implements ProductDetailsClientInterface
{
    public function productDetails($id)
    {
        $detailsProduct = Products::with('brand', 'attributes.attributeDefinition')
            ->where('id', $id)
            ->get();
        ;
        return $detailsProduct;

    }

}
