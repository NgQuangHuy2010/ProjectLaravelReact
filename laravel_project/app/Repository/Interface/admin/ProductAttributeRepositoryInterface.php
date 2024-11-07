<?php

namespace App\Repository\Interface\admin;


interface ProductAttributeRepositoryInterface extends RepositoryInterface
{
  //mở rộng những phương thức mà ở repositoryInterface ko có  
    public function findByProductIdAndDefinitionId($productId, $definitionId);
    public function getAttributesByProductId(int $productId);
    public function getValidAttributesForNewCategory(int $categoryId);
    public function isAttributeValidForCategory(int $attributeDefinitionId, int $categoryId);
}