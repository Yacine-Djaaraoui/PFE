import { fetchTeams } from "@/api/fetchTeams";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useTeams = (
  {
    is_member,
    has_capacity,
    is_owner,
    match_student_profile,
    ordering,
    name,
    description,
    search,
    page_size,
    next_url,
  }: {
    is_member?: boolean;
    has_capacity?: boolean;
    is_owner?: boolean;
    match_student_profile?: boolean;
    ordering?: string;
    name?: string;
    description?: string;
    search?: string;
    page_size?: string;
    next_url?: string;
  } = {},
  options?: UseQueryOptions // Accept query options (e.g., enabled)
): UseQueryResult<{ results: any[]; next: string | null }> => {
  return useQuery({
    queryKey: [
      "teams",
      {
        is_member,
        has_capacity,
        is_owner,
        match_student_profile,
        ordering,
        name,
        description,
        search,
        page_size,
        next_url,
      },
    ],
    queryFn: () =>
      fetchTeams({
        is_member,
        has_capacity,
        is_owner,
        match_student_profile,
        ordering,
        name,
        description,
        search,
        page_size,
        next_url,
      }),
    refetchOnWindowFocus: false,
    retry: false,
    ...options, // Spread additional options like `enabled`
  });
};