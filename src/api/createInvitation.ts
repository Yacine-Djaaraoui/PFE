import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const CreateInvitaion = async ({
  teamId,
  username,
}: {
  teamId: string;
  username: string;
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await client.post(
    `invitations/create/`,
    {
      team_id: teamId,
      invitee_username: username,
    },
    { headers }
  );
  return response;
};
