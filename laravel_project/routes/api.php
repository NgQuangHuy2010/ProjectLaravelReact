<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\client\CategoryClientController;



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

//end admin



//user
Route::get('/client/category/list', [CategoryClientController::class, 'index']);

//end user