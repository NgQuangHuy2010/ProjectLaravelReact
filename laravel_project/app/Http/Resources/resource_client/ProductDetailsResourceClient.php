<?php

namespace App\Http\Resources\resource_client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailsResourceClient extends JsonResource
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
            'name_product' => $this->name_product,
            'description' => $this->description,
            'product_model' => $this->product_model,
            'price_product' => $this->price_product,
            'discount' => $this->discount,
            'image' => $this->image,
            'images' => $this->images,
            'image_url' => $this->image_url, // Sử dụng accessor
            'images_url' => $this->images_url, // Sử dụng accessor
            'status' => $this->status,
            'origin' => $this->origin,
            'image_specifications' => $this->image_specifications,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'idCategory' => $this ->idCategory,
            'brand_id' => $this ->brand_id,
            'brand' => $this->whenLoaded('brand', function () {
                return [
                    'name' => $this->brand->name,
                ];
            }),
            'attributes' => $this->attributes->map(function ($attribute) {
                return [
                    'attribute_name' => $attribute->attributeDefinition->attribute_name,
                    'attribute_value' => $attribute->attribute_value
                ];
            }),

        ];
    }
}
