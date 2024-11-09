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
        // Lấy sản phẩm từ repository với các tham số được truyền vào
        $result = $this->findProductsByCategoryInterface->getProductsByCategory($categoryId, $brandName, $priceRange, $sort_order, $attributes);
    
        // Lấy danh sách sản phẩm, brands, và attributes
        $products = $result['products'];
        $brands = $result['brands'];
        $attributes = $result['attributes'];
    
        // Tạo URL cho hình ảnh sản phẩm
        foreach ($products as $product) {
            $product->image_url = $product->image
                ? asset('file/img/img_product/' . $product->image)
                : null;
        }
    
        // Trả về sản phẩm cùng với danh sách brand và attributes
        return [
            'products' => $products,
            'brands' => $brands,
            'attributes' => $attributes
        ];
    }
    



}