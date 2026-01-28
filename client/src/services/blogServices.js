import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/blogs";

export const createBlog = async (payload, token) => {
  try {
    const response = await axios.post(BASE_URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error while calling createBlog API", error);
    throw error;
  }
};

export const getAllBlogs = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.log("Error while calling getAllBlogs API", error);
    throw error;
  }
};

export const getBlogById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error while calling getBlogById API", error);
    throw error;
  }
};

export const updateBlog = async (id, payload, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error while calling updateBlog API", error);
    throw error;
  }
};

export const deleteBlog = async (id, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error while calling deleteBlog API", error);
    throw error;
  }
};
