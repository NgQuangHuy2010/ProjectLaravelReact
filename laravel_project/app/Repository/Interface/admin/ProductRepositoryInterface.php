<?php

namespace App\Repository\Interface\admin;
use App\Repository\Interface\admin\RepositoryInterface;


interface ProductRepositoryInterface extends RepositoryInterface
{
    
  //mở rộng những phương thức mà ở repositoryInterface ko có
    public function getAllWithRelations();
    public function categoryExists($categoryId);
    public function existingProductModels();
    public function existsInProduct($id);
    public function findMultiple(array $ids);
    public function deleteMultiple(array $ids);
    public function getImages($product);
    public function findByCategoryId($categoryId);
    public function checkProductModel($product_model);
}
