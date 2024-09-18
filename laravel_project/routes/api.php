<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;




Route::get('/category', [CategoryController::class, 'index']);
Route::post('/category', [CategoryController::class, 'create']);
Route::delete('/category/{id}', [CategoryController::class, 'delete']);
Route::delete('/categorys/delete-multiple', [CategoryController::class, 'deleteMultiple']);


