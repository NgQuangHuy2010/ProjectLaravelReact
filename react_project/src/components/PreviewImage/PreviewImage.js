// FilePreview.js
import { useState } from 'react';

// Hàm chuyển đổi file thành chuỗi Base64
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// Custom hook quản lý preview
const useFilePreview = () => {
  const [previewOpen, setPreviewOpen] = useState(false); // Giữ nguyên tên state như yêu cầu
  const [previewImage, setPreviewImage] = useState(""); // Giữ nguyên tên state như yêu cầu

  // Hàm hiển thị file để xem trước
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  return {
    previewOpen,
    setPreviewOpen,
    previewImage,
    handlePreview,
    setPreviewImage
  };
};

export { useFilePreview };
