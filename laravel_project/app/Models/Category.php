<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = "category";
    protected $fillable = ["name","image","created_at","updated_at"];
    protected $primarykey = "id";
    public $timestamps = true;
    public function products()
    {
        return $this->hasMany(Products::class,'idCategory', 'id');
    }
}
