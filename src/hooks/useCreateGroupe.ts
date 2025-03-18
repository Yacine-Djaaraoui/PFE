import { useMutation } from "@tanstack/react-query";
import { createGroupe } from "@/api/createGroupe";

export const useCreateGroupe = () => {
  return useMutation({
    mutationFn: ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => createGroupe({ name, description }), // Pass parameter
  });
};
