import { fetchTeams } from "@/api/fetchTeams";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useTeams = ({
  is_member,
  has_capacity,
  is_owner,
  match_student_profile,
  ordering,
  name,
  description,
  search,
  page_size,
  next_url, // Add next_url parameter
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
  next_url?: string; // Add type definition
} = {}): UseQueryResult<{ results: any[]; next: string | null }> => {
  // Update return type to include pagination
  return useQuery({
    queryKey: [
      "teams",
      is_member,
      has_capacity,
      is_owner,
      match_student_profile,
      ordering,
      name,
      description,
      search,
      page_size,
      next_url, // Include next_url in queryKey
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
        next_url, // Pass next_url to fetchTeams
      }),
    refetchOnWindowFocus: false,
    retry: false,
    initialData: { results: [], next: null }, // Update initialData structure
  });
};