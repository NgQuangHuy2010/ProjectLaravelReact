import * as request from "~/utils/httpRequest";




export const getProductsByCategory = async (id) => {
  try {
    const res = await request.get(`client/find/category/${id}`);
     //console.log("api",res);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error;
  }
};