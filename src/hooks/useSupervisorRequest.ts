import { useMutation } from "@tanstack/react-query";
import { joinRequest } from "../api/joinRequest"; // Adjust path if needed
import { supervisorRequest } from "@/api/createSupervition-request";

export const useSupervisorRequest = () => {
  return useMutation({
    mutationFn: ({
      teamId,
      message,
      themeId,
    }: {
      teamId: string;
      message: string;
      themeId: string;
    }) => supervisorRequest({ teamId, message, themeId }), // Pass parameter
  });
};
