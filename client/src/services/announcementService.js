import axios from "axios";
import { API_V1_BASE } from "@/config/apiBase";

const BASEURL = `${API_V1_BASE}/announcement`;

export const createAnnouncement = async (courseId, payload, token) => {
  try {
    const response = await axios.post(
      `${BASEURL}/${courseId}/create`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error while calling create announcement API: ", error);
  }
};

export const getCourseAnnouncents = async (courseId) => {
  try {
    const response = await axios.get(`${BASEURL}/${courseId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error while calling get course announcments API: ", error);
  }
};

export const getAnnouncementById = async (announcementId) => {
  try {
    const response = await axios.get(`${BASEURL}/${announcementId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error while calling get announcement by ID API: ", error);
    return null;
  }
};

// Update an announcement
export const updateAnnouncement = async (announcementId, payload, token) => {
  try {
    const response = await axios.put(`${BASEURL}/${announcementId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error while calling update announcement API: ", error);
    return null;
  }
};

// Delete an announcement
export const deleteAnnouncement = async (courseId, announcementId, token) => {
  try {
    const response = await axios.delete(
      `${BASEURL}/${courseId}/${announcementId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error while calling delete announcement API: ", error);
    return null;
  }
};
