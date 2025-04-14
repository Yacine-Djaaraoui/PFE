import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "@/api/fetchStudents";

export const useStudents = (
  {
    ordering,
    search,
    page_size,
    page,
    enrollment_year,
    academic_program,
    current_year,
    academic_status,
    speciality,
    has_team,
    show_peers_only,
  }: {
    ordering?: string;
    search?: string;
    page_size?: string;
    page?: string;
    enrollment_year?: string;
    academic_program?: string;
    current_year?: string;
    academic_status?: string;
    speciality?: string;
    has_team?: boolean;
    show_peers_only?: boolean;
  },
  options?: UseQueryOptions // Accepts options like `enabled`
) => {
  return useQuery({
    queryKey: [
      "students",
      {
        ordering,
        search,
        page_size,
        enrollment_year,
        academic_program,
        current_year,
        academic_status,
        speciality,
        has_team,
        show_peers_only,
        page,
      },
    ],
    queryFn: () =>
      fetchStudents({
        ordering,
        search,
        page_size,
        enrollment_year,
        academic_program,
        current_year,
        academic_status,
        speciality,
        has_team,
        show_peers_only,
        page,
      }),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    ...options, // Spread the additional options (e.g., `enabled`)
  });
};
