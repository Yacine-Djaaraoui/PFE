import { fetchTeams } from "@/api/fetchTeams";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useTeams = (): UseQueryResult<[]> => {
  return useQuery<any>({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    refetchOnWindowFocus: false,
    retry: false,
    initialData: [],
  });
};
