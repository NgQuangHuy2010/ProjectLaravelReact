<?php

namespace App\Services;
use App\Repository\Brand\BrandRepositoryInterface;


class BrandService
{
    protected $brandRepository;

    public function __construct(BrandRepositoryInterface $brandRepository)
    {
        $this->brandRepository = $brandRepository;
    }

    public function getAllbrand()
    {
        return $this->brandRepository->getAll();
     
    }
}