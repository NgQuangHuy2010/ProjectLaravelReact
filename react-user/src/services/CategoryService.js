import * as request from "~/utils/httpRequest";

export const getCategory = async () => {
  try {
    const res = await request.get("client/category/list");
     //console.log("api",res);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};