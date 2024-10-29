<?php

namespace App\Http\Controllers\Api\client;

use App\Http\Controllers\Controller;
use App\Http\Resources\resource_client\FindProductsByCategoryResource;
use App\Services\ServicesClient\FindProductsByCategoryServicesClient;
use Illuminate\Http\Request;

class FindProductsByCategoryController extends Controller
{
    protected $findProductsByCategoryServicesClient;
    public function __construct(FindProductsByCategoryServicesClient $findProductsByCategoryServicesClient)
    {
        $this->findProductsByCategoryServicesClient = $findProductsByCategoryServicesClient;
    }


    public function getProductsByCategory(Request $request, $categoryId)
    {
        try {
            $brandName = $request->query('brand', default: null);
            $priceRange = $request->query('price', default: null);
            $products = $this->findProductsByCategoryServicesClient->getProductsByCategoryClient($categoryId, $brandName, $priceRange);
            return FindProductsByCategoryResource::collection($products)->additional([
                'message' => 'success',
                'status_code' => 200,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
