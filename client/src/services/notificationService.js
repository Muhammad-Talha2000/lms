import axios from "axios";
import { API_V1_BASE } from "@/config/apiBase";

const BASEURL = `${API_V1_BASE}/notifications`;

export const getNotifications = async () => {
  try {
    const response = await axios.get(BASEURL);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications", error);
    return [];
  }
};
