import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const fetchTimeLine = async () => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.get(`timelines/my-timelines/`, {
    headers,
  });
  return response;
};

export const fetchTimeLines = async (academic_year : string) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const params = new URLSearchParams();
  if (academic_year) params.append("academic_year", academic_year);
  const response = await client.get(`timelines/?${params.toString()}`, {
    headers,
  });
  return response;
};
