import axios from "axios";
import { API_V1_BASE } from "@/config/apiBase";

const BASEURL = `${API_V1_BASE}/course`;

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const createCourse = async (courseData, token) => {
  try {
    const response = await axios.post(`${BASEURL}/create`, courseData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        timezone,
      },
    });
    return response.data; // This will return the course data after it's created
  } catch (error) {
    // Error handling
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          "An error occurred while creating the course."
      );
    } else if (error.request) {
      throw new Error("Network error, please try again later.");
    } else {
      throw new Error(error.message || "An unknown error occurred.");
    }
  }
};

export const getCourses = async () => {
  try {
    console.log("🔹 [CLIENT] Fetching courses from API...");
    const response = await axios.get(BASEURL);
    console.log("✅ [CLIENT] Courses fetched successfully:", response.data);
    return response.data || [];
  } catch (error) {
    console.error("❌ [CLIENT] Error while calling Get Courses API", error);
    return [];
  }
};

export const getCourseById = async (id) => {
  try {
    const response = await axios.get(`${BASEURL}/${id}`);
    // console.log(response.data);
    return response.data;
  } catch {
    console.log("Error while calling Get Course by Id API", error);
  }
};

export const updateCourse = async (courseData, id, token) => {
  try {
    const response = await axios.put(`${BASEURL}/edit/${id}`, courseData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error while calling Update Course by Id API", error);
  }
};

// Get a student's assignment submission
export const getAssignmentSubmission = async (
  courseId,
  assignmentId,
  token
) => {
  try {
    const response = await axios.get(
      `${BASEURL}/${courseId}/assignments/${assignmentId}/submission`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.submission;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching submission"
    );
  }
};

// Submit an assignment
export const submitAssignment = async (
  courseId,
  assignmentId,
  fileUrl,
  token
) => {
  try {
    const response = await axios.post(
      `${BASEURL}/${courseId}/assignments/${assignmentId}/submit`,
      { fileUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error submitting assignment"
    );
  }
};

export const submitQuizAttempt = async (
  courseId,
  quizId,
  token,
  answers,
  score
) => {
  try {
    const response = await axios.post(
      `${BASEURL}/${courseId}/quizzes/${quizId}/attempts`,
      { answers, score },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error while calling Submit Quiz Attempt API", error);
  }
};

export const getQuizAttempt = async (courseId, quizId, token) => {
  try {
    const response = await axios.get(
      `${BASEURL}/${courseId}/quizzes/${quizId}/attempts/student`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          "An error occurred while fetching quiz attempt."
      );
    } else if (error.request) {
      throw new Error("Network error, please try again later.");
    } else {
      throw new Error(error.message || "An unknown error occurred.");
    }
  }
};

// export const enrollStudentInCourse = async (courseId, studentId, token) => {
//   try {
//     const response = await axios.post(
//       `${BASEURL}/${courseId}/enroll`,
//       { studentId },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.log(error.response?.data?.message || "Failed to enroll in course");
//   }
// };

export const enrollStudentInCourse = async (courseId, payload, token) => {
  try {
    const response = await axios.post(
      `${BASEURL}/${courseId}/enroll`,
      payload, // Send the entire payload instead of just studentId
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Throw error if response indicates failure
    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  } catch (error) {
    // Throw the error instead of just logging it
    throw new Error(
      error.response?.data?.message || "Failed to enroll in course"
    );
  }
};

export const publishCourse = async (courseId, publishStatus, token) => {
  const response = await axios.patch(
    `${BASEURL}/${courseId}/publish`,
    { published: publishStatus },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.course;
};
