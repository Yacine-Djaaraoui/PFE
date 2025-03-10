import { fetchProfile } from "@/api/profile";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useMyProfile = (): UseQueryResult<[]> => {
    return useQuery<any>({
      queryKey: ["myProfile"],
      queryFn: fetchProfile,
      refetchOnWindowFocus: false,
      retry: false,
      initialData: [],
    });
  };