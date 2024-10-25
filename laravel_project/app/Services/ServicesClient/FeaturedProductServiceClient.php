<?php

namespace App\Services\ServicesClient;

use App\Repository\Interface\client\FeaturedProductClientInterface;



class FeaturedProductServiceClient
{
    protected $featuredProductClientInterface;

    public function __construct(FeaturedProductClientInterface $featuredProductClientInterface)
    {
        $this->featuredProductClientInterface = $featuredProductClientInterface;
    }

    public function getFeaturedProductClient()
    {
        $products = $this->featuredProductClientInterface->getAll();

        foreach ($products as $productImage) {
            $productImage->image_url = $productImage->image
                ? asset('file/img/img_product/' . $productImage->image)
                : null;
        }
        return $products;
    }
}