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
            'attribute_definition_id' => $this->attribute_definition_id,
            'attribute_name' => $this->attributeDefinition->attribute_name,
            'attribute_id' => $this->id,
            'attribute_value' => $this->attribute_value,
        ];
    }
}
