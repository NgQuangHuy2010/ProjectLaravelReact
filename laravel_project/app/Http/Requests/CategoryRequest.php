<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Log;
use Illuminate\Validation\ValidationException;

class CategoryRequest extends FormRequest
{

    public function authorize(): bool
    {
        //bật true để cho phép client có quyền truy cập
        return true;
    }


    public function rules(): array
    {
       // Log::info('Validating CategoryRequest');
        return [
            'name' =>'required|string|max:255',
            'image' => 'nullable|mimes:jpeg,png,gif,jpg,ico,webp|max:4096',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw (new ValidationException($validator, response()->json([
            'error' => true,
            'messages' => $validator->errors(),
        ], 422)));
    }


}
