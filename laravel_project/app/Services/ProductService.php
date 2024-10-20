<?php
namespace App\Services;
use App\Repository\Product\ProductRepositoryInterface;



class ProductService
{

    protected $productRepositoryInterface;

    public function __construct(ProductRepositoryInterface $productRepositoryInterface)
    {
        $this->productRepositoryInterface = $productRepositoryInterface;
    }

    public function getAll()
    {
        $products = $this->productRepositoryInterface->hasCategories();

        $defaultImageUrl = asset('file/img/img_default/default-product.png');

        foreach ($products as $productImage) {
            // Xử lý hình ảnh chính
            $productImage->image_url = $productImage->image
                ? asset('file/img/img_product/' . $productImage->image)
                : $defaultImageUrl;

            // Xử lý các hình ảnh khác
            if ($productImage->images) {
                $images = json_decode($productImage->images, true); // Đảm bảo chuyển đổi thành mảng
                if (is_array($images)) {
                    $productImage->images_url = array_map(function ($image) {
                        return asset('file/img/img_product/' . $image);
                    }, $images);
                } else {
                    $productImage->images_url = []; // Nếu không phải mảng, gán mảng rỗng
                }
            } else {
                $productImage->images_url = []; // Nếu không có hình, gán mảng rỗng
            }

            $productImage->price_product = $productImage->price_product ?? 0;
            $productImage->discount = $productImage->discount ?? 0;
        }

        return $products;
    }
}



