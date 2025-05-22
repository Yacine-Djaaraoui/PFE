import { ApiClient } from "@/utils/httpClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const getMeetings = async ({
  ordering,
  page,
  search,
  page_size,
  next_url, // Add this new optional parameter
}: {
  ordering?: string;
  search?: string;
  page_size?: string;
  page?: string;
  next_url?: string; // Add type definition
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const params = new URLSearchParams();

  if (ordering !== undefined) params.append("ordering", String(ordering));
  if (page !== undefined) params.append("page", String(page));

  if (search !== undefined) params.append("search", String(search));
  if (page_size !== undefined) params.append("page_size", String(page_size));
  const response = await client.get(`meetings/?${params.toString()}`, {
    headers,
  });
  return response;
};

export const createMeeting = async ({
  title,
  description,
  team,
  scheduled_at,
  duration_minutes,
  location_type,
  location_details,
  meeting_link,
}: {
  title: string;
  description?: string;
  team: number;
  scheduled_at: string;
  duration_minutes?: number;
  location_type?: "online" | "physical";
  location_details?: string;
  meeting_link?: string;
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await client.post(
    `meetings/`,
    {
      title,
      description,
      team,
      scheduled_at,
      duration_minutes,
      location_type,
      location_details,
      meeting_link,
    },
    { headers }
  );
  return response;
};

const cancelMeeting = async (id: string) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.post(`meetings/${id}/cancel/`, {
    headers,
  });
  return response;
};
export const useCanceMetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelMeeting,
    onSuccess: () => {
      // Invalidate and refetch the requests list after cancellation
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
};
