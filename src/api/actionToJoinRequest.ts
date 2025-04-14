import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const actionToJoinRequest = async ({
  id,
  action,
}: {
  id: string;
  action: string;
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await client.put(
    `join-requests/${id}/`,
    {
      action: action,
    },
    { headers }
  );
  return response.data;
};
export const actionToInvitation = async ({
  id,
  action,
}: {
  id: string;
  action: string;
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await client.put(
    `invitations/${id}/`,
    {
      action: action,
    },
    { headers }
  );
  return response.data;
};
