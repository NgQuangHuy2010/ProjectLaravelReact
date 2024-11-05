import * as request from "~/utils/httpRequest";

export const getAttributes = async (categoryId) => {
  try {
    const res = await request.get(`category/${categoryId}/attributes`);
    // console.log(res);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch :", error);
    throw error;
  }
};

export const createAttributes = async (data) => {
  //console.log("data", data);

  try {
    const formData = new FormData();
    formData.append("attribute_name", data.attribute_name);
    formData.append("idCategory", data.idCategory);

    const res = await request.post("attributes/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to create :", error);
    throw error;
  }
};

export const editAttributes = async (id, data) => {
  try {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("attribute_name", data.attribute_name);
    formData.append("idCategory", data.idCategory);

    const res = await request.post(`attributes/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to update :", error);
    throw error;
  }
};

export const deleteAttributes = async (id) => {
  try {
    const res = await request.del(`attributes/delete/${id}`); // Using the del method
    return res.data;
  } catch (error) {
    console.error("Failed to delete:", error);
    throw error;
  }
};
