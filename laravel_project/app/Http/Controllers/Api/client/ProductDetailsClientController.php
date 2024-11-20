<?php

namespace App\Http\Controllers\Api\client;

use App\Http\Controllers\Controller;
use App\Http\Resources\resource_client\ProductDetailsResourceClient;
use App\Services\ServicesClient\ProductDetailsServiceClient;
use Illuminate\Http\Request;

class ProductDetailsClientController extends Controller
{
    protected $productDetailsServiceClient;
    public function __construct(ProductDetailsServiceClient $productDetailsServiceClient)
    {
        $this->productDetailsServiceClient = $productDetailsServiceClient;
    }


    public function productDetails($id){

        try {
            $productDetails = $this->productDetailsServiceClient->productDetails($id);
            return ProductDetailsResourceClient::collection($productDetails)->additional([
                'message' => 'success',
                'status_code' => 200,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
