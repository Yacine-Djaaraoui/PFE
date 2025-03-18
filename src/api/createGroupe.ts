import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const createGroupe = async ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await client.post(
    `teams/`,
    {
      name: name,
      description: description,
    },
    { headers }
  );
  return response.data;
};
