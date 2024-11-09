import * as request from "~/utils/httpRequest";

export const getProductsByCategory = async (
  id,
  brand = null,
  price = null,
  sort = null,
  attributes = null
) => {
  try {
    // Bắt đầu với URL cơ bản
    let url = `client/find/category/${id}`;

    // Tạo đối tượng URLSearchParams để xây dựng tham số truy vấn
    const queryParams = new URLSearchParams();

    // Nếu có brand, thêm vào tham số truy vấn
    if (brand) queryParams.append("brand", encodeURIComponent(brand));
    // Nếu có price, thêm vào tham số truy vấn
    if (price) queryParams.append("price", price);

    if (sort) {
      queryParams.append("sort", sort);
    }

    if (attributes && Object.keys(attributes).length > 0) {
      Object.entries(attributes).forEach(([key, values]) => {
        // Nếu `values` là một mảng, chuyển thành chuỗi phân cách bằng dấu phẩy
        if (Array.isArray(values)) {
          queryParams.append(key, values.join(","));
        } else {
          queryParams.append(key, values); // Nếu chỉ là chuỗi đơn
        }
      });
    }
    // Kết hợp đường dẫn cơ bản với tham số truy vấn
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
   // console.log("URL with attributes:", url);
    // Gửi yêu cầu API và nhận kết quả
    const res = await request.get(url);
    //  console.log("API Response: ", res.data);
    //  console.log("API Response: ", res.brands);

    // Trả về dữ liệu từ phản hồi
    return {
      data: res.data,  // Trả về data
      brands: res.brands,  // Trả về brands
      attributes:res.attributes
    };
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Failed to fetch:", error);
    throw error;
  }
};
