<?php

namespace App\Repository\Client;

use App\Models\AttributeDefinition;
use App\Models\Brand;
use App\Models\Products;
use App\Repository\Interface\client\FindProductsByCategoryInterface;

class FindProductsByCategoryRepository implements FindProductsByCategoryInterface
{

    public function getProductsByCategory($categoryId, $brandName = null, $priceRange = null, $sort_order = null, $attributes = [], $perPage)
    {

        // Eager loading các mối quan hệ giảm số lượng truy vấn database:
        //  - 1 truy vấn để lấy tất cả các sản phẩm.
        //  - 1 truy vấn để lấy tất cả các thuộc tính và định nghĩa thuộc tính liên quan
        //with('attributes'): Eager load mối quan hệ attributes, tức là lấy tất cả các ProductAttribute liên quan đến từng sản phẩm
        //with('attributes.attributeDefinition'): Tiếp tục eager load mối quan hệ attributeDefinition cho mỗi ProductAttribute trong danh sách attributes
        $products = Products::with('brand', 'attributes.attributeDefinition')
            ->where('idCategory', $categoryId); // Lọc các sản phẩm theo idCategory

        //lọc theo brand
        $this->filterBrandName($brandName, $products);
        //lọc theo khoảng giá
        $this->filterPriceRange($priceRange, $products);
        //lọc theo thứ tự giá  
        $this->filterSortOrder($sort_order, $products);
        //lọc theo các thuộc tính sản phẩm 
        $this->filterAttributes($attributes, $products);
        //phân trang cho các sản phẩm đã lọc 
        $paginatedProducts = $products->paginate($perPage);
        //get tất cả brand để user có thể sort brand ngay tại pages products(client)
        $brands = $this->getAllBrands($categoryId);
        //get tất cả thuộc tính để user có thể sort attributes ngay tại pages products(client)
        $attributesInCategory = $this->getAllAttributes($categoryId);

        return [
            'products' => $paginatedProducts,
            'brands' => $brands,
            'attributes' => $attributesInCategory,
        ];
    }

    private function filterBrandName($brandName, $products)
    {
        // Kiểm tra nếu tên thương hiệu không rỗng (không phải null hoặc chuỗi rỗng)
        if (!empty($brandName)) {
            // Sử dụng phương thức `whereHas` để lọc các sản phẩm có liên kết với brand.
            // `whereHas` sẽ tìm kiếm các sản phẩm có realationShip eloquent với bảng `brand`, và chỉ chọn các sản phẩm
            // có tên thương hiệu (`name`) chứa chuỗi $brandName.
            $products->whereHas('brand', function ($q) use ($brandName) {
                // Sử dụng toán tử 'like' để tìm kiếm tên thương hiệu có chứa tên được truyền vào,
                // cho phép tìm kiếm không phân biệt chữ hoa chữ thường.
                $q->where('name', 'like', "%$brandName%");
            });
        }
    }

    protected $priceRanges = [
        '0-10000000' => [0, 9999999],
        '10000000-15000000' => [10000000, 14999999],
        '15000000-20000000' => [15000000, 19999999],
        '20000000-25000000' => [20000000, 24999999],
        '25000000-99999999' => [25000000, PHP_INT_MAX]
    ];
    private function filterPriceRange($priceRange, $products)
    {
        // Kiểm tra nếu khoảng giá không rỗng và tồn tại trong mảng $priceRange
        if (!empty($priceRange) && isset($this->priceRanges[$priceRange])) {
            // Lấy giá trị min và max từ mảng $priceRanges dựa trên khoảng giá đã chọn
            [$minPrice, $maxPrice] = $this->priceRanges[$priceRange];
            // Sử dụng phương thức `whereBetween` của Eloquent để lọc sản phẩm có giá trị `discount` trong khoảng [minPrice, maxPrice]
            $products->whereBetween('discount', [$minPrice, $maxPrice]);
        }
    }
    private function filterSortOrder($sort_order, $products)
    {
        if (in_array($sort_order, ['asc', 'desc'])) {
            $products->orderBy('discount', $sort_order);
        }

    }
    private function filterAttributes($attributes, $products)
    {
        // Duyệt qua từng thuộc tính trong mảng $attributes
        foreach ($attributes as $attributeDefinitionId => $values) {
            //sử dụng whereHas để kiểm tra mối quan hệ giữa products và attributes
            // Lọc sản phẩm có chứa thuộc tính có id là $attributeDefinitionId và giá trị thuộc tính khớp với các giá trị trong mảng $values
            $products->whereHas('attributes', function ($query) use ($attributeDefinitionId, $values) {
                // Lọc các thuộc tính của sản phẩm mà có attribute_definition_id khớp và attribute_value nằm trong mảng $values
                //whereIn giúp lọc nhiều giá trị cho một thuộc tính.
                $query->whereIn('attribute_definition_id', [$attributeDefinitionId])
                    ->whereIn('attribute_value', $values);
            });
        }
    }


    private function getAllBrands($categoryId)
    {
        // Lọc các thương hiệu có sản phẩm thuộc categoryId
        return Brand::whereHas('products', function ($query) use ($categoryId) {
            // Kiểm tra mối quan hệ giữa Brand và Product, và chỉ lấy những thương hiệu có sản phẩm thuộc categoryId
            $query->where('idCategory', $categoryId);
        })->get();
    }

    private function getAllAttributes($categoryId)
    {
        //lấy tất cả các thuộc tính trong một category
        return AttributeDefinition::where('idCategory', $categoryId)
            //with('productAttributes') eager load các giá trị thuộc tính liên quan (mối quan hệ giữa AttributeDefinition và productAttributes)
            ->with([
                'productAttributes' => function ($query) {
                    // Eager load các giá trị của thuộc tính cần thiết
                    $query->select('attribute_definition_id', 'attribute_value');
                }
            ])->get();
    }

}