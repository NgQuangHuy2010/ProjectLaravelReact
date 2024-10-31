<?php


namespace App\Repository\Admin;
use App\Models\AttributeDefinition;
use App\Repository\Interface\admin\AttributeDefinitionInterface;




class AttributeDefinitionRepository  implements AttributeDefinitionInterface
{
    public function getByCategory($categoryId)
    {
        return AttributeDefinition::where('idCategory', $categoryId)->get();
    }

}
