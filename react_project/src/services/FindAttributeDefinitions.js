import * as request from "~/utils/httpRequest";

export const getAttributes= async (categoryId) => {
  try {
    const res = await request.get(`category/${categoryId}/attributes`);
   // console.log(res);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};