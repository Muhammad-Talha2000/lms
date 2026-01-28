import axios from "axios";

const BASEURL = "http://localhost:5000/api/v1/notifications";

export const getNotifications = async () => {
  try {
    const response = await axios.get(BASEURL);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications", error);
    return [];
  }
};
