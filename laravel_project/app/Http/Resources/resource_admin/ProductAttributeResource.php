<?php

namespace App\Http\Resources\resource_admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductAttributeResource extends JsonResource
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
            'product_id' => $this->product_id,
            'attribute_definition_id' => $this->attribute_definition_id,
            'attribute_value' => $this->attribute_value,
            'attribute_definition' => new AttributeDefinitionResource($this->whenLoaded('attributeDefinition')), // Lấy thông tin attribute definition nếu đã tải
        ];
    }
}
