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
}: {
  is_member?: boolean;
  has_capacity?: boolean;
  is_owner?: boolean;
  match_student_profile?: boolean;
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Construct query parameters dynamically
  const params = new URLSearchParams();
  if (is_member !== undefined) params.append("is_member", String(is_member));
  if (has_capacity !== undefined)
    params.append("has_capacity", String(has_capacity));
  if (is_owner !== undefined) params.append("is_owner", String(is_owner));
  if (match_student_profile !== undefined)
    params.append("match_student_profile", String(match_student_profile));

  const response = await client.get(`teams/?${params.toString()}`, { headers });
  return response;
};

