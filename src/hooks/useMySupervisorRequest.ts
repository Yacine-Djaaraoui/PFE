import { fetchMySupervisorRequest } from "@/api/supervisorRequest";
import { useQuery } from "@tanstack/react-query";

export const useMySupervisorRequests = () => {
  return useQuery({
    queryKey: ["mySupervisorRequests"],
    queryFn: fetchMySupervisorRequest,
  });
};
