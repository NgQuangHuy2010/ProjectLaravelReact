<?php


namespace App\Repository\Admin;
use App\Models\AttributeDefinition;
use App\Models\ProductAttribute;
use App\Repository\BaseRepository;
use App\Repository\Interface\admin\ProductAttributeRepositoryInterface;





class ProductAttributeRepository extends BaseRepository implements ProductAttributeRepositoryInterface
{
    public function __construct(ProductAttribute $model)
    {
        parent::__construct($model);
    }


    public function create(array $attributes)
    {
        return $this->model->create($attributes);
    }
    public function findByProductIdAndDefinitionId($productId, $definitionId)
    {
        return $this->model->where('product_id', $productId)
            ->where('attribute_definition_id', $definitionId)
            ->first(); // Trả về đối tượng đầu tiên nếu có
    }
    public function update($id, array $data)
    {
        return $this->model->where('id', $id)->update($data);
    }

    //Lấy danh sách các thuộc tính của một sản phẩm dựa trên ID sản phẩm.
    //tìm các thuộc tính có 'product_id' tương ứng với ID sản phẩm 
    public function getAttributesByProductId(int $productId)
    {
        return $this->model->where('product_id', $productId)->get();
    }
    //Lấy danh sách các thuộc tính hợp lệ cho một danh mục mới dựa trên ID danh mục.
    public function getValidAttributesForNewCategory(int $categoryId)
    {
        return AttributeDefinition::where('idCategory', $categoryId)->get();
    }

    //Kiểm tra xem một thuộc tính có hợp lệ cho một danh mục cụ thể hay không.
    // đảm bảo rằng các thuộc tính chỉ được áp dụng cho các danh mục phù hợp
    // Tránh việc bị trùng lặp thuộc tính 
    //ví dụ Tivi thì có thuộc tính kích thước , độ phân giải ,... chứ ko thể có thêm thuộc tính số cửa, dung tích,.. từ danh mục khác dc
    public function isAttributeValidForCategory(int $attributeDefinitionId, int $categoryId): bool
    {
        // Lấy danh sách các thuộc tính hợp lệ cho danh mục mới
        $validAttributes = $this->getValidAttributesForNewCategory($categoryId);

        // Chuyển đổi danh sách thuộc tính hợp lệ thành mảng chứa ID
        $validAttributeIds = $validAttributes->pluck('id')->toArray();

        // Kiểm tra xem thuộc tính đã cho có nằm trong danh sách ID hợp lệ không
        return in_array($attributeDefinitionId, $validAttributeIds);
    }

}
