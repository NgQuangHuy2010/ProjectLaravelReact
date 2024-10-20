<?php

namespace App\Http\Resources;

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
            'price' => $this->price_product,
            'discount' => $this->discount,
            'image_url' => $this->image_url, // Sử dụng accessor
            'images_url' => $this->images_url, // Sử dụng accessor
            'status' => $this->status,
            'origin' => $this->origin,
            'image_specifications' => $this->image_specifications,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'category' => new CategoryResource($this->whenLoaded('category')), // Trả về category, nếu có
        ];
    }
}
