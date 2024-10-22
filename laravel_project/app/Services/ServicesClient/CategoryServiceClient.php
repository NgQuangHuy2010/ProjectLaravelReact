<?php

namespace App\Services\ServicesClient;
use App\Repository\Category\CategoryRepositoryInterface;


class CategoryServiceClient
{
    protected $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function getCategoryClient()
    {
        $categories = $this->categoryRepository->getAll()->load(['products.brand']);

        return $categories;
    }
}