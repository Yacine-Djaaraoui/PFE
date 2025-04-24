import { useMutation } from "@tanstack/react-query";
import {
  actionToInvitation,
  actionToJoinRequest,
  actionToSupervisionRequest,
} from "@/api/actionToJoinRequest";

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
export const useActionToSupervisionRequest = () => {
  return useMutation({
    mutationFn: ({
      id,
      action,
      message,
    }: {
      id: string;
      action: string;
      message?: string;
    }) => actionToSupervisionRequest({ id, action, message }), // Pass parameter
  });
};
