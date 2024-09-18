<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    protected $table = "account";
    protected $fillable = ["fullname","email","phone","role"];
    protected $primarykey = "id";
    public $timestamps = false;
}
