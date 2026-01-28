import axios from "axios";

const BASEURL = "https://lms-corporateprism-backend.vercel.app/api/v1/course";

// Function to get auth headers

export const getDiscussions = async (courseId, token) => {
  try {
    const response = await axios.get(`${BASEURL}/${courseId}/discussions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching discussions:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createDiscussion = async (courseId, discussionData, token) => {
  try {
    const response = await axios.post(
      `${BASEURL}/${courseId}/discussions`,
      discussionData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating discussion:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const toggleLike = async (courseId, discussionId, token) => {
  try {
    const response = await axios.put(
      `${BASEURL}/${courseId}/discussions/${discussionId}/like`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error toggling like:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Add a reply to a discussion post
export const addReply = async (courseId, discussionId, content, token) => {
  try {
    const response = await axios.post(
      `${BASEURL}/${courseId}/discussions/${discussionId}/replies`,
      { content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding reply:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteDiscussion = async (courseId, discussionId, token) => {
  try {
    const response = await axios.delete(
      `${BASEURL}/${courseId}/discussions/${discussionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting discussion:",
      error.response?.data || error.message
    );
    throw error;
  }
};
