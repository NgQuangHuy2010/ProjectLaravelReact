import * as request from "~/utils/httpRequest";

export const getProducts = async () => {
  try {
    const res = await request.get("products/list");
     //console.log(res);
    //dataProducts là tên từ response api trả về (trong function index ProductsController)
     return res.dataProducts; 
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};
export const createProducts = async (data) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", data.image);

    const res = await request.post("products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to create products:", error);
    throw error;
  }
};
// Hàm cập nhật products
export const editProducts = async (id, data) => {
  try {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", data.name); // Tên mới của products

    //Nếu có hình ảnh mới, append hình ảnh mới
    if (data.newImage) {
      formData.append("image", data.newImage);
    }

    const res = await request.post(`products/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to update products:", error);
    throw error;
  }
};
export const deleteProducts = async (id) => {
  try {
    const res = await request.del(`products/${id}`); // Using the del method
    return res.data;
  } catch (error) {
    console.error("Failed to delete products:", error);
    throw error;
  }
};
export const deleteProductsAll = async (ids) => {
  try {
    const res = await request.del("/products/delete-multiple", {
      data: { ids },
    }); // Sử dụng phương thức del với data
    return res.data;
  } catch (error) {
    console.error("Failed to delete categories:", error);
    throw error;
  }
};
