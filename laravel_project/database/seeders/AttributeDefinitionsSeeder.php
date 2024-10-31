<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttributeDefinitionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('attribute_definitions')->insert([
            // Thuộc tính cho Tivi (ID: 27)
            ['idCategory' => 27, 'attribute_name' => 'Kích thước màn hình'],
            ['idCategory' => 27, 'attribute_name' => 'Độ phân giải'],
            ['idCategory' => 27, 'attribute_name' => 'Loại Tivi'],

            // Thuộc tính cho Máy lạnh (ID: 28)
            ['idCategory' => 28, 'attribute_name' => 'Công suất'],
            ['idCategory' => 28, 'attribute_name' => 'Loại máy'],
            ['idCategory' => 28, 'attribute_name' => 'Công nghệ Inverter'],
            ['idCategory' => 28, 'attribute_name' => 'Kiểu dáng'],

            // Thuộc tính cho Tủ lạnh (ID: 29)
            ['idCategory' => 29, 'attribute_name' => 'Dung tích'],
            ['idCategory' => 29, 'attribute_name' => 'Số cửa tủ'],
            ['idCategory' => 29, 'attribute_name' => 'Kiểu tủ lạnh'],
            ['idCategory' => 29, 'attribute_name' => 'Công nghệ Inverter'],

            // Thuộc tính cho Máy giặt (ID: 30)
            ['idCategory' => 30, 'attribute_name' => 'Khối lượng giặt'],
            ['idCategory' => 30, 'attribute_name' => 'Kiểu máy giặt'],
            ['idCategory' => 30, 'attribute_name' => 'Công nghệ Inverter'],
        ]);
    }
}
