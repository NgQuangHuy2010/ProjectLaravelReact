<?php

namespace App\Http\Controllers\Api\client;

use App\Http\Controllers\Controller;
use App\Http\Resources\resource_client\BrandResourceClient;
use App\Http\Resources\resource_client\FindProductsByCategoryResource;
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
            //  $attributes = $request->query('attributes', default: null);
            $attributes = $request->query(); // Lấy các tham số attributes (bao gồm tất cả query string còn lại)
            \Log::info(  'Attributes:', $attributes);
           //\Log::info('Full URL:', [$request->fullUrl()]);
            $keysToRemove = ['sort', 'price', 'brand'];
            foreach ($keysToRemove as $key) {
                // Loại bỏ tham số khác ra khỏi attributes để ko bị lỗi
                unset($attributes[$key]);
            }
            $filteredAttributes = [];
            foreach ($attributes as $key => $value) {
                if (is_array($value)) {
                    $filteredAttributes[$key] = is_array($value) ? $value : explode(',', $value);
                } else {
                    // Nếu giá trị là chuỗi (ví dụ: 1=43inch,55inch), tách chuỗi thành mảng
                    $filteredAttributes[$key] = explode(',', $value);
                    
                }
            }
            $products = $this->findProductsByCategoryServicesClient->getProductsByCategoryClient($categoryId, $brandName, $priceRange, $sortOrder, $filteredAttributes);
            
            return response()->json([
                'data' => FindProductsByCategoryResource::collection($products['products']),
                'brands' =>BrandResourceClient::collection($products['brands']),
                'attributes' => $products['attributes'],
                'message' => 'success',
                'status_code' => 200,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
