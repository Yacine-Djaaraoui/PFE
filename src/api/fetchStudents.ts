import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const fetchStudents = async ({
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
}: {
  ordering?: string;
  search?: string;
  page_size?: string;
  enrollment_year?: string;
  academic_program?: string;
  current_year?: string;
  academic_status?: string;
  page?: string;
  speciality?: string;
  has_team?: boolean;
  show_peers_only?: boolean;
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const params = new URLSearchParams();

  if (ordering) params.append("ordering", ordering);
  if (search) params.append("search", search);
  if (page_size) params.append("page_size", page_size);
  if (enrollment_year) params.append("enrollment_year", enrollment_year);
  if (academic_program) params.append("academic_program", academic_program);
  if (current_year) params.append("current_year", current_year);
  if (academic_status) params.append("academic_status", academic_status);
  if (speciality) params.append("speciality", speciality);
  if (page) params.append("page", page);
  if (has_team !== undefined) params.append("has_team", String(has_team));
  if (show_peers_only !== undefined)
    params.append("show_peers_only", String(show_peers_only));

  const response = await client.get(`students/?${params.toString()}`, {
    headers,
  });
  return response; // Ensure data is properly extracted
};
