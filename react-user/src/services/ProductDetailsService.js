import * as request from "~/utils/httpRequest";

export const getProductDetails= async (id) => {
    try {
      const res = await request.get(`client/find/product-details/${id}`);
      return res;
    } catch (error) {
      console.error("Failed to fetch :", error);
      throw error;
    }
  };