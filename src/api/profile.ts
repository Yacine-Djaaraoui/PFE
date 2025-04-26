import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const fetchProfile = async () => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {} ;
  const response = await client.get(`auth/users/me/`, {
   headers,
  });
  return response;
};

export const updateProfile = async (data: {
  username?: string;
  first_name?: string;
  last_name?: string;
  user_type?: string;
  profile_picture_url?: string;
  country?: string;
  state?: string;
  phone_number?: string;
  postal_code?: string;
  resume?: string;
  year_of_birth?: number;
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.patch(`auth/users/me/`, data, {
    headers,
  });
  return response;
};
