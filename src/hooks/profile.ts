import { fetchProfile , updateProfile} from "@/api/profile";
import { RootState } from "@/redux/store";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

export const useUpdateProfile = (profile : any) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => updateProfile(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
};


