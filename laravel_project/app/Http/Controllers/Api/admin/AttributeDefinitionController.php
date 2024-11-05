<?php

namespace App\Http\Controllers\Api\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AttributesDefinitionRequest;
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

    public function create(AttributesDefinitionRequest $request)
    {
        try {
            $attributes = $this->attributeService->create($request);
            return response()->json([
                'data' => $attributes,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function update(AttributesDefinitionRequest $request, $id)
    {
        try {
            $attributes = $this->attributeService->update($request, $id);
            return response()->json([
                'data' => $attributes,
                'message' => 'success',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    public function delete($id)
    {
        return $this->attributeService->delete($id);
    }
}
