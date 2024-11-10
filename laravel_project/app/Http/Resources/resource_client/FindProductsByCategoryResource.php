<?php

namespace App\Http\Resources\resource_client;

use App\Http\Resources\resource_admin\BrandResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class FindProductsByCategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name_product' => $this->name_product,
            'price_product' => $this->price_product,
            'discount' => $this->discount,
            'image' => $this->image,
            'image_url' => $this->image_url,
            'idCategory' => $this->idCategory,
            'brand' => $this->whenLoaded('brand', function () {
                return [
                    'id' => $this->brand->id,
                    'name' => $this->brand->name,
                    'image' => $this->brand->image,
                    'imageBrand_url' => asset('file/img/img_brand/' . $this->brand->image),
                ];
            }),
            'attributes' => $this->attributes->map(function ($attribute) {
                return [
                    'attribute_definition_id' => $attribute->attribute_definition_id, // ID của attribute_definition
                    'attribute_name' => $attribute->attributeDefinition->attribute_name,
                    'attribute_id' => $attribute->id,  // ID của ProductAttribute
                    'attribute_value' => Str::slug($attribute->attribute_value)
                ];
            }),
        ];
    }
    
}
