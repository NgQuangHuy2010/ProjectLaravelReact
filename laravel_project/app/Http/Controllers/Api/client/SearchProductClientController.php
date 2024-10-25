<?php

namespace App\Http\Controllers\Api\client;

use App\Http\Controllers\Controller;
use App\Http\Resources\resource_client\SearchProductClientResource;
use App\Services\ServicesClient\SearchProductServiceClient;
use Illuminate\Http\Request;

class SearchProductClientController extends Controller
{
    protected $searchProductServiceClient;
    public function __construct(SearchProductServiceClient $searchProductServiceClient)
    {
        $this->searchProductServiceClient = $searchProductServiceClient;
    }

    public function resultSearch(){
        try {
            $products = $this->searchProductServiceClient->getSearchProductClient();
            return SearchProductClientResource::collection($products)->additional([
                'message' => 'success',
                'status_code' => 200,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
