<?php

namespace App\Http\Controllers\Api\client;

use App\Http\Controllers\Controller;
use App\Http\Resources\resource_client\FeaturedProductClientResource;
use App\Services\ServicesClient\FeaturedProductServiceClient;
use Illuminate\Http\Request;

class FeaturedProductsClientController extends Controller
{
    protected $featuredProductServiceClient;
    public function __construct(FeaturedProductServiceClient $featuredProductServiceClient)
    {
        $this->featuredProductServiceClient = $featuredProductServiceClient;
    }


    public function index(){
        try {
            $products = $this->featuredProductServiceClient->getFeaturedProductClient();
            return FeaturedProductClientResource::collection($products)->additional([
                'message' => 'success',
                'status_code' => 200,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
