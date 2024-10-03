import * as request from "~/utils/httpRequest";

export const getCategory = async () => {
  try {
    const res = await request.get("category");
    //console.log(res);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};
export const createCategory = async (data) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", data.image);

    const res = await request.post("category", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to create category:", error);
    throw error;
  }
};
// Hàm cập nhật category
export const editCategory = async (id, data) => {
  console.log("api gửi đi của category", data);
  
  try {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", data.name); // Tên mới của category

    //Nếu có hình ảnh mới, append hình ảnh mới
    if (data.newImage) {
      formData.append("image", data.newImage);
    }

    const res = await request.post(`category/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to update category:", error);
    throw error;
  }
};
export const deleteCategory = async (id) => {
  try {
    const res = await request.del(`category/${id}`); // Using the del method
    return res.data;
  } catch (error) {
    console.error("Failed to delete category:", error);
    throw error;
  }
};
export const deleteCategoryAll = async (ids) => {
  try {
    const res = await request.del("/categorys/delete-multiple", {
      data: { ids },
    }); // Sử dụng phương thức del với data
    return res.data;
  } catch (error) {
    console.error("Failed to delete categories:", error);
    throw error;
  }
};
