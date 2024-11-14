<?php

namespace App\Repository\Interface\admin;
use App\Repository\Interface\admin\RepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;


interface ProductRepositoryInterface extends RepositoryInterface
{
    
  //mở rộng những phương thức mà ở repositoryInterface ko có
    public function getAllWithRelations($perPage) ;
    public function categoryExists($categoryId);
    public function existingProductModels();
    public function existsInProduct($id);
    public function findMultiple(array $ids);
    public function deleteMultiple(array $ids);
    public function getImages($product);
    public function findByCategoryId($categoryId, $perPage) : LengthAwarePaginator;
    public function checkProductModel($product_model);
}
