<?php

namespace App\Repository\Admin;

use App\Models\Category;
use App\Models\Products;
use App\Repository\BaseRepository;
use App\Repository\Interface\admin\ProductRepositoryInterface;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    // Hàm khởi tạo cho CategoryRepository
    public function __construct(Products $model)
    {
        parent::__construct($model);
    }
    public function existsInProduct($id)
    {
        return $this->model->where('id', $id)->exists();
    }

    public function delete($id)
    {
        $load = $this->find($id);
        @unlink(public_path('file/img/img_product/' . $load->image));
        if ($load->images != "") {
            $images = json_decode($load->images);
            // Xóa hình ảnh liên quan nếu có
            foreach ($images as $key) {
                @unlink(public_path('file/img/img_product/' . $key));
            }
            $load->delete();
            return true;
        }

        return false;
    }
    public function hasCategories()
    {
        //lấy hết sản phẩm có lien quan đến category
        return $this->model->with('category')->get();
    }
    public function categoryExists($categoryId)
    {
        // Kiểm tra idCategory dc thêm có tồn tại trong bảng category không
        return Category::where('id', $categoryId)->exists();
    }


    public function existingProductModels()
    {
        return $this->model->pluck('product_model')->toArray();
    }


    public function findMultiple(array $ids)
    {
        return Products::whereIn('id', $ids)->get();
    }

    public function deleteMultiple(array $ids)
    {
        return Products::destroy($ids);
    }

    public function getImages($product)
    {
        return json_decode($product->images) ?? [];
    }
    public function findByCategoryId($categoryId)
    {
        return Products::where('idCategory', $categoryId)->get();
    }
}
