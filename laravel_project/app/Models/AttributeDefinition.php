<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttributeDefinition extends Model
{
    protected $table = "attribute_definitions";
    protected $fillable = ["idCategory", "attribute_name"];
    protected $primaryKey = "id";
    public $timestamps = true;

    public function category()
    {
        return $this->belongsTo(Category::class, 'idCategory', 'id');
    }
    public function productAttributes()
    {
        return $this->hasMany(ProductAttribute::class, 'attribute_definition_id');
    }
}
