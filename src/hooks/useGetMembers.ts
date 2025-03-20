import { fetchTeams } from "@/api/fetchTeams";
import { getMembers } from "@/api/getMembers";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetMembers = ({ id } = {}): UseQueryResult<[]> => {
  // 👈 Default empty object here
  return useQuery<any>({
    queryKey: ["members", id],
    queryFn: () => getMembers({ id }),
    refetchOnWindowFocus: false,
    retry: false,
    initialData: [],
  });
};
