<?php

namespace App\Services\ServicesClient;

use App\Repository\Interface\client\FindProductsByCategoryInterface;



class FindProductsByCategoryServicesClient
{
    protected $findProductsByCategoryInterface;

    public function __construct(FindProductsByCategoryInterface $findProductsByCategoryInterface)
    {
        $this->findProductsByCategoryInterface = $findProductsByCategoryInterface;
    }

    public function getProductsByCategoryClient($categoryId, $brandName = null, $priceRange = null, $sort_order = null, $attributes = [])
    {

        $filteredAttributes = $this->filterAndFormatAttributes($attributes);
        // Lấy sản phẩm từ repository với các tham số được truyền vào
        $result = $this->findProductsByCategoryInterface->getProductsByCategory($categoryId, $brandName, $priceRange, $sort_order, $filteredAttributes);

        // Lấy danh sách sản phẩm, brands, và attributes
        $products = $result['products'];
        $brands = $result['brands'];
        $attributes = $result['attributes'];

        // Tạo URL cho hình ảnh sản phẩm
        $productAll = $this->imageUrlProduct($products);

        // Trả về sản phẩm cùng với danh sách brand và attributes
        return [
            'products' => $productAll,
            'brands' => $brands,
            'attributes' => $attributes
        ];
    }
    private function filterAndFormatAttributes($attributes = [])
    {
        // Bỏ qua các tham số không liên quan như 'sort', 'price', và 'brand'
        // `array_flip` sẽ chuyển các key này thành phần tử, sau đó `array_diff_key` sẽ loại bỏ chúng khỏi mảng $attributes.
        $attributes = array_diff_key($attributes, array_flip(['sort', 'price', 'brand']));
        $attributes = array_map(function($value) {
            return str_replace('-', ' ', $value); // Chuyển đổi dấu gạch ngang thành dấu cách
        }, $attributes);
        // Khởi tạo mảng để lưu các attributes đã được lọc và định dạng lại
        $filteredAttributes = [];
    
        // Duyệt qua các attributes còn lại và chuyển giá trị thành mảng nếu nó là một chuỗi
        foreach ($attributes as $key => $value) {
            // Kiểm tra xem giá trị có phải là một mảng hay không
            // Nếu là mảng thì giữ nguyên, nếu không thì tách chuỗi thành mảng bằng cách sử dụng dấu ',' làm phân tách
            $filteredAttributes[$key] = is_array($value) ? $value : explode(',', $value);
        }
    
        // Trả về mảng các attributes đã được lọc và chuyển đổi thành mảng
        return $filteredAttributes;
    }

    private function imageUrlProduct($products)
    {
        foreach ($products as $product) {
            $product->image_url = $product->image
                ? asset('file/img/img_product/' . $product->image)
                : null;
        }
        return $products;
    }

}