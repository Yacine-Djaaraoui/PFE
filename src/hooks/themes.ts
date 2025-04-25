import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { fetchThemes } from "@/api/themes";

export const useThemes = (
  {
    search,
    ordering,
    page,
    academic_year,
    academic_program,
    specialty,
    proposed_by,
    next_url,
    page_size,
    co_supervised_by,
    is_verified,
    is_member,
  }: {
    search?: string;
    ordering?: string;
    page?: number;
    academic_year?: number;
    academic_program?: string;
    specialty?: string;
    proposed_by?: number;
    next_url?: string;
    page_size?: number;
    co_supervised_by?: number;
    is_verified?: boolean;
    is_member?:boolean
  } = {},
  options?: UseQueryOptions // Accept query options (e.g., enabled)
): UseQueryResult => {
  return useQuery({
    queryKey: [
      "themes",
      search,
      ordering,
      page,
      academic_year,
      academic_program,
      specialty,
      proposed_by,
      next_url,
      page_size,
      co_supervised_by,
      is_verified,
      is_member,
    ],
    queryFn: () =>
      fetchThemes({
        search,
        ordering,
        page,
        academic_year,
        academic_program,
        specialty,
        proposed_by,
        next_url,
        page_size,
        co_supervised_by,
        is_verified,
        is_member,
      }),
    refetchOnWindowFocus: false,
    retry: false,
    ...options, // Spread additional options like `enabled`
  });
};
