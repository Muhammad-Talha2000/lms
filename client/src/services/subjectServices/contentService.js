import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/content";

export const addContent = async (subjectId, payload, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/${subjectId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error while calling addContent API", error);
  }
};

export const editContent = async (subjectId, contentId, payload, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${subjectId}/${contentId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error while calling editContent API", error);
  }
};

export const deleteContent = async (subjectId, contentId, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/${subjectId}/${contentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error while calling deleteContent API", error);
  }
};
