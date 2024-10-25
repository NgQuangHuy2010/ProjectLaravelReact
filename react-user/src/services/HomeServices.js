import * as request from "~/utils/httpRequest";

export const getCategory = async () => {
  try {
    const res = await request.get("client/category/list");
     //console.log("api",res);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error;
  }
};

export const getFeaturedProduct = async () => {
  try {
    const res = await request.get("client/featured-product/list");
     //console.log("product",res);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error;
  }
};