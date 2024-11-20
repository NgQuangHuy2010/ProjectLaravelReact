<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\client\ProductDetailsClientController;
use App\Http\Controllers\Api\client\FindProductsByCategoryController;
use App\Http\Controllers\Api\client\SearchProductClientController;
use App\Http\Controllers\Api\client\CategoryClientController;
use App\Http\Controllers\Api\client\FeaturedProductsClientController;



use App\Http\Controllers\Api\admin\AttributeDefinitionController;
use App\Http\Controllers\Api\admin\BrandController;
use App\Http\Controllers\Api\admin\ProductsController;
use App\Http\Controllers\Api\admin\CategoryController;


//admin
//category
Route::get('/category/list', [CategoryController::class, 'index']);
Route::post('/category/create', [CategoryController::class, 'create']);
Route::put('/category/update/{id}', [CategoryController::class, 'update']);
Route::delete('/category/{id}', [CategoryController::class, 'delete']);
Route::delete('/categorys/delete-multiple', [CategoryController::class, 'deleteMultiple']);
//products
Route::get('/products/list', [ProductsController::class, 'index']);
Route::post('/products/create', [ProductsController::class, 'create']);
Route::get('/check-product-model', [ProductsController::class, 'checkProductModel']);
Route::delete('/products/delete/{id}', [ProductsController::class, 'delete']);
Route::delete('/products/delete-multiple', [ProductsController::class, 'deleteMultipleProducts']);
Route::put('/products/update/{id}', [ProductsController::class, 'update']);
Route::get('/products/find/{categoryId}',[ProductsController::class,'findProductsByCategory']);
//brand
Route::get('/brand/list', [BrandController::class, 'index']);
//attributes definition
Route::post('/attributes/create', [AttributeDefinitionController::class, 'create']);
Route::get('category/{id}/attributes', [AttributeDefinitionController::class, 'getAttributesByCategory']);  //truy vấn idcategory lấy các attributes tương ứng
Route::put('/attributes/update/{id}', [AttributeDefinitionController::class, 'update']);
Route::delete('/attributes/delete/{id}', [AttributeDefinitionController::class, 'delete']);

//end admin



//user
Route::get('/client/category/list', [CategoryClientController::class, 'index']);
Route::get('/client/featured-product/list', [FeaturedProductsClientController::class, 'index']);
Route::get('/client/search', [SearchProductClientController::class, 'resultSearch']);
Route::get('/client/find/category/{id}', [FindProductsByCategoryController::class, 'getProductsByCategory']);
Route::get('/client/find/product-details/{id}', [ProductDetailsClientController::class, 'productDetails']);


//end user