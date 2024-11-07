<?php

namespace App\Repository\Admin;

use App\Models\Category;
use App\Models\Products;
use App\Repository\BaseRepository;
use App\Repository\Interface\admin\CategoryRepositoryInterface;

// mở rộng những gì BaseRepository chưa có 
class CategoryRepository extends BaseRepository implements CategoryRepositoryInterface
{
    // Hàm khởi tạo cho CategoryRepository
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }
    public function existsInCategory($id)
    {
        return $this->model->where('id', $id)->exists();
    }

    public function hasProducts($id)
    {
        return Products::where('idCategory', $id)->exists();
    }

    public function delete($id)
    {
        $result = $this->find($id);
        if ($result) {
            // Xóa hình ảnh liên quan nếu có
            @unlink(public_path('file/img/img_category/' . $result->image));
            $result->delete();
            return true;
        }

        return false;
    }
    // public function getAll()
    // {
    //     return Category::all();
    // }

}
