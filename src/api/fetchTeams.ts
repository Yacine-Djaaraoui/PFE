import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const fetchTeams = async ({
  is_member,
  has_capacity,
  is_owner,
  match_student_profile,
  ordering,
  name,
  description,
  search,
  page_size,
  page,
  academic_year,
  is_supervisor,
  next_url, // Add this new optional parameter
}: {
  page: string;
  is_member?: boolean;
  has_capacity?: boolean;
  is_owner?: boolean;
  match_student_profile?: boolean;
  ordering?: string;
  name?: string;
  academic_year?: string;
  description?: string;
  search?: string;
  page_size?: string;
  is_supervisor?: boolean;
  next_url?: string; // Add type definition
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // If next_url is provided, use it directly
  if (next_url) {
    const response = await client.get(next_url, { headers });
    return response;
  }

  // Otherwise, construct query parameters as before
  const params = new URLSearchParams();
  if (is_member !== undefined) params.append("is_member", String(is_member));
  if (has_capacity !== undefined)
    params.append("has_capacity", String(has_capacity));
  if (is_owner !== undefined) params.append("is_owner", String(is_owner));
  if (match_student_profile !== undefined)
    params.append("match_student_profile", String(match_student_profile));
  if (ordering !== undefined) params.append("ordering", String(ordering));
  if (name !== undefined) params.append("name", String(name));
  if (academic_year !== undefined)
    params.append("academic_year", String(academic_year));
  if (page) params.append("page", page);

  if (description !== undefined)
    params.append("description", String(description)); // Fixed: was using ordering instead of description
  if (search !== undefined) params.append("search", String(search));
  if (page_size !== undefined) params.append("page_size", String(page_size));
  if (is_supervisor !== undefined)
    params.append("is_supervisor", String(is_supervisor));

  const response = await client.get(`teams/?${params.toString()}`, { headers });
  return response;
};
export const fetchTeam = async (id: string) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await client.get(`teams/${id}/`, { headers });
  return response;
};
