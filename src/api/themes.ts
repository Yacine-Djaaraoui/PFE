import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const fetchThemes = async ({
  search,
  ordering,
  page,
  academic_year,
  academic_program,
  specialty,
  proposed_by,
  next_url,
  page_size,
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
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // If next_url is provided, use it directly for pagination
  if (next_url) {
    const response = await client.get(next_url, { headers });
    return response;
  }

  // Otherwise, construct query parameters
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (ordering) params.append("ordering", ordering);
  if (page) params.append("page", page.toString());
  if (academic_year) params.append("academic_year", academic_year.toString());
  if (academic_program) params.append("academic_program", academic_program);
  if (specialty) params.append("specialty", specialty);
  if (proposed_by) params.append("proposed_by", proposed_by.toString());
  if (page_size) params.append("page_size", page_size.toString());

  const response = await client.get(`themes/?${params.toString()}`, {
    headers,
  });
  return response;
};

export const createTheme = async ({
  title,
  co_supervisors,
  specialty,
  description,
  tools,
  academic_year,
  academic_program,
  documents = [],
}: {
  title: string;
  co_supervisors?: number[];
  specialty: string;
  description: string;
  tools: string;
  academic_year: number;
  academic_program: string;
  documents?: number[];
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  const payload = {
    title,
    ...(co_supervisors && co_supervisors.length > 0 && { co_supervisors }),
    specialty,
    description,
    tools,
    academic_year,
    academic_program,
    ...(documents && documents.length > 0 && { documents }),
  };

  const response = await client.post("themes/", payload, { headers });
  return response;
};

export const deleteTheme = async (id: number) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { 
    Authorization: `Bearer ${token}` 
  } : {};

  const response = await client.delete(`themes/${id}/`, { headers });
  return response;
};

export const updateTheme = async (
  id: number,
  {
    title,
    co_supervisors,
    specialty,
    description,
    tools,
    academic_year,
    academic_program,
    documents = [],
  }: {
    title: string;
    co_supervisors?: number[];
    specialty: string;
    description: string;
    tools: string;
    academic_year: number;
    academic_program: string;
    documents?: number[];
  }
) => {
  const token = localStorage.getItem("access_token");
  const headers = token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {};

  const payload = {
    title,
    ...(co_supervisors && co_supervisors.length > 0 && { co_supervisors }),
    specialty,
    description,
    tools,
    academic_year,
    academic_program,
    ...(documents && documents.length > 0 && { documents }),
  };

  const response = await client.patch(`themes/${id}/`, payload, { headers });
  return response;
};
