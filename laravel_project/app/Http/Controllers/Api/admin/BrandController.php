<?php

namespace App\Http\Controllers\Api\admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\resource_admin\BrandResource;

use App\Services\ServicesAdmin\BrandService;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    protected $brandService;

    public function __construct(BrandService $brandService)
    {
        $this->brandService = $brandService;
    }
    public function index()
    {
        try {
            $brand = $this->brandService->getAllbrand();
            return BrandResource::collection($brand)->additional([
                'message' => 'success',
                'status_code' => 200,
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
