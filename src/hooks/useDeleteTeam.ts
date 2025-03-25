import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeam } from "@/api/deleteTeam"; // Ensure correct import path

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      // Invalidate and refetch the teams list after deletion
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
    onError: (error) => {
      console.error("Error deleting team:", error);
    },
  });
};
