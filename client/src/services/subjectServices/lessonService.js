import axios from "axios";
import { API_V1_BASE } from "@/config/apiBase";

const BASE_URL = `${API_V1_BASE}/lesson`;

export const addLesson = async (subjectId, payload, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/${subjectId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error while calling addLesson API", error);
  }
};

export const editLesson = async (subjectId, lessonId, payload, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${subjectId}/${lessonId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error while calling editLesson API", error);
  }
};

export const deleteLesson = async (subjectId, lessonId, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/${subjectId}/${lessonId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error while calling deleteLesson API", error);
  }
};
