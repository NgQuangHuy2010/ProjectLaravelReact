<?php

namespace App\Http\Resources\resource_client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductAttributesResourceClient extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'attribute_definition_id' => $this->attribute_definition_id,
            'attribute_value' => $this->attribute_value,
        ];
    }
}
