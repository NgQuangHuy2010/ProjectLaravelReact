<?php

namespace App\Http\Resources\resource_client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SearchProductClientResource extends JsonResource
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
            'price_product' => $this->price_product,
            'discount' => $this->discount,
            'image' => $this->image,
            'image_url' => $this->image_url, // Sử dụng accessor
            'idCategory' => $this ->idCategory,
            'brand_id' => $this ->brand_id,
        ];
    }
}
