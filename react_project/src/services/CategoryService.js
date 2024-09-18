import * as request from '~/utils/httpRequest';

export const getCategory = async () => {
    try {
        const res = await request.get('category');
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
        
        const res = await request.post('category', formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        
        return res.data; 
    } catch (error) {
        console.error("Failed to create category:", error);
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