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
        $defaultImageUrl = asset('file/img/img_default/default-product.png');

        foreach ($products as $productImage) {
            // Xử lý hình ảnh chính
            if ($productImage->image) {
                $productImage->image_url = asset('file/img/img_product/' . $productImage->image);
            } else {
                $productImage->image_url = $defaultImageUrl;
            }

            // Xử lý các hình ảnh khác
            if ($productImage->images) {
                $images = json_decode($productImage->images, true); // Đảm bảo chuyển đổi thành mảng
                if (is_array($images)) {
                    $productImage->images_url = array_map(function ($image) {
                        return asset('file/img/img_product/' . $image);
                    }, $images);
                } else {
                    $productImage->images_url = []; // Nếu không phải mảng, gán mảng rỗng
                }
            } else {
                $productImage->images_url = []; // Nếu không có hình, gán mảng rỗng
            }

            $productImage->price_product = $productImage->price_product ?? 0;
            $productImage->discount = $productImage->discount ?? 0;
        }


        return response()->json([
            'status' => 'success',
            'dataProducts' => $products
        ]);
    }



    public function create(Request $request)
    {
        Log::info('Request data products:', $request->all());
        try {
            $rules = [
                "name_product" => "required|string|max:255",
                'image' => 'nullable|mimes:jpeg,png,gif,jpg,ico,webp|max:4096',
                'images' => 'nullable|array',
                //images.* là để xác thực từng file trong 1 mảng
                'images.*' => 'nullable|mimes:jpeg,png,gif,jpg,ico,webp|max:4096',
                'image_specifications' => 'nullable|mimes:jpeg,png,gif,jpg,ico,webp|max:4096',
                'price_product' => "nullable|numeric",
                'discount' => "nullable|numeric",
                'model' => "nullable|string|max:100",
                'idCategory' => "required|integer",
                'description' => "nullable",
                'product_model' => "nullable|unique:products,product_model",

            ];

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            if (!empty($request->product_model)) {
                $productModel = $request->product_model;
            } else if (empty($request->product_model)) {
                $productModel = $this->generateProductModel();
            }
            // Khởi tạo sản phẩm mới
            $create_product = new Products();
            $create_product->name_product = $request->name_product;
            $create_product->description = $request->description;
            $create_product->product_model = $productModel;
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
                'message' => 'Create product success!',
                'products' => $create_product,
                'status_code' => 201
            ], 201);

        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error creating product !!!',
                'status_code' => 405
            ], 405);
        }

    }



    public function update(Request $request, $id)
    {
        Log::info('Request update products:', $request->all());

        try {
            $rules = [
                "name_product" => "required|string|max:255",
                'image' => 'nullable|mimes:jpeg,png,gif,jpg,ico,webp|max:4096',
                'images' => 'nullable|array',
                //images.* là để xác thực từng file trong 1 mảng
                'images.*' => 'nullable|mimes:jpeg,png,gif,jpg,ico,webp|max:4096',
                'image_specifications' => 'nullable|mimes:jpeg,png,gif,jpg,ico,webp|max:4096',
                'price_product' => "nullable|numeric",
                'discount' => "nullable|numeric",
                'model' => "nullable|string|max:100",
                'idCategory' => "required|integer",
                'description' => "nullable",
                'product_model' => "nullable|unique:products,product_model," . $id, // Kiểm tra trùng lặp ngoại trừ chính sản phẩm này
            ];

            // Xác thực yêu cầu
            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Tìm sản phẩm theo ID
            $product = Products::find($id);
            if (!$product) {
                return response()->json([
                    'message' => 'Không tìm thấy sản phẩm!',
                    'status_code' => 404
                ], 404);
            }

            // Cập nhật các thuộc tính sản phẩm
            $product->name_product = $request->name_product;
            $product->description = $request->description ?? $product->description;
            $product->price_product = $request->price_product ?? $product->price_product;
            $product->discount = $request->discount ?? $product->discount;
            $product->origin = $request->origin ?? $product->origin;
            $product->status = 1;
            $product->idCategory = $request->idCategory ?? $product->idCategory;

            // nếu có data gửi đi (không trống) thì cập nhật lại data đó
            if (!empty($request->product_model)) {
                $product->product_model = $request->product_model;
                //nếu không có data gửi đi (trường hợp : "" , 0 , "0", null, false, [])
                //thì mã hàng vẫn tự động tăng 
            } else if (empty($request->product_model)) {
                $product->product_model = $this->generateProductModel();
            }

            if ($request->hasFile('image')) {
                // Nếu có file mới, thay thế ảnh cũ
                @unlink(public_path('file/img/img_product/' . $product->image));
                $product->image = $this->handleImageUpload($request, 'image');
            }
            // elseif ($request->input('image') === null) {
            //     // Xóa ảnh nếu nhận được giá trị null
            //     @unlink(public_path('file/img/img_product/' . $product->image));
            //     $product->image = null;
            // }

            // Lấy danh sách ảnh hiện có từ cơ sở dữ liệu 
            // Nếu không có ảnh, mặc định là một mảng rỗng.
            $oldImages = json_decode($product->images, true) ?? [];

            // Kiểm tra xem request có chứa trường 'imagesToRemove'
            if ($request->filled('imagesToRemove')) {
                // Lấy danh sách các ảnh cần xóa từ request trả về 
                $imagesToRemove = $request->input('imagesToRemove');

                // Lọc danh sách ảnh cũ (oldImages), loại bỏ các ảnh có trong danh sách 'imagesToRemove'.
                // array_filter giữ lại các phần tử không có trong mảng imagesToRemove để xóa, và chuyển đổi images sang dạng mảng để lưu
                $oldImages = array_values(array_filter($oldImages, fn($image) => !in_array($image, $imagesToRemove)));

                //lặp để lấy ra đường dẫn ảnh và xóa 
                foreach ($imagesToRemove as $imageToRemove) {
                    $filePath = public_path("file/img/img_product/{$imageToRemove}");
                    if (file_exists($filePath))
                        @unlink($filePath);
                }
            }
            // Kiểm tra và xem có ảnh mới được gửi tới không 
            if ($request->hasFile('images')) {
                //nếu có thêm ảnh mới 
                $newImages = $this->handleMultipleImageUpload($request, 'images');
                //thêm ảnh mới vào mảng đang có ảnh cũ
                $oldImages = array_merge($oldImages, $newImages);
            }
            //lưu danh sách ảnh cuối cùng 
            $product->images = json_encode($oldImages);


            // Cập nhật ảnh specifications nếu có tải lên
            if ($request->hasFile('image_specifications')) {
                // Xóa ảnh specifications cũ
                @unlink(public_path('file/img/img_product/' . $product->image_specifications));
                // Upload ảnh mới
                $product->image_specifications = $this->handleImageUpload($request, 'image_specifications');
            }

            // Lưu thay đổi vào database
            $product->save();
            return response()->json([
                'message' => 'Update product success!',
                'product' => $product,
                'status_code' => 200
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error updating product!',
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

    protected function generateProductModel()
    {
        // Lấy tất cả mã sản phẩm hiện có đưa vào mảng
        $existingProductModels = Products::pluck('product_model')->toArray();
        // Khởi tạo số sản phẩm
        $number = 1;
        // Tìm số lớn nhất hiện có , duyệt qua mảng existingProductModels
        //mỗi lần lặp, biến $model sẽ chứa giá trị của phần tử hiện tại trong mảng
        foreach ($existingProductModels as $model) {
            //kiểm tra xem mã sản phẩm có định dạng chính xác không
            //Nếu đúng thì preg_match sẽ trả về true, và các giá trị khớp sẽ được lưu vào mảng $matches
            //lúc này mảng $matches sẽ chứa $matches[0]: 'SP000001' (toàn bộ chuỗi khớp)
            //sau đó $matches[1] Chứa phần khớp với nhóm đầu tiên là nhóm (\d{6}) như bên dưới
            //lúc này là cũng đã ko lấy chữ SP nữa và  $matches[1] chỉ chứa "000001" là 6 số đằng sau
            // cú pháp : preg_match(pattern, subject, matches)
            if (preg_match('/^SP(\d{6})$/', $model, $matches)) {
                //  intval(...): Hàm này chuyển đổi chuỗi thành số nguyên 
                //Nếu $matches[1] là '000001', thì intval($matches[1]) sẽ trả về 1 và gán cho $currentNumber   
                $currentNumber = intval($matches[1]);
                //dùng hàm max để tìm giá trị lớn nhất trong một tập hợp các giá trị
                //cú pháp : max(value1, value2);
                // so sánh value 1 và 2 nào lớn hơn thì lấy 
                // $number hiện tại khởi tạo là 1 (tăng mỗi lần lên 1)
                // lấy giá trị lớn nhất trong  $currentNumber cộng thêm 1 so sánh với $number nếu lớn hơn gán lại cho $number
                $number = max($number, $currentNumber + 1);
            }
        }

        // Tạo mã sản phẩm mới với tiền tố 'SP' và 6 số
        return 'SP' . str_pad($number, 6, '0', STR_PAD_LEFT);
    }

    //hàm check unique product_model
    public function checkProductModel(Request $request)
    {
        //kiểm tra từ request xem có trùng ko nếu trùng về false 
        $exists = Products::where('product_model', $request->model)->exists();

        return response()->json(['isUnique' => !$exists]);
    }

    public function delete($id)
    {
        try {
            $load = Products::find($id);
            @unlink(public_path('file/img/img_product/' . $load->image));
            if ($load->images != "") {
                // Giải mã JSON để có danh sách tên file hình ảnh
                $images = json_decode($load->images);

                // Xóa hình ảnh
                foreach ($images as $key) {
                    @unlink(public_path('file/img/img_product/' . $key));
                }
            }
            Products::destroy($id);
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


    public function deleteMultipleProducts(Request $request)
    {
        $ids = $request->input('ids'); // id dạng mảng get

        try {
            // check if id
            $products = Products::whereIn('id', $ids)->get();
            if ($products->isEmpty()) {
                return response()->json([
                    'failed' => true,
                    'message' => 'No products found!',
                ], 404);
            }

            foreach ($products as $product) {
                // Xóa ảnh chính
                @unlink(public_path('file/img/img_product/' . $product->image));

                // Kiểm tra nếu sản phẩm có nhiều ảnh (thuộc tính `images`)
                if ($product->images != "") {
                    // Giải mã JSON để có danh sách tên file hình ảnh
                    $images = json_decode($product->images);

                    // Xóa từng hình ảnh
                    foreach ($images as $key) {
                        @unlink(public_path('file/img/img_product/' . $key));
                    }
                }
            }

            Products::destroy($ids);

            return response()->json([
                'success' => true,
                'message' => 'Products deleted successfully!',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'failed' => true,
                'message' => 'Error deleting products!',
            ], 400);
        }
    }

}