import { fetchProfile } from "@/api/profile";
import { RootState } from "@/redux/store";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export const useMyProfile = (): UseQueryResult<[]> => {
  const token = useSelector((state: RootState) => state.auth.token);
  return useQuery<any>({
    queryKey: ["myProfile", token],
    queryFn: fetchProfile,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!token,
  });
};
