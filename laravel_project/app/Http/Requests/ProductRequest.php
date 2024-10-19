<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name_product" => "required|string|max:255",
            'image' => 'nullable|mimes:jpeg,png,gif,jpg,ico,webp|max:4096',
            'images' => 'nullable|array',
            //images.* là để xác thực từng file trong 1 mảng
            'images.*' => 'nullable|mimes:jpeg,png,gif,jpg,ico,webp|max:4096',
            'image_specifications' => 'nullable|mimes:jpeg,png,gif,jpg,ico,webp|max:4096',
            'price_product' => "nullable|numeric",
            'discount' => "nullable|numeric",
            'model' => "nullable|string|max:100",
            'idCategory' => "required|integer",
            'description' => "nullable",
            'product_model' => "nullable|unique:products,product_model",
        ];
    }
}
