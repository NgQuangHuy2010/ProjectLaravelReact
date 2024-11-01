<?php

namespace App\Repository\Interface\admin;


interface ProductAttributeRepositoryInterface extends RepositoryInterface
{
   
    public function getByProductId($productId);
    public function create(array $attributes);
}