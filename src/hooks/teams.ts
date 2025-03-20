import { fetchTeams } from "@/api/fetchTeams";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useTeams = ({
  is_member,
  has_capacity,
  is_owner,
  match_student_profile,
}: {
  is_member?: boolean;
  has_capacity?: boolean;
  is_owner?: boolean;
  match_student_profile?: boolean;
} = {}): UseQueryResult<[]> => {
  // 👈 Default empty object here
  return useQuery<any>({
    queryKey: [
      "teams",
      is_member,
      has_capacity,
      is_owner,
      match_student_profile,
    ],
    queryFn: () =>
      fetchTeams({ is_member, has_capacity, is_owner, match_student_profile }),
    refetchOnWindowFocus: false,
    retry: false,
    initialData: [],
  });
};
