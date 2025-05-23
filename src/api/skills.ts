// studentSkillsService.ts
import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export interface StudentSkill {
  id?: number;
  name: string;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export const createStudentSkill = async (studentId: string, skillData: Omit<StudentSkill, 'id'>) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.post(`students/${studentId}/skills/`, skillData, {
    headers,
  });
  return response;
};

export const getStudentSkill = async (studentId: string, skillId: string) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.get(`students/${studentId}/skills/${skillId}/`, {
    headers,
  });
  return response;
};

export const updateStudentSkill = async (studentId: string, skillId: string, skillData: Partial<StudentSkill>) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.put(`students/${studentId}/skills/${skillId}/`, skillData, {
    headers,
  });
  return response;
};

export const patchStudentSkill = async (studentId: string, skillId: string, skillData: Partial<StudentSkill>) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.patch(`students/${studentId}/skills/${skillId}/`, skillData, {
    headers,
  });
  return response;
};

export const deleteStudentSkill = async (studentId: string, skillId: string) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.delete(`students/${studentId}/skills/${skillId}/`, {
    headers,
  });
  return response;
};