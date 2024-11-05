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
    public function create($request)
    {
        if (!$this->attributeDefinitionRepository->checkIdCategory($request->idCategory)) {
            throw new \Exception('Category not found', 404);
        }
        $data = [
            'attribute_name' => $request->attribute_name,
            'idCategory' => $request->idCategory
        ];
        return $this->attributeDefinitionRepository->create($data);
    }

    public function update($request, $id)
    {
        $attribute = $this->attributeDefinitionRepository->find($id);
        if (!$attribute) {
            throw new \Exception('Attribute definition not found', 404);
        }
        $attribute->attribute_name = $request->attribute_name;
        return $this->attributeDefinitionRepository->update($id, $attribute->toArray());
    }

    public function delete($id)
    {
        if (!$this->attributeDefinitionRepository->find($id)) {
            throw new \Exception('Attribute definition not found', 404);

        }
        if ($this->attributeDefinitionRepository->delete($id)) {
            return response()->json([
                'success' => true,
                'message' => 'Delete success!',
            ], 200);
        } else {
            throw new \Exception('Error deleting !');
        }

    }

}

