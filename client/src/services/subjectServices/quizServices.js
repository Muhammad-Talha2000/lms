import axios from "axios";
import { API_V1_BASE } from "@/config/apiBase";

const BASE_URL = `${API_V1_BASE}/quiz`;

export const createQuiz = async (subjectId, payload, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/${subjectId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error while calling create Quiz API", error);
  }
};

export const editQuiz = async (subjectId, quizId, payload, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${subjectId}/${quizId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error while calling editQuiz API", error);
  }
};

export const deleteQuiz = async (subjectId, quizId, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${subjectId}/${quizId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error while calling delete Quiz API", error);
  }
};

export const submitQuiz = async (subjectId, quizId, payload, token) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/${subjectId}/${quizId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error while calling submitQuiz API", error);
  }
};

export const getStudentQuizAttempt = async (subjectId, quizId, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/${subjectId}/${quizId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error while calling getStudentQuizAttempt API", error);
  }
};
