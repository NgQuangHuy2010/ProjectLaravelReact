<?php

namespace App\Repository\Product;

use App\Models\Products;
use App\Repository\BaseRepository;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    // Hàm khởi tạo cho CategoryRepository
    public function __construct(Products $model)
    {
        parent::__construct($model);
    }
    public function existsInCategory($id)
    {
        return $this->model->where('id', $id)->exists();
    }

    public function delete($id)
    {
        $result = $this->find($id);
        if ($result) {
            // Xóa hình ảnh liên quan nếu có
            @unlink(public_path('file/img/img_product/' . $result->image));
            $result->delete();
            return true;
        }

        return false;
    }
    public function hasCategories() 
    {
        return $this->model->with('category')->get();
    }

}
