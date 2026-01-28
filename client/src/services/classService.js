import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/classes"; // Change URL as needed

const ClassService = {
  getClasses: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getClassById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createClass: async (classData, token) => {
    try {
      const response = await axios.post(API_URL, classData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateClass: async (id, classData, token) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, classData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteClass: async (id, token) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  enrollStudentInClass: async (id, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/enroll/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error while calling enroll student in class API", error);
    }
  },
};

export default ClassService;
