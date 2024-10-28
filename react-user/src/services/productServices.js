import * as request from "~/utils/httpRequest";




export const getProductsByCategory = async (id,brand= null) => {
  try {
    const url = brand 
      ? `client/find/category/${id}?brand=${encodeURIComponent(brand)}` 
      : `client/find/category/${id}`;

    const res = await request.get(url);
     //console.log("api",res);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error;
  }
};