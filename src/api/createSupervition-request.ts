import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const joinRequest = async ({
  teamId,
  message,
  themeId,
}: {
  teamId: string;
  message: string;
  themeId: string;
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await client.post(
    `supervision-requests/create/`,
    {
      theme_id: themeId,
      team_id: teamId,
      message: message,
    },
    { headers }
  );
  return response.data;
};
