<?php


namespace App\Repository\Admin;
use App\Models\AttributeDefinition;
use App\Models\Category;
use App\Repository\BaseRepository;
use App\Repository\Interface\admin\AttributeDefinitionInterface;




class AttributeDefinitionRepository extends BaseRepository  implements AttributeDefinitionInterface
{
    public function __construct(AttributeDefinition $model)
    {
        parent::__construct($model);
    }

    //get ra các AttributeDefinition theo idCategory, khi user chọn danh mục
    public function getByCategory($categoryId)
    {
        return AttributeDefinition::where('idCategory', $categoryId)->get();
    }

    //kiểm tra xem idCategory có tồn tại ko trước khi thêm
    public function checkIdCategory($categoryId){
        return Category::where('id', $categoryId)->exists();
    }


  
}
