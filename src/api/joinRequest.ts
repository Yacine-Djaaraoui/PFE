import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const joinRequest = async ({
  teamId,
  message,
}: {
  teamId: string;
  message: string;
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await client.post(
    `join-requests/create/`,
    {
      team_id: teamId,
      message: message,
    },
    { headers }
  );
  return response.data;
};
