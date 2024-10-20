<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }
    public function index()
    {
        try {
            $categories = $this->categoryService->getAllCategory();
            return CategoryResource::collection($categories)->additional([
                'message' => 'success',
                'status_code' => 200,
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    public function create(CategoryRequest $request)
    {
        try {
            $category = $this->categoryService->create($request);
            return new CategoryResource($category);
        } catch (\Exception $e) {
            return response()->json([
                'error' => false,
                'message' => $e->getMessage(),
            ], 500);
        }

    }

    public function update(CategoryRequest $request, $id)
    {
        try {
            $category = $this->categoryService->update($request, $id);
            return new CategoryResource($category);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                // Trả về thông điệp lỗi từ exception bên service là dòng "category notfound"
                'message' => $e->getMessage(),
                'status_code' => $e->getCode() // Trả về mã lỗi
            ], $e->getCode());
        }
    }


    public function delete($id)
    {
        return $this->categoryService->delete($id);

    }

    // public function deleteMultiple(Request $request)
    // {
    //     $ids = $request->input('ids'); // id dạng mảng get

    //     try {
    //         // check if id
    //         $categories = Category::whereIn('id', $ids)->get();
    //         if ($categories->isEmpty()) {
    //             return response()->json([
    //                 'failed' => true,
    //                 'message' => 'No categories found!',
    //             ], 404);
    //         }

    //         foreach ($categories as $category) {
    //             @unlink(public_path('file/img/img_category/' . $category->image));
    //         }

    //         Category::destroy($ids); // Delete categories by IDs

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Categories deleted successfully!',
    //         ], 200);
    //     } catch (\Throwable $th) {
    //         return response()->json([
    //             'failed' => true,
    //             'message' => 'Error deleting categories!',
    //         ], 400);
    //     }
    // }


}
