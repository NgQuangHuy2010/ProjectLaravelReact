import * as request from "~/utils/httpRequest";

export const getProductsByCategory = async (
  id,
  brand = null,
  price = null,
  sort = null
) => {
  try {
    // Bắt đầu với URL cơ bản
    let url = `client/find/category/${id}`;

    // Tạo đối tượng URLSearchParams để xây dựng tham số truy vấn
    const queryParams = new URLSearchParams();

    // Nếu có brand, thêm vào tham số truy vấn
    if (brand) {
      queryParams.append("brand", encodeURIComponent(brand));
    }

    // Nếu có price, thêm vào tham số truy vấn
    if (price) {
      queryParams.append("price", price);
    }

    if (sort) {
      queryParams.append("sort", sort);
    }
    // Kết hợp đường dẫn cơ bản với tham số truy vấn
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    // Gửi yêu cầu API và nhận kết quả
    const res = await request.get(url);

    // Trả về dữ liệu từ phản hồi
    return res.data;
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Failed to fetch:", error);
    throw error;
  }
};
