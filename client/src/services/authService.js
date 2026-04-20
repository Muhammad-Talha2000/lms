import axios from "axios";
import { API_V1_BASE } from "@/config/apiBase";

const BASEURL = `${API_V1_BASE}/auth`;

export const register = async (user) => {
  try {
    console.log(user);
    const response = await axios.post(`${BASEURL}/register`, user);
    return response.data; // Return data to handle response in UI
  } catch (error) {
    console.error("Error while calling register API:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const login = async (user) => {
  try {
    // Fetch public IP
    const ipResponse = await axios.get("https://api64.ipify.org?format=json");
    console.log(ipResponse);
    const userIP = ipResponse.data.ip;

    const response = await axios.post(`${BASEURL}/login`, user, {
      headers: {
        "X-Client-IP": userIP, // Send IP in headers
      },
    });

    console.log(response.data);
    return response.data; // Return token and user info
  } catch (error) {
    console.error("Error while calling login API:", error);
    throw error.response?.data || { message: "Invalid credentials" };
  }
};

export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${BASEURL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user profile:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to fetch user profile" };
  }
};

export const editProfile = async (token, userData) => {
  try {
    const response = await axios.put(`${BASEURL}/edit`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error updating user profile:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to update user profile" };
  }
};

export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${BASEURL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all users:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to fetch users" };
  }
};

export const getPublicInstructors = async () => {
  try {
    const response = await axios.get(`${BASEURL}/instructors/public`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching public instructors:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to fetch instructors" };
  }
};

export const getPublicPlatformStats = async () => {
  try {
    const response = await axios.get(`${BASEURL}/stats/public`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching platform stats:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to fetch platform stats" };
  }
};

export const logoutUser = async (token, userId) => {
  try {
    const response = await axios.post(
      `${BASEURL}/logout`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Signing out", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to sign out" };
  }
};

export const toggleStatus = async (token, instructorId) => {
  try {
    const response = await axios.put(
      `${BASEURL}/toggle-status/${instructorId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Error while calling toggleStatus API", error);
    throw error.response?.data || { message: "Failed to update instructor status" };
  }
};
