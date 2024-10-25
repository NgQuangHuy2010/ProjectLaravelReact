<?php

namespace App\Services\ServicesClient;

use App\Repository\Interface\client\SearchProductClientInterface;



class SearchProductServiceClient
{
    protected $searchProductClientInterface;

    public function __construct(SearchProductClientInterface $searchProductClientInterface)
    {
        $this->searchProductClientInterface = $searchProductClientInterface;
    }

    public function getSearchProductClient()
    {
        $products = $this->searchProductClientInterface->getSearchAll();

        foreach ($products as $productImage) {
            $productImage->image_url = $productImage->image
                ? asset('file/img/img_product/' . $productImage->image)
                : null;
        }
        return $products;
    }
}