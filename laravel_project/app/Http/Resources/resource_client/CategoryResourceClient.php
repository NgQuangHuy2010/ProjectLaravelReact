<?php

namespace App\Http\Resources\resource_client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'products' => $this->whenLoaded('products', function () {
                return $this->products->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name_product' => $product->name_product, // Giả sử có thuộc tính name_product trong Product
                        'price_product' => $product->price_product,
                        'brand' => $product->brand ? [
                            'id' => $product->brand->id,
                            'name' => $product->brand->name // Giả sử có thuộc tính name trong Brand
                        ] : null,
                    
                    ];
                });
            }),
            
        ];
    }
}
