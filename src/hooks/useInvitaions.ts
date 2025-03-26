import { useMutation } from "@tanstack/react-query";
import { CreateInvitaion } from "@/api/createInvitation";

export const useInvitations = () => {
  return useMutation({
    mutationFn: ({ teamId, username }: { teamId: string; username: string }) =>
      CreateInvitaion({ teamId, username }), // Pass parameter
  });
};
