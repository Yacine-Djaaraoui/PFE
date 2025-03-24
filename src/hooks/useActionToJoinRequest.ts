import { useMutation } from "@tanstack/react-query";
import { actionToJoinRequest } from "@/api/actionToJoinRequest";

export const useActionToJoinRequest = () => {
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      actionToJoinRequest({ id, action }), // Pass parameter
  });
};
