<?php

namespace App\Repository\Interface\admin;


interface ProductAttributeRepositoryInterface extends RepositoryInterface
{
   
    public function findByProductIdAndDefinitionId($productId, $definitionId);
    public function create(array $attributes);
    public function update($id, array $data);
    public function getAttributesByProductId(int $productId);
    public function getValidAttributesForNewCategory(int $categoryId);
    public function isAttributeValidForCategory(int $attributeDefinitionId, int $categoryId);
}