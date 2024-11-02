<?php

namespace App\Http\Resources\resource_admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
 
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
            'category' => new CategoryResource($this->whenLoaded('category')), 
           'attributes' => ProductAttributeResource::collection($this->whenLoaded('attributes')),

        ];
    }
}
