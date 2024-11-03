<?php
namespace App\Services\ServicesAdmin;

use App\Repository\Interface\admin\ProductAttributeRepositoryInterface;
use App\Repository\Interface\admin\ProductRepositoryInterface;




class ProductService
{

    protected $productRepositoryInterface;
    protected $productAttributeRepositoryInterface;


    public function __construct(ProductRepositoryInterface $productRepositoryInterface, ProductAttributeRepositoryInterface $productAttributeRepositoryInterface)
    {
        $this->productRepositoryInterface = $productRepositoryInterface;
        $this->productAttributeRepositoryInterface = $productAttributeRepositoryInterface;

    }

    public function getAll()
    {
        $products = $this->productRepositoryInterface->getAllWithRelations();

        $defaultImageUrl = asset('file/img/img_default/default-product.png');

        foreach ($products as $productImage) {
            // Xử lý hình ảnh chính
            $productImage->image_url = $productImage->image
                ? asset('file/img/img_product/' . $productImage->image)
                : $defaultImageUrl;

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

        return $products;
    }
    //hàm kiểm tra và phản hồi ngay cho ng dùng khi điền vào product_model
    public function checkProductModel($product_model)
    {
        return $this->productRepositoryInterface->checkProductModel($product_model);
    }
    public function create($request)
    {

        if (!empty($request->product_model)) {
            $productModel = $request->product_model;
        } else if (empty($request->product_model)) {
            $productModel = $this->generateProductModel();
        }
        if (!empty($request->idCategory) && !$this->productRepositoryInterface->categoryExists($request->idCategory)) {
            throw new \Exception('Category not found!', 404);
        }
        $data = [
            'name_product' => $request->name_product,
            'description' => $request->description,
            'product_model' => $productModel,
            'price_product' => $request->price_product,
            'discount' => $request->discount,
            'idCategory' => $request->idCategory,
            'brand_id' => $request->brand_id,
            'origin' => $request->origin,
            'status' => 1,
            'image' => $this->handleImageUpload($request, 'image'),
            $imagesHandle = $this->handleMultipleImageUpload($request, 'images'),
            'images' => json_encode($imagesHandle),
            'image_specifications' => $this->handleImageUpload($request, 'image_specifications'),
        ];

        $product = $this->productRepositoryInterface->create($data);
        // Lấy danh sách attributes từ request
        $attributes = $request->input('attributes');
        //nếu attributes đc gửi từ client là dạng json thì chuyển sang array  
        if (is_string($attributes)) {
            $attributes = json_decode($attributes, true);
        }
        $this->addProductAttributes($attributes ?? [], $product->id);
        //\Log::info('Created product: ',  $attributes);
        return $product;
    }




    public function update($request, $id)
    {
        $product = $this->productRepositoryInterface->find($id);
        if (!$product) {
            // Trả về phản hồi lỗi nếu không tìm thấy
            throw new \Exception('Product not found', 404); // Sử dụng exception để báo lỗi
        }
        // Cập nhật các thuộc tính sản phẩm
        $product->name_product = $request->name_product;
        $product->description = $request->description ?? $product->description;
        $product->price_product = $request->price_product ?? $product->price_product;
        $product->discount = $request->discount ?? $product->discount;
        $product->origin = $request->origin ?? $product->origin;
        $product->status = 1;
        if (!empty($request->idCategory) && !$this->productRepositoryInterface->categoryExists($request->idCategory)) {
            throw new \Exception('Category not found!', 404);
        }
        $product->idCategory = $request->idCategory ?? $product->idCategory;
        $product->brand_id = $request->brand_id ?? $product->brand_id;

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
        //lưu danh sách ảnh cuối cùng về lại kiểu Json đưa vào db
        $product->images = json_encode($oldImages);


        // Cập nhật ảnh specifications nếu có tải lên
        if ($request->hasFile('image_specifications')) {
            // Xóa ảnh specifications cũ
            @unlink(public_path('file/img/img_product/' . $product->image_specifications));
            // Upload ảnh mới
            $product->image_specifications = $this->handleImageUpload($request, 'image_specifications');
        }

        $updateProduct = $this->productRepositoryInterface->update($id, $product->toArray())->find($id)->load('category');
        // Lấy danh sách attributes từ request
        $newCategoryId = $request->input('idCategory');
        $attributes = $request->input('attributes');
        //nếu attributes đc gửi từ client là dạng json thì chuyển sang array  
        if (is_string($attributes)) {
            $attributes = json_decode($attributes, true);
        }
        //\Log::info('update attribute product: ', $attributes);
        //kiểm tra xem $attributes có được khởi tạo và không phải là null hay không
        if (isset($attributes)) {
            $this->updateProductAttributes($attributes ?? [], $id,$newCategoryId);
        }

        return $updateProduct;
    }


    public function delete($id)
    {
        try {
            // Kiểm tra xem danh mục có tồn tại không
            if (!$this->productRepositoryInterface->existsInProduct($id)) {
                throw new \Exception('Product not found', 404);
            }
            // Xóa danh mục
            if ($this->productRepositoryInterface->delete($id)) {
                return response()->json([
                    'success' => true,
                    'message' => 'Delete success!',
                ], 200);
            } else {
                throw new \Exception('Error deleting !');
            }
        } catch (\Exception $e) {
            return response()->json([
                'failed' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function deleteMultipleProducts(array $ids)
    {
        $products = $this->productRepositoryInterface->findMultiple($ids);
        if ($products->isEmpty()) {
            throw new \Exception('No products found!', 404);
        }

        foreach ($products as $product) {
            // Xóa ảnh chính
            @unlink(public_path('file/img/img_product/' . $product->image));

            // Xóa các ảnh khác
            $images = $this->productRepositoryInterface->getImages($product);
            foreach ($images as $key) {
                @unlink(public_path('file/img/img_product/' . $key));
            }
        }

        $this->productRepositoryInterface->deleteMultiple($ids);

        return [
            'success' => true,
            'message' => 'Products deleted successfully!',
        ];
    }

    public function findProductsByCategory($categoryId)
    {
        $products = $this->productRepositoryInterface->findByCategoryId($categoryId);

        $defaultImageUrl = asset('file/img/img_default/default-product.png');

        foreach ($products as $product) {
            // Xử lý hình ảnh chính
            $product->image_url = $product->image
                ? asset('file/img/img_product/' . $product->image)
                : $defaultImageUrl;

            // Xử lý các hình ảnh khác
            if ($product->images) {
                $images = json_decode($product->images, true);
                $product->images_url = is_array($images)
                    ? array_map(fn($image) => asset('file/img/img_product/' . $image), $images)
                    : [];
            } else {
                $product->images_url = []; // Nếu không có hình, gán mảng rỗng
            }
        }

        if ($products->isEmpty()) {
            return response()->json([
                'success' => true,
                'findProduct' => $products,
                'message' => 'No products found in this category!',
            ], 200);
        }

        return response()->json([
            'success' => true,
            'findProduct' => $products,
            'message' => 'Find products success!',
        ], 200);

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
        $existingProductModels = $this->productRepositoryInterface->existingProductModels();
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

    private function addProductAttributes(array $attributes, int $productId)
    {

        foreach ($attributes as $attribute) {
            if (!empty($attribute['attribute_definition_id']) && !empty($attribute['attribute_value'])) {
                $this->productAttributeRepositoryInterface->create([
                    'product_id' => $productId,
                    'attribute_definition_id' => $attribute['attribute_definition_id'],
                    'attribute_value' => $attribute['attribute_value'],
                ]);
            }
        }

    }


    private function updateProductAttributes(array $attributes, int $productId, int $newCategoryId)
{
    // Lấy tất cả thuộc tính hiện tại của sản phẩm
    $existingAttributes = $this->productAttributeRepositoryInterface->getAttributesByProductId($productId);
    
    // Danh sách thuộc tính hợp lệ cho danh mục mới
    $validAttributes = $this->productAttributeRepositoryInterface->getValidAttributesForNewCategory($newCategoryId);
    $validAttributeIds = $validAttributes->pluck('id')->toArray();
    
    // Duyệt qua các thuộc tính mới được truyền vào
    foreach ($attributes as $attribute) {
        // Kiểm tra nếu thuộc tính có hợp lệ với danh mục mới
        if (!empty($attribute['attribute_definition_id']) && $this->productAttributeRepositoryInterface->isAttributeValidForCategory($attribute['attribute_definition_id'], $newCategoryId)) {
            // Tìm thuộc tính tồn tại với cả `productId` và `attribute_definition_id`
            $existingAttribute = $this->productAttributeRepositoryInterface
                ->findByProductIdAndDefinitionId($productId, $attribute['attribute_definition_id']);

            if ($existingAttribute) {
                // Cập nhật nếu thuộc tính đã tồn tại
                $this->productAttributeRepositoryInterface->update($existingAttribute->id, [
                    'attribute_value' => $attribute['attribute_value'],
                ]);
            } else {
                // Tạo mới nếu thuộc tính chưa tồn tại
                $this->productAttributeRepositoryInterface->create([
                    'product_id' => $productId,
                    'attribute_definition_id' => $attribute['attribute_definition_id'],
                    'attribute_value' => $attribute['attribute_value'],
                ]);
            }
        }
    }
    
    // Xóa các thuộc tính không còn hợp lệ
    foreach ($existingAttributes as $existingAttribute) {
        if (!in_array($existingAttribute->attribute_definition_id, $validAttributeIds)) {
            $this->productAttributeRepositoryInterface->delete($existingAttribute->id);
        }
    }
}



}



