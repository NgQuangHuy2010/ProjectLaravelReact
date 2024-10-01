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
            if ($productImage->image) {
                // Sử dụng asset() để tạo URL cho hình ảnh trong thư mục public
                $productImage->image_url = asset('file/img/img_product/' . $productImage->image);
            } else {
                // Nếu không có hình, gán URL hình mặc định
                $productImage->image_url = $defaultImageUrl;
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
        //Log::info('Request data products:', $request->all());
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
            } else {
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


}
