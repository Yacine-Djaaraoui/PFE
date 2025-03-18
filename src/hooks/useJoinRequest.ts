import { useMutation } from "@tanstack/react-query";
import { joinRequest } from "../api/joinRequest"; // Adjust path if needed

export const useJoinRequest = () => {
  return useMutation({
    mutationFn: ({ teamId, message }: { teamId: string; message: string }) =>
      joinRequest({ teamId, message }), // Pass parameter
  });
};
