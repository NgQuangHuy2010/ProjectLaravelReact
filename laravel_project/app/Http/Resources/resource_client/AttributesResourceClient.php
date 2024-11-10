<?php

namespace App\Http\Resources\resource_client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttributesResourceClient extends JsonResource
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
            'idCategory' => $this->idCategory,
            'attribute_name' => $this->attribute_name,
            //load mối quan hệ từ FindProductsByCategoryRepository trong hàm getProductsByCategory sau đó trả qua service -> controller
            //lúc này  trả ra controller và gán vào biến $products
            // Dữ liệu được chuyển qua AttributesResourceClient để xử lý dữ liệu trước khi trả về cho client
            //
            'product_attributes' => ProductAttributesResourceClient::collection($this->whenLoaded('productAttributes')), 
        ];
    }
}
