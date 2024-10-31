<?php

namespace App\Http\Controllers\Api\client;

use App\Http\Controllers\Controller;
use App\Http\Resources\resource_admin\getAttributesByCategory;
use App\Services\ServicesAdmin\AttributeDefinitionService;


class AttributeDefinitionController extends Controller
{
    protected $attributeService;

    public function __construct(AttributeDefinitionService $attributeService)
    {
        $this->attributeService = $attributeService;
    }
    public function getAttributesByCategory($id)
    {
        try {
            $attributes = $this->attributeService->getAttributesByCategory($id);
            return getAttributesByCategory::collection($attributes)->additional([
                'message' => 'success',
                'status_code' => 200,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
        
        
    }
}
