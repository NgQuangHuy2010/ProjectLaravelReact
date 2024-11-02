<?php

namespace App\Repository\Admin;

use App\Models\Category;
use App\Models\Products;
use App\Repository\BaseRepository;
use App\Repository\Interface\admin\ProductRepositoryInterface;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    // Hàm khởi tạo cho CategoryRepository, truyền vào đối tượng Products
    public function __construct(Products $model)
    {
        parent::__construct($model); // Gọi hàm khởi tạo từ BaseRepository
    }

    /**
     * Kiểm tra xem sản phẩm có tồn tại không bằng cách sử dụng ID.
     * @param int $id - ID của sản phẩm
     * @return bool - Trả về true nếu sản phẩm tồn tại, false nếu không
     */
    public function existsInProduct($id)
    {
        return $this->model->where('id', $id)->exists();
    }


    public function delete($id)
    {
        $load = $this->find($id);
        @unlink(public_path('file/img/img_product/' . $load->image));
        if ($load->images != "") {
            $images = json_decode($load->images);
            // Xóa hình ảnh liên quan nếu có
            foreach ($images as $key) {
                @unlink(public_path('file/img/img_product/' . $key));
            }
            $load->delete();
            return true;
        }

        return false;
    }

    /**
     * Lấy tất cả sản phẩm cùng với quan hệ đã liên kết trong model.
     */
    public function getAllWithRelations()
    {
        // Load cả hai quan hệ category và attributes
        return $this->model->with(['category', 'attributes.attributeDefinition'])->get();
    }


    /**
     * Kiểm tra xem một danh mục có tồn tại hay không bằng ID danh mục.
     * 
     * @param int $categoryId - ID của danh mục cần kiểm tra
     * @return bool - Trả về true nếu danh mục tồn tại, false nếu không
     */
    public function categoryExists($categoryId)
    {
        // Kiểm tra idCategory dc thêm có tồn tại trong bảng category không
        return Category::where('id', $categoryId)->exists();
    }

    /**
     * Lấy danh sách tất cả các mã sản phẩm hiện có.
     * phương thức pluck trong Eloquent sẽ lấy riêng một cột dữ liệu từ cơ sở dữ liệu và trả về giá trị của cột đó dưới dạng một mảng
     * @return array - Mảng chứa tất cả các mã sản phẩm trong hệ thống
     */
    public function existingProductModels()
    {
        return $this->model->pluck('product_model')->toArray();
    }


    /**
     * Tìm nhiều sản phẩm theo danh sách ID.
     * Khi select nhiều id để xóa nhanh thì tìm xem trong mảng đó các id có tồn tại trong bảng product ko
     * @param array $ids - Mảng ID các sản phẩm cần tìm
     * @return \Illuminate\Database\Eloquent\Collection - Danh sách sản phẩm tìm được
     */
    public function findMultiple(array $ids)
    {
        return Products::whereIn('id', $ids)->get();
    }

    /**
     * Xóa nhiều sản phẩm theo danh sách ID khi đã kiểm tra findMultiple bên đoạn trên
     * 
     * @param array $ids - Mảng ID các sản phẩm cần xóa
     */
    public function deleteMultiple(array $ids)
    {
        return Products::destroy($ids);
    }

    /**
     * Lấy danh sách các hình ảnh bổ sung của sản phẩm.
     * Ban đầu, hình ảnh được lưu trong cơ sở dữ liệu dưới dạng một chuỗi JSON với kiểu dữ liệu là JSON.
     * json_decode để giải mã một chuỗi hay mảng JSON thành kiểu mảng vì nếu ko dùng json_decode để chuyển thì khi truy xuất nó sẽ trả một chuỗi Json thay vì một mảng.,
     * chuyển sng dạng mảng để có thẻ xử lý từng phần từ trong mảng 
     */
    public function getImages($product)
    {
        return json_decode($product->images) ?? [];
    }

    /**
     * Tìm các sản phẩm theo ID danh mục.
     * 
     * @param int $categoryId - ID của danh mục cần lấy sản phẩm
     * @return \Illuminate\Database\Eloquent\Collection - Danh sách sản phẩm thuộc danh mục
     */
    public function findByCategoryId($categoryId)
    {
        return Products::where('idCategory', $categoryId)->get();
    }
}
