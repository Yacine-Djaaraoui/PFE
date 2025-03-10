import { ApiClient } from "@/utils/httpClient";


const client = ApiClient({
  baseURL: "/auth/",
  withCredentials: false,
});

export const fetchProfile = async () => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {} ;
  const response = await client.get(`users/me/`, {
   headers,
  });
  return response;
};
