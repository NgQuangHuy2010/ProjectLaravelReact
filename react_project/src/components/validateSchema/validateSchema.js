import * as yup from "yup";

export const validateSchema = (fields) => {
  const shape = {};

  fields.forEach(field => {
    const { name, type, required, message, min, max, regex } = field;
    
    // Xác định trình xác thực chính dựa trên type
    let validator;
    switch (type) {
      case "string":
        validator = yup.string();
        break;
      case "number":
        validator = yup.number();
        break;
      case "boolean":
        validator = yup.boolean();
        break;
      case "date":
        validator = yup.date();
        break;
      // Có thể thêm các loại khác ở đây nếu cần
      default:
        validator = yup.mixed(); // Loại mặc định cho các trường không xác định
    }

    // Thêm các ràng buộc cho validator
    if (required) {
      validator = validator.required(message || `${name} là bắt buộc`);
    }
    if (min !== undefined) {
      validator = validator.min(min, `${name} phải lớn hơn hoặc bằng ${min}`);
    }
    if (max !== undefined) {
      validator = validator.max(max, `${name} phải nhỏ hơn hoặc bằng ${max}`);
    }
    if (regex) {
      validator = validator.matches(regex, `${name} không hợp lệ`);
    }

    // Gán validator vào shape
    shape[name] = validator;
  });

  return yup.object().shape(shape);
};
