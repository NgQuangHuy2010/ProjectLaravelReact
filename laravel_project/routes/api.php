<?php

use App\Http\Controllers\Api\ProductsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;



//category
Route::get('/category', [CategoryController::class, 'index']);
Route::post('/category', [CategoryController::class, 'create']);
Route::put('/category/update/{id}', [CategoryController::class, 'update']);
Route::delete('/category/{id}', [CategoryController::class, 'delete']);
Route::delete('/categorys/delete-multiple', [CategoryController::class, 'deleteMultiple']);
//products
Route::get('/products/list', [ProductsController::class, 'index']);
Route::post('/products/create', [ProductsController::class, 'create']);


