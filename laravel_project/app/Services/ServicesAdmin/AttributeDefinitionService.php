<?php

namespace App\Services\ServicesAdmin;
use App\Repository\Interface\admin\AttributeDefinitionInterface;
use App\Repository\Interface\admin\BrandRepositoryInterface;


class AttributeDefinitionService
{
    protected $attributeDefinitionRepository;

    public function __construct(AttributeDefinitionInterface $attributeDefinitionRepository)
    {
        $this->attributeDefinitionRepository = $attributeDefinitionRepository;
    }

    public function getAttributesByCategory($categoryId)
    {
        return $this->attributeDefinitionRepository->getByCategory($categoryId);
    }
}