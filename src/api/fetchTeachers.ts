import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const fetchTeachers = async ({
  search,
  ordering,
  page,
  page_size,
}: {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Otherwise, construct query parameters
  const params = new URLSearchParams();
  if (search !== undefined) params.append("search", String(search));
  if (ordering !== undefined) params.append("ordering", String(ordering));
  if (page !== undefined) params.append("page", String(page));
  if (page_size !== undefined) params.append("page_size", String(page_size));

  const response = await client.get(`teachers/?${params.toString()}`, {
    headers,
  });
  return response;
};
