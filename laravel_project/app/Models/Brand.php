<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;
    protected $table = "brands";
    protected $fillable = ["name","image","created_at","updated_at"];
    protected $primarykey = "id";
    public $timestamps = true;
    public function products()
    {
        return $this->hasMany(Products::class, 'brand_id', 'id'); 
    }
}
