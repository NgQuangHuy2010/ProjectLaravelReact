<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
    
    public function Create(Request $request)
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
        ], 201);
    }
    public function Delete($id)
    {
        try {
            // if (Products::where('idCategory', $id)->exists()) {
            //     return response()->json([
            //         'failed' => false,
            //         'message' => 'Error delete category!',
            //     ], 400);

            // }
            $load = Category::find($id);
            @unlink('public/file/img/img_category/' . $load->image);
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
}
