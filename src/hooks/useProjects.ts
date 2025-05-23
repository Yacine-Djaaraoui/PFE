// api/fetchProjects.ts
import { ApiClient } from "@/utils/httpClient";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const fetchProjects = async ({
  ordering,
  search,
  page,
  page_size,
  academic_year,
  theme,
  has_team,
}: {
  ordering?: string;
  search?: string;
  page?: number;
  page_size?: number;
  academic_year?: string;
  theme?: string;
  has_team?: boolean;
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const params = new URLSearchParams();
  if (ordering !== undefined) params.append("ordering", String(ordering));
  if (search !== undefined) params.append("search", String(search));
  if (page !== undefined) params.append("page", String(page));
  if (page_size !== undefined) params.append("page_size", String(page_size));
  if (academic_year !== undefined)
    params.append("academic_year", academic_year);
  if (theme !== undefined) params.append("theme", theme);
  if (has_team !== undefined) params.append("has_team", String(has_team));

  const response = await client.get(`projects/?${params.toString()}`, {
    headers,
  });
  return response;
};

export const useProjects = (
  {
    ordering,
    search,
    page,
    page_size,
    academic_year,
    theme,
    has_team,
  }: {
    ordering?: string;
    search?: string;
    page?: number;
    page_size?: number;
    academic_year?: string;
    theme?: string;
    has_team?: boolean;
  },
  options?: UseQueryOptions
) => {
  return useQuery({
    queryKey: [
      "projects",
      { ordering, search, page, page_size, academic_year, theme, has_team },
    ],
    queryFn: () =>
      fetchProjects({
        ordering,
        search,
        page,
        page_size,
        academic_year,
        theme,
        has_team,
      }),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};
