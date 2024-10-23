<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BrandsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brands = [
            ['name' => 'Toshiba', 'image' => 'TOSHIBA_Logo.png'],
            ['name' => 'Samsung', 'image' => 'Samsung_logo_blue.png'],
            ['name' => 'Panasonic', 'image' => 'Panasonic_logo.png'],
            ['name' => 'Sharp', 'image' => 'logo_sharp.png'],
            ['name' => 'AQUA', 'image' => 'logo_aqua.png'],
            ['name' => 'LG', 'image' => 'LG_logo.png'],
            ['name' => 'Hitachi', 'image' => 'hitachi_logo.png'],
        ];

        // Lưu từng thương hiệu vào cơ sở dữ liệu.
        foreach ($brands as $brand) {
            Brand::create($brand);
        }
    }
}
