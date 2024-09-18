export const buildImageUrl = (relativeUrl) => {
    const baseUrl = process.env.REACT_APP_BASE_URL.replace('api/', '/'); // Loại bỏ 'api/' từ baseURL
    return `${baseUrl}${relativeUrl}`;
};