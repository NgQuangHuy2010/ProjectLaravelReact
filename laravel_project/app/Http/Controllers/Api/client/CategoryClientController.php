<?php

namespace App\Http\Controllers\Api\client;

use App\Http\Controllers\Controller;
use App\Http\Resources\resource_client\CategoryResourceClient;
use App\Services\ServicesClient\CategoryServiceClient;
use Illuminate\Http\Request;

class CategoryClientController extends Controller
{
    protected $categoryServiceClient;

    public function __construct(CategoryServiceClient $categoryServiceClient)
    {
        $this->categoryServiceClient = $categoryServiceClient;
    }


    public function index()
    {
        try {
            $categories = $this->categoryServiceClient->getCategoryClient();
            return CategoryResourceClient::collection($categories)->additional([
                'message' => 'success',
                'status_code' => 200,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
