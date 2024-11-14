import * as request from "~/utils/httpRequest";

export const getProducts = async (page = 1) => {
  try {
    const res = await request.get(`products/list?page=${page}`);
    //console.log(res);
    //dataProducts là tên từ response api trả về (trong function index ProductsController)
    return res;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};

export const checkProductModel = async (productModel) => {
  try {
    //gửi yêu cầu GET đến endpoint check-product-model
    const res = await request.get(`check-product-model`, {
      //gửi tham số product_model với giá trị là productModel.
      params: { product_model: productModel },
    });
    return res.isUnique; // Trả về true nếu mã sản phẩm chưa có trong db, ngược lại là false
  } catch (error) {
    console.error("Error checking product model:", error);
    return false; // Giả sử nếu có lỗi thì coi như không duy nhất
  }
};
export const createProducts = async (data) => {
  //console.log("data new", data);

  try {
    const formData = new FormData();
    //gửi key và value key là "name_product" value là data.name_product
    //key dc lấy từ name ="..." trong form (thẻ Controller)
    //value đã tạo 1 đối tượng data trong hàm saveProducts (Products.js)
    formData.append("name_product", data.name_product);
    if (data.description) {
      formData.append("description", data.description);
    }
    formData.append("product_model", data.product_model);
    formData.append("price_product", data.price_product);
    formData.append("discount", data.discount);
    formData.append("origin", data.origin);
    formData.append("idCategory", data.idCategory);
    if (data.brand_id) {
      formData.append("brand_id", data.brand_id);
    }

    //kiểm tra cả image và images trước khi thêm vào form data nếu có thì gửi,
    //nếu ko có thì không gửi , để đảm bảo server không nhận được gì và cho phép null
    if (data.image) {
      formData.append("image", data.image);
    }
    //  Kiểm tra và thêm nhiều hình ảnh
    if (data.images) {
      data.images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images[]", img); // Sử dụng images[] để gửi nhiều file
        } else {
          console.log("ko gửi dc");
        }
      });
    }

    // Nếu có ảnh thông số kỹ thuật
    if (data.image_specifications) {
      formData.append("image_specifications", data.image_specifications);
    }
    // chuyển đổi sang dạng json khi gửi qua server , bên BE sẽ nhận và chuyển sang array
    if (data.attributes) {
      formData.append("attributes", JSON.stringify(data.attributes));
    }

    const res = await request.post("products/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    //console.log("res", res);

    return res.data;
  } catch (error) {
    console.error("Failed to create products:", error);
    throw error;
  }
};

// Hàm cập nhật products
export const editProducts = async (id, data) => {
  // console.log("api edit trước khi gửi", data);
  try {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name_product", data.name_product);
    formData.append("idCategory", data.idCategory);
    if (data.brand_id) {
      formData.append("brand_id", data.brand_id);
    }
    formData.append("product_model", data.product_model);
    formData.append("origin", data.origin);
    formData.append("discount", data.discount);
    formData.append("price_product", data.price_product);
    formData.append("description", data.description);

    //Nếu có hình ảnh mới, append hình ảnh mới
    if (data.newImage) {
      formData.append("image", data.newImage);
    }
    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        if (file) {
          // Kiểm tra nếu file không undefined
          formData.append("images[]", file);
        }
      });
    }
    if (data.imagesToRemove && data.imagesToRemove.length > 0) {
      data.imagesToRemove.forEach((file) => {
        const fileName = file.name || file.url.split("/").pop(); // Lấy tên file
        formData.append("imagesToRemove[]", fileName);
      });
    }
    if (data.attributes) {
      formData.append("attributes", JSON.stringify(data.attributes));
    }
    const res = await request.post(`products/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    //console.log("res",res);

    return res.data;
  } catch (error) {
    console.error("Failed to update products:", error);
    throw error;
  }
};

export const deleteProducts = async (id) => {
  try {
    const res = await request.del(`products/delete/${id}`); // Using the del method
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
    console.error("Failed to delete :", error);
    throw error;
  }
};
export const getBrand = async () => {
  try {
    const res = await request.get("brand/list");
    //console.log(res);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch :", error);
    throw error;
  }
};
