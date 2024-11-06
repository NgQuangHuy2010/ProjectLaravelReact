<?php

namespace App\Repository\Client;

use App\Models\AttributeDefinition;
use App\Models\Products;
use App\Repository\Interface\client\FindProductsByCategoryInterface;

class FindProductsByCategoryRepository implements FindProductsByCategoryInterface
{
    protected $priceRanges = [
        '0-10000000' => [0, 9999999],
        '10000000-15000000' => [10000000, 14999999],
        '15000000-20000000' => [15000000, 19999999],
        '20000000-25000000' => [20000000, 24999999],
        '25000000-99999999' => [25000000, PHP_INT_MAX]
    ];
    public function getProductsByCategory($categoryId, $brandName = null, $priceRange = null, $sort_order = null, $attributes = [])
    {

        // Eager loading các mối quan hệ giảm số lượng truy vấn database:
        //  - 1 truy vấn để lấy tất cả các sản phẩm.
        //  - 1 truy vấn để lấy tất cả các thuộc tính và định nghĩa thuộc tính liên quan
        //with('attributes'): Eager load mối quan hệ attributes, tức là lấy tất cả các ProductAttribute liên quan đến từng sản phẩm
        //with('attributes.attributeDefinition'): Tiếp tục eager load mối quan hệ attributeDefinition cho mỗi ProductAttribute trong danh sách attributes
        $products = Products::with('brand', 'attributes.attributeDefinition')
            ->where('idCategory', $categoryId); // Lọc các sản phẩm theo idCategory

        if (!empty($brandName)) {
            $products->whereHas('brand', function ($q) use ($brandName) {
                $q->where('name', 'like', "%$brandName%");
            });
        }

        // Lọc theo khoảng giá nếu có
        if (!empty($priceRange) && isset($this->priceRanges[$priceRange])) {
            [$minPrice, $maxPrice] = $this->priceRanges[$priceRange];
            $products->whereBetween('discount', [$minPrice, $maxPrice]);
        }


        foreach ($attributes as $attributeId => $value) {
            // Sử dụng whereHas để chỉ lấy những sản phẩm có thuộc tính khớp với attribute_id và attribute_value
            // attributeId (ID của AttributeDefinition) và value (ID của ProductAttribute).
            $products->whereHas('attributes', function ($query) use ($attributeId, $value) {
                // Điều kiện lọc đầu tiên: kiểm tra xem attribute_definition_id của thuộc tính có khớp với $attributeId không
                $query->where('attribute_definition_id', $attributeId)
                    ->where('id', $value); //// Điều kiện lọc thứ hai: kiểm tra xem id của ProductAttribute có khớp với $value không
            });
        }


        if (in_array($sort_order, ['asc', 'desc'])) {
            $products->orderBy('discount', $sort_order);
        }
        return $products->get();
    }

}