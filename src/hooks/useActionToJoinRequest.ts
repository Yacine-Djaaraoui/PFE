import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  actionToInvitation,
  actionToJoinRequest,
  actionToSupervisionRequest,
} from "@/api/actionToJoinRequest";

export const useActionToJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      actionToJoinRequest({ id, action }),
    onSuccess: () => {
      // Invalidate and refetch the teams list after deletion
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    // Pass parameter// Pass parameter
  });
};
export const useActionToInvitaion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      actionToInvitation({ id, action }),
    onSuccess: () => {
      // Invalidate and refetch the teams list after deletion
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};
export const useActionToSupervisionRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      action,
      message,
    }: {
      id: string;
      action: string;
      message?: string;
    }) => actionToSupervisionRequest({ id, action, message }),
    onSuccess: () => {
      // Invalidate and refetch the teams list after deletion
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["themes"] });
    },
  });
};
