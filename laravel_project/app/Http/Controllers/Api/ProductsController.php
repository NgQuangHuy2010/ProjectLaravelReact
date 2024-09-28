<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Products;
use Illuminate\Http\Request;
use Log;
use Validator;

class ProductsController extends Controller
{
    public function index()
    {
        $products = Products::with('category')->get();
        foreach ($products as $productImage) {
            // Sử dụng asset() để tạo URL cho hình ảnh trong thư mục public
            $productImage->image_url = asset('file/img/img_product/' . $productImage->image);
        }
        return response()->json([
            'status' => 'success',
            'dataProducts' => $products
        ]);
    }

    public function create(Request $request)
    {
        try {
            $rules = [
                "name_product" => "required|string|max:255",
                'image' => 'mimes:jpeg,png,gif,jpg,ico,webp|max:4096',
                'images' => 'nullable|array',
                //images.* là để xác thực từng file trong 1 mảng
                'images.*' => 'nullable|mimes:jpeg,png,gif,jpg,ico,webp|max:4096',
                'image_specifications' => 'mimes:jpeg,png,gif,jpg,ico,webp|max:4096',
                'price_product' => "numeric",
                'discount' => "numeric",
                'model' => "string|max:100",
                'idCategory' => "required|integer"
            ];

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            // Khởi tạo sản phẩm mới
            $create_product = new Products();
            $create_product->name_product = $request->name_product;
            $create_product->description = $request->description;
            $create_product->product_model = $request->model;
            $create_product->price_product = $request->price_product;
            $create_product->discount = $request->discount;
            $create_product->origin = $request->origin;
            $create_product->status = 1;
            $create_product->idCategory = $request->idCategory;
            $create_product->image = $this->handleImageUpload($request, 'image');
            $imagesHandle = $this->handleMultipleImageUpload($request, 'images');
            $create_product->images = json_encode($imagesHandle);
            $create_product->image_specifications = $this->handleImageUpload($request, 'image_specifications');
            // Log::info('Product created:', $create_product->toArray());
            $create_product->save();

            return response()->json([
                'message' => 'Tạo mới sản phẩm thành công!',
                'products' => $create_product,
                'status_code' => 201
            ], 201);

        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Lỗi khi tạo sản phẩm !!!',
                'status_code' => 405
            ], 405);
        }



    }
    private function handleImageUpload($request, $fieldName)
    {
        if ($request->hasFile($fieldName)) {
            $file = $request->file($fieldName);
            $filename = time() . "_" . $file->getClientOriginalName();
            $file->move(public_path('file/img/img_product'), $filename);
            return $filename; 
        }
        return null;  
    }
    
    private function handleMultipleImageUpload($request, $fieldName)
    {
        $imagesHandle = [];
    
        if ($request->hasFile($fieldName)) {
            foreach ($request->file($fieldName) as $file) {
                $filename = time() . "_" . $file->getClientOriginalName();
                $file->move(public_path('file/img/img_product'), $filename);
                $imagesHandle[] = $filename; // Thêm tên file vào mảng
            }
        }
    
        return $imagesHandle; // Trả về mảng tên file
    }
    




}
