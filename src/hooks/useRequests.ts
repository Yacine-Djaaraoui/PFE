import { fetchMyRequests } from "@/api/myRequests";
import { useQuery } from "@tanstack/react-query";

export const useMyRequests = () => {
  return useQuery({
    queryKey: ["myRequests"],
    queryFn: fetchMyRequests,
  });
};
