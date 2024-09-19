export const buildImageUrl = (relativeUrl) => {
    const baseUrl = process.env.REACT_APP_BASE_URL.replace('api/', '/'); // Loại bỏ 'api/' từ baseURL
    // const fullUrl = `${baseUrl}${relativeUrl}`;
    // console.log("Image URL:", fullUrl); // In ra để kiểm tra
    return `${baseUrl}${relativeUrl}`;
};