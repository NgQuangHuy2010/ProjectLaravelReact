<?php

namespace App\Services\ServicesAdmin;

use App\Repository\Interface\admin\CategoryRepositoryInterface;



class CategoryService
{
    protected $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function getAllCategory()
    {
        $categories = $this->categoryRepository->getAll();

        foreach ($categories as $category) {
            $category->image_url = asset('file/img/img_category/' . $category->image);
        }

        return $categories;
    }


    public function create($request)
    {
        // Chuẩn bị dữ liệu từ request
        $data = [
            'name' => $request->name,
            'image' => $this->handleImageUpload($request),
        ];
        // Gọi repository để lưu danh mục với dữ liệu đã chuẩn bị
        return $this->categoryRepository->create($data);
    }

    public function update($request, $id)
    {
        $category = $this->categoryRepository->find($id);
        if (!$category) {
           // Trả về phản hồi lỗi nếu không tìm thấy
        throw new \Exception('Category not found', 404); // Sử dụng exception để báo lỗi
        }

        $category->name = $request->name;
        if ($request->hasFile('image')) {
            // Xóa hình ảnh cũ nếu có
            if ($category->image && file_exists(public_path('file/img/img_category/' . $category->image))) {
                @unlink(public_path('file/img/img_category/' . $category->image));
            }
            // Gọi hàm handleImageUpload để lưu hình ảnh mới
            $category->image = $this->handleImageUpload($request);
        }
        return $this->categoryRepository->update($id, $category->toArray());
    }


    public function delete($id)
    {
        try {
            // Kiểm tra xem danh mục có tồn tại không
            if (!$this->categoryRepository->existsInCategory($id)) {
                throw new \Exception('Category not found',404);
            }

            // Kiểm tra xem danh mục có sản phẩm nào không
            if ($this->categoryRepository->hasProducts($id)) {
                throw new \Exception('Error deleting category because there are products in this category!');
            }

            // Xóa danh mục
            if ($this->categoryRepository->delete($id)) {
                return response()->json([
                    'success' => true,
                    'message' => 'Delete success!',
                ], 200);
            } else {
                throw new \Exception('Error deleting category!');
            }
        } catch (\Exception $e) {
            return response()->json([
                'failed' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    private function handleImageUpload($request)
    {
        if ($request->hasFile('image')) {
            $img = $request->file('image');
            $nameImage = time() . '_' . $img->getClientOriginalName();
            // Di chuyển file vào thư mục public
            $img->move(public_path('file/img/img_category/'), $nameImage);
            return $nameImage; // Trả về tên hình ảnh đã lưu
        }
        return null; // Nếu không có file, trả về null
    }

}
