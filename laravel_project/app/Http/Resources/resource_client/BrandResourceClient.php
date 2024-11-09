<?php

namespace App\Http\Resources\resource_client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Str;

class BrandResourceClient extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'image' => $this->image,
            'imageBrand_url' => asset('file/img/img_brand/' . $this->image),
           
        ];
    }
}
