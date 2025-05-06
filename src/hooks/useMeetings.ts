import { fetchTeams } from "@/api/fetchTeams";
import { getMembers } from "@/api/getMembers";
import { createMeeting, getMeetings } from "@/api/meetings";
import {
  useMutation,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

export const useMeetings = (
  {
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
  } = {},
  options?: UseQueryOptions // Accept query options (e.g., enabled)
): UseQueryResult<{ results: any[]; next: string | null }> => {
  return useQuery({
    queryKey: ["meetings"],
    queryFn: () =>
      getMeetings({
        ordering,
        page,
        search,
        page_size,
        next_url,
      }),
    refetchOnWindowFocus: false,
    retry: false,
    initialData: [],
    ...options, // Spread additional options like `enabled`
  });
};

export const useCreateMeeting = () => {
  return useMutation({
    mutationFn: ({
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
    }) =>
      createMeeting({
        title,
        description,
        team,
        scheduled_at,
        duration_minutes,
        location_type,
        location_details,
        meeting_link,
      }),
  });
};
