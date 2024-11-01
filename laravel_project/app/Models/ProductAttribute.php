<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductAttribute extends Model
{
    protected $table = "product_attributes";
    protected $fillable = ["product_id", "attribute_definition_id", "attribute_value"];
    protected $primaryKey = "id";
    public $timestamps = true;

    // thuộc vè product
    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id', 'id');
    }

    public function attributeDefinition()
    {
        return $this->belongsTo(AttributeDefinition::class, 'attribute_definition_id', 'id');
    }
}
