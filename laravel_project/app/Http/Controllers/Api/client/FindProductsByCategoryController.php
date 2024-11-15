<?php

namespace App\Http\Controllers\Api\client;

use App\Http\Controllers\Controller;
use App\Http\Resources\resource_client\AttributesResourceClient;
use App\Http\Resources\resource_client\BrandResourceClient;
use App\Http\Resources\resource_client\FindProductsByCategoryResource;
use App\Http\Resources\resource_client\PaginationDataResource;
use App\Http\Resources\resource_client\sortPriceProduct;
use App\Models\AttributeDefinition;
use App\Models\Brand;
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
            $sortOrder = $request->query('sort', default: null);
            $perPage = $request->query('per_page', 12);// Nếu không có giá trị 'per_page' trong query, mặc định sẽ là 5
            $attributes = $request->query();
            //\Log::info(  'Attributes:', $attributes);
            //\Log::info('Full URL:', [$request->fullUrl()]);
            $products = $this->findProductsByCategoryServicesClient->getProductsByCategoryClient($categoryId, $brandName, $priceRange, $sortOrder, $attributes, $perPage);
            return response()->json([
                'data' => FindProductsByCategoryResource::collection($products['products']),
                'brands' => BrandResourceClient::collection($products['brands']),
                'attributes' => AttributesResourceClient::collection($products['attributes']),
                'pagination' => new PaginationDataResource($products['products']),
                'message' => 'success',
                'status_code' => 200,
            ]);
            // return response()->json(
            //     $products
            // );
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
