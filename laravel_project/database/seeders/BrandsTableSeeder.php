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
            ['name' => 'Toshiba', 'image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv1c1GqXhID3pirs9pGTG2eRcRN1PC6FqfYg&s'],
            ['name' => 'Panasonic', 'image' => 'https://dienmayphucngocanh.com/wp-content/uploads/2024/09/PANASONIC.png'],
            ['name' => 'Samsung', 'image' => 'https://banner2.cleanpng.com/20180715/cjb/aavflecfa.webp'],
            ['name' => 'LG', 'image' => 'https://static.wikia.nocookie.net/logos/images/6/64/LG_1995.png/revision/latest/scale-to-width-down/700?cb=20230120080707&path-prefix=vi'],
            ['name' => 'AQUA', 'image' => 'https://ew.aquavietnam.com.vn/Libraries/dist/img/logo_login.png'],
            ['name' => 'Hitachi', 'image' => 'https://airconditioningperth.com.au/wp-content/uploads/2022/07/hitachi-logo.png'],
            ['name' => 'Sharp', 'image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCpL9K1475d1FeqxIjfTxWOA3gAjiI6iOpPw&s'],
        ];

        // Lưu từng thương hiệu vào cơ sở dữ liệu.
        foreach ($brands as $brand) {
            Brand::create($brand);
        }
    }
}
