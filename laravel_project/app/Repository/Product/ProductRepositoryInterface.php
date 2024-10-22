<?php

namespace App\Repository\Product;
use App\Repository\RepositoryInterface;


interface ProductRepositoryInterface extends RepositoryInterface
{
    public function getAll();
    public function delete($id);
    public function create(array $attributes);
    public function update($id, array $attributes);
    public function find($id);
    
  
    public function hasCategories();
    public function categoryExists($categoryId);
    public function existingProductModels();
    public function existsInProduct($id);
    public function findMultiple(array $ids);
    public function deleteMultiple(array $ids);
    public function getImages($product);
    public function findByCategoryId($categoryId);
}
