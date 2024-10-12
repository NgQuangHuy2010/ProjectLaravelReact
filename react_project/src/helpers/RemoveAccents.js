export const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD") // Chuẩn hóa chuỗi thành dạng tổ hợp ký tự (normalize)
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các dấu
      .replace(/đ/g, 'd') // Thay đ thành d
      .replace(/Đ/g, 'D') // Thay Đ thành D
      .toLowerCase(); // Chuyển về chữ thường để so sánh
  };