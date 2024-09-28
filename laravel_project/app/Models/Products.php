<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    protected $table = "products";
    protected $fillable = ["name_product", "description", "product_model", "price_product","discount","image","images","idCategory","status","origin","image_specifications"];
    protected $primarykey = "id";
    public $timestamps = true;
    public function category()
    {
        //thiết lập quan hệ "Nhiều đến Một" (Many-to-One) trong Eloquent
        //mỗi proucts thuộc về 1 category
        return $this->belongsTo(Category::class, 'idCategory', 'id');
    }
}
