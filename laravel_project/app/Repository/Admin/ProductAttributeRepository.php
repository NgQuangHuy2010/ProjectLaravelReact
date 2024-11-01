<?php


namespace App\Repository\Admin;
use App\Models\ProductAttribute;
use App\Repository\BaseRepository;
use App\Repository\Interface\admin\ProductAttributeRepositoryInterface;





class ProductAttributeRepository  extends BaseRepository implements ProductAttributeRepositoryInterface
{
    public function __construct(ProductAttribute $model)
    {
        parent::__construct($model);
    }


    public function create(array $attributes)
    {
        return $this->model->create($attributes);
    }
    public function getByProductId($productId)
    {
        return $this->model->where('product_id', $productId)->get();
    }

}
