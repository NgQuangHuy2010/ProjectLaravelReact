<?php

namespace App\Http\Resources\resource_admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttributeDefinitionResource extends JsonResource
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
            'attribute_name' => $this->attribute_name,
            'idCategory' => $this->idCategory
            // Các thuộc tính khác của attribute definition
        ];
    }
}
