import { fetchTeachers } from "@/api/fetchTeachers";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useTeachers = ({
  search,
  ordering,
  page,
  page_size,
}: {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  next_url?: string;
} = {}): UseQueryResult<{ results: any[]; next: string | null }> => {
  return useQuery({
    queryKey: ["teachers", search, ordering, page, page_size],
    queryFn: () =>
      fetchTeachers({
        search,
        ordering,
        page,
        page_size,
      }),
    refetchOnWindowFocus: false,
    retry: false,
  });
};
