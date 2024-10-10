<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Log;
use Validator;

class CategoryController extends Controller
{
    public function index()
    {
        // Lấy tất cả danh mục
        $categories = Category::get();
        foreach ($categories as $category) {
            // Sử dụng asset() để tạo URL cho hình ảnh trong thư mục public
            $category->image_url = asset('file/img/img_category/' . $category->image);
        }
        // Trả về response dạng JSON
        return response()->json([
            'data' => $categories,
            'message' => 'success',
            'status_code' => '200'
        ], 200);
    }

    public function create(Request $request)
    {
        // Tạo rules và messages cho việc validate
        $rules = [
            "name" => "required",
            'image' => 'required|mimes:jpeg,png,gif,jpg,ico,webp|max:4096',
        ];
        $messages = [
            'name.required' => 'Vui lòng điền tên danh mục !!',
            'image.required' => 'Vui lòng thêm hình cho danh mục này !!!',
            'image.mimes' => 'Vui lòng chọn hình ảnh có định dạng jpeg, png, gif, jpg, ico, webp.',
            'image.max' => 'Kích thước hình ảnh không được vượt quá 4MB.',
        ];

        // Validate dữ liệu
        $validator = Validator::make($request->all(), $rules, $messages);

        // Nếu validation thất bại, trả về lỗi
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Tạo danh mục mới
        $category = new Category();
        $category->name = $request->name;

        // Kiểm tra và xử lý hình ảnh
        if ($request->hasFile("image")) {
            $img = $request->file("image");
            $nameimage = time() . "_" . $img->getClientOriginalName();
            // Di chuyển file vào thư mục public
            $img->move(public_path('file/img/img_category/'), $nameimage);
            // Gán tên hình ảnh vào cột image
            $category->image = $nameimage;
        }

        // Lưu danh mục
        $category->save();

        // Trả về phản hồi JSON
        return response()->json([
            'success' => true,
            'message' => 'Tạo mới thành công!',
            'category' => $category
        ], 200);
    }






    public function update(Request $request, $id)
    {
        //ghi log trong D:\laragon\www\ProjectLaravelReact\laravel_project\storage\logs\laravel.log 
        Log::info('Request Data category:', $request->all());  
        // Tạo rules và messages cho việc validate
        $rules = [
            "name" => "required|string",
            "image" => "nullable|mimes:jpeg,png,gif,jpg,ico,webp|max:4096",
        ];

        $messages = [
            'name.required' => 'Vui lòng điền tên danh mục !!',
            'image.mimes' => 'Vui lòng chọn hình ảnh có định dạng jpeg, png, gif, jpg, ico, webp.',
            'image.max' => 'Kích thước hình ảnh không được vượt quá 4MB.',
        ];
        // Validate dữ liệu
        $validator = Validator::make($request->all(), $rules, $messages);

        // Nếu validation thất bại, trả về lỗi
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        //Log::info('Name before update:', [$request->name]);
        // Tìm danh mục theo ID
        $category = Category::find($id);

        // Nếu không tìm thấy, trả về lỗi
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found!',
            ], 404);
        }
        // Log::info('Current Category Data:', [$category]);

        // Cập nhật tên danh mục
        $category->name = $request->name;

        // Kiểm tra và xử lý hình ảnh
        if ($request->hasFile("image")) {
            // Xóa hình ảnh cũ nếu có
            if ($category->image && file_exists(public_path('file/img/img_category/' . $category->image))) {
                @unlink(public_path('file/img/img_category/' . $category->image));
            }

            // Lưu hình ảnh mới
            $img = $request->file("image");
            $nameimage = time() . "_" . $img->getClientOriginalName();
            // Di chuyển file vào thư mục public
            $img->move(public_path('file/img/img_category/'), $nameimage);
            // Gán tên hình ảnh vào cột image
            $category->image = $nameimage;
        }

        // Lưu thay đổi
        $category->save();


        // Trả về phản hồi JSON
        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thành công!',
            'category' => $category
        ], 200);
    }






    public function delete($id)
    {
        try {
            if (Products::where('idCategory', $id)->exists()) {
                return response()->json([
                    'failed' => false,
                    'message' => 'Error deleting category because there are products in this category!!',
                ], 400);

            }
            $load = Category::find($id);
            @unlink(public_path('file/img/img_category/' . $load->image));

            //@unlink('public/file/img/img_category/' . $load->image);
            Category::destroy($id);

            return response()->json([
                'success' => true,
                'message' => 'Xóa thành công!',
            ], 200);
        } catch (\Throwable $th) {

            return response()->json([
                'failed' => false,
                'message' => 'Error delete category!',

            ], 400);
        }
    }

    public function deleteMultiple(Request $request)
    {
        $ids = $request->input('ids'); // id dạng mảng get

        try {
            // check if id
            $categories = Category::whereIn('id', $ids)->get();
            if ($categories->isEmpty()) {
                return response()->json([
                    'failed' => true,
                    'message' => 'No categories found!',
                ], 404);
            }

            foreach ($categories as $category) {
                @unlink(public_path('file/img/img_category/' . $category->image));
            }

            Category::destroy($ids); // Delete categories by IDs

            return response()->json([
                'success' => true,
                'message' => 'Categories deleted successfully!',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'failed' => true,
                'message' => 'Error deleting categories!',
            ], 400);
        }
    }


}
