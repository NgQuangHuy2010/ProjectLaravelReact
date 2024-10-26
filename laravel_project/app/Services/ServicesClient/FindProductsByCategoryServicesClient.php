<?php

namespace App\Services\ServicesClient;

use App\Repository\Interface\client\FindProductsByCategoryInterface;



class FindProductsByCategoryServicesClient
{
    protected $findProductsByCategoryInterface;

    public function __construct(FindProductsByCategoryInterface $findProductsByCategoryInterface)
    {
        $this->findProductsByCategoryInterface = $findProductsByCategoryInterface;
    }

    public function getProductsByCategoryClient($categoryId)
    {
        $products = $this->findProductsByCategoryInterface->getProductsByCategory($categoryId);

        foreach ($products as $productImage) {
            $productImage->image_url = $productImage->image
                ? asset('file/img/img_product/' . $productImage->image)
                : null;
        }
        return $products;
    }
}