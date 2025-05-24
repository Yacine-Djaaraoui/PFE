import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const fetchUploads = async ({
  search,
  ordering,
  page,
  teamId
}: {
  search?: string;
  ordering?: string;
  page?: number;
  teamId?:number;
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (ordering) params.append("ordering", ordering);
  if (page) params.append("page", page.toString());
  if (teamId) params.append("team", teamId.toString());

  const response = await client.get(`uploads/?${params.toString()}`, { headers });
  return response;
};

export const createUpload = async ({
    team,
    title,
    url,
    description,
  }: {
    team: number;         // Required - ID of the team this upload belongs to
    title: string;        // Required - Title of the uploaded file
    url: string;          // Required - URL where the file can be accessed
    description?: string; // Optional - Description of the upload
  }) => {
    const token = localStorage.getItem("access_token");
    const headers = token ? { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    } : {};
  
    const payload = {
      team,
      title,
      url,
      ...(description && { description }), // Only include description if provided
    };
  
    const response = await client.post("uploads/", payload, { headers });
    return response;
  };

export const getUploadDetails = async (id: number) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await client.get(`uploads/${id}/`, { headers });
  return response;
};



export const updateUpload = async (
  id: number,
  {
    team,
    title,
    url,
    description,
  }: {
    team?: number;
    title?: string;
    url?: string;
    description?: string;
  }
) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const payload = {
    ...(team && { team }),
    ...(title && { title }),
    ...(url && { url }),
    ...(description && { description }),
  };

  const response = await client.patch(`uploads/${id}/`, payload, { headers });
  return response;
};

export const deleteUpload = async (id: number) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await client.delete(`uploads/${id}/`, { headers });
  return response;
};

export const addCommentToUpload = async (
  id: number,
  { content }: { content: string }
) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await client.post(
    `uploads/${id}/comment/`,
    { content },
    { headers }
  );
  return response;
};