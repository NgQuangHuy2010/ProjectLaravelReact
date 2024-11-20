<?php

namespace App\Services\ServicesClient;

use App\Repository\Interface\client\ProductDetailsClientInterface;


class ProductDetailsServiceClient
{
    protected $productDetailsServieClient;

    public function __construct(ProductDetailsClientInterface $productDetailsServieClient)
    {
        $this->productDetailsServieClient = $productDetailsServieClient;
    }

    public function productDetails($id)
    {
        // Lấy chi tiết sản phẩm từ dịch vụ API
        $productDetails = $this->productDetailsServieClient->productDetails($id);

        // Duyệt qua từng sản phẩm trong danh sách chi tiết
        foreach ($productDetails as $productImage) {

            // Xử lý hình ảnh chính:
            // Kiểm tra nếu có hình ảnh, gọi hàm getImageUrl để tạo URL cho hình ảnh chính
            // Nếu không có hình ảnh, sẽ trả về giá trị mặc định là null
            $productImage->image_url = $this->getImageUrl($productImage->image ?? null);

            // Xử lý các hình ảnh khác:
            // Kiểm tra nếu có trường 'images', gọi hàm getImagesUrls để tạo danh sách URL cho các hình ảnh khác
            $productImage->images_url = $this->getImagesUrls($productImage->images ?? null);
        }

        // Trả về danh sách chi tiết sản phẩm đã được xử lý
        return $productDetails;
    }

    private function getImageUrl(?string $image): ?string
    {
        // Hàm này nhận một tên hình ảnh, nếu có sẽ trả về URL của hình ảnh,
        // Nếu không có, sẽ trả về null (hoặc giá trị mặc định nếu cần)
        return $image ? asset('file/img/img_product/' . $image) : null;
    }

    private function getImagesUrls(?string $images): array
    {
        // Kiểm tra nếu trường 'images' có dữ liệu (có thể là JSON chuỗi)
        if ($images) {
            // Giải mã chuỗi JSON thành mảng. Ví dụ: ['image1.jpg', 'image2.jpg']
            $images = json_decode($images, true);

            // Kiểm tra xem dữ liệu đã được giải mã thành mảng hợp lệ chưa
            // Nếu đúng, sử dụng array_map để tạo URL cho từng hình ảnh
            return is_array($images)
                ? array_map(fn($image) => asset('file/img/img_product/' . $image), $images)
                : []; // Nếu không phải mảng hợp lệ, trả về mảng rỗng
        }

        // Nếu không có trường 'images' hoặc giá trị là null, trả về mảng rỗng
        return [];
    }


}
