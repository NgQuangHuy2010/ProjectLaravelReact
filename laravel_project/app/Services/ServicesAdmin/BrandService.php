<?php

namespace App\Services\ServicesAdmin;
use App\Repository\Interface\admin\BrandRepositoryInterface;


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