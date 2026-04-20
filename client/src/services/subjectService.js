import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { API_V1_BASE } from "@/config/apiBase";

const API_URL = `${API_V1_BASE}/subjects`;

const SubjectService = {
  getSubjectsByClassId: async (classId) => {
    const response = await axios.get(`${API_URL}?classId=${classId}`);
    return response.data;
  },
  getSubjectById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },
  createSubject: async (classId, payload, token) => {
    console.log(classId, payload, token);
    const response = await axios.post(`${API_URL}/${classId}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  updateSubject: async (id, subjectData, token) => {
    const response = await axios.put(`${API_URL}/${id}`, subjectData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  deleteSubject: async (id, token) => {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default SubjectService;
