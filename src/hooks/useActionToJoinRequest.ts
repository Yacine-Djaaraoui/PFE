import { useMutation } from "@tanstack/react-query";
import { actionToInvitation, actionToJoinRequest } from "@/api/actionToJoinRequest";

export const useActionToJoinRequest = () => {
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      actionToJoinRequest({ id, action }), // Pass parameter
  });
};
export const useActionToInvitaion = () => {
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      actionToInvitation({ id, action }), // Pass parameter
  });
};
