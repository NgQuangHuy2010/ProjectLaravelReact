<?php

namespace App\Http\Controllers\Api\admin;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function index(){
        // Lấy tất cả danh mục
        $account = Account::get();
        
        // Trả về response dạng JSON
        return response()->json([
            'data' => $account,
            'message'=> 'success',
            'status_code' => '200'
        ],200);
    }
}
