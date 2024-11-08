<?php

namespace App\Http\Controllers\Api\client;

use App\Http\Controllers\Controller;
use App\Http\Resources\resource_client\FindProductsByCategoryResource;
use App\Http\Resources\resource_client\sortPriceProduct;
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
          //  $attributes = $request->query('attributes', default: null);
            $attributes = $request->query(); // Lấy các tham số attributes (bao gồm tất cả query string còn lại)
            $keysToRemove = ['sort', 'price','brand'];
            foreach ($keysToRemove as $key) {
                // Loại bỏ tham số khác ra khỏi attributes để ko bị lỗi
                unset($attributes[$key]);
            }
            $filteredAttributes = [];
            foreach ($attributes as $key => $value) {
                if (preg_match('/^attributes\[(\d+)\]$/', $key, $matches)) {
                    $filteredAttributes[$matches[1]] = $value;
                }
            }
            $products = $this->findProductsByCategoryServicesClient->getProductsByCategoryClient($categoryId, $brandName, $priceRange, $sortOrder,  $filteredAttributes);
            return FindProductsByCategoryResource::collection($products)->additional([
                'message' => 'success',
                'status_code' => 200,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
