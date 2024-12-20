<?php

namespace App\Http\Resources\resource_client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Str;

class CategoryResourceClient extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name, // Giả sử bạn có thuộc tính name trong Category
            'slug' => Str::slug($this->name), // Tạo slug từ name
            'products' => $this->whenLoaded('products', function () {
                return $this->products->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name_product' => $product->name_product, // Giả sử có thuộc tính name_product trong Product
                        'price_product' => $product->price_product,
                        'brand' => $product->brand ? [
                            'id' => $product->brand->id,
                            'name' => $product->brand->name,
                            'image' => $product->brand->image,
                            'imageBrand_url' => asset('file/img/img_brand/' . $product->brand->image),
                        ] : null,

                        'attributes' => $product->attributes->map(function ($attribute) {
                            return [
                                'attribute_definition_id' => $attribute->attribute_definition_id, // ID của attribute_definition
                                'attribute_name' => $attribute->attributeDefinition->attribute_name,
                                'attribute_id' => $attribute->id,  // ID của ProductAttribute
                                'attribute_value' => $attribute->attribute_value,
                                'attribute_value_slug' =>Str::slug( $attribute->attribute_value)

                            ];
                        }),
                    ];
                });
            }),

        ];
    }
}
