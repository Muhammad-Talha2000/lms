import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/assignment";

export const createAssignment = async (subjectId, payload, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/${subjectId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error while calling createAssignment API", error);
  }
};

export const editAssignment = async (
  subjectId,
  assignmentId,
  payload,
  token
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${subjectId}/${assignmentId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error while calling editAssignment API", error);
  }
};

export const deleteAssignment = async (subjectId, assignmentId, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/${subjectId}/${assignmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error while calling deleteAssignment API", error);
  }
};

export const submitAssignment = async (
  subjectId,
  assignmentId,
  payload,
  token
) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/${subjectId}/${assignmentId}/submit`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error while calling submitAssignment API", error);
  }
};

export const getStudentAssignmentSubmission = async (
  subjectId,
  assignmentId,
  token
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${subjectId}/${assignmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(
      "Error while calling getStudentAssignmentSubmission API",
      error
    );
  }
};
