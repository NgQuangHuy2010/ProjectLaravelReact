<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DeleteMutipleProductRequest;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Products;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Log;
use Validator;

class ProductsController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }
    public function index()
    {
        try {
            $product = $this->productService->getAll();
            return ProductResource::collection($product)->additional([
                'message' => 'success',
                'status_code' => 200,
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }


    public function create(ProductRequest $request)
    {

        try {
            $product = $this->productService->create($request);
            return new ProductResource($product);
        } catch (\Exception $e) {
            return response()->json([
                'error' => false,
                'message' => $e->getMessage(),
            ], 500);
        }

    }



    public function update(ProductRequest $request, $id)
    {
        try {
            $product = $this->productService->update($request, $id);
            return new ProductResource($product);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                // Trả về thông điệp lỗi từ exception bên service là dòng "product notfound"
                'message' => $e->getMessage(),
                'status_code' => $e->getCode() // Trả về mã lỗi
            ], $e->getCode());
        }


    }

    public function delete($id)
    {
        return $this->productService->delete($id);
    }


    public function deleteMultipleProducts(DeleteMutipleProductRequest $request)
    {
        return $this->productService->deleteMultipleProducts($request->input('ids'));
    }


    public function findProductsByCategory($categoryId)
    {
        return $this->productService->findProductsByCategory($categoryId);
    }

}