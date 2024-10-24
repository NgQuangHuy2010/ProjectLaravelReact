<?php

namespace App\Services\ServicesClient;

use App\Repository\Interface\admin\ProductRepositoryInterface;



class FeaturedProductServiceClient
{
    protected $categoryRepository;

    public function __construct(ProductRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function getCategoryClient()
    {
        $categories = $this->categoryRepository->getAll()->load(['products.brand']);
        
        return $categories;
    }
}