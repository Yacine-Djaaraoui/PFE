import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const fetchDocuments = async (params?: { 
  search?: string, 
  ordering?: string,
  page?: number 
}) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.get('documents/', {
    headers,
    params
  });
  return response;
};

export const fetchDocumentById = async (id: number) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.get(`documents/${id}/`, {
    headers
  });
  return response;
};

export const createDocument = async (documentData: FormData) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  } : {};
  const response = await client.post('documents/', documentData, {
    headers
  });
  return response;
};

export const updateDocument = async (id: number, documentData: FormData) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  } : {};
  const response = await client.put(`documents/${id}/`, documentData, {
    headers
  });
  return response;
};

export const patchDocument = async (id: number, documentData: FormData) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  } : {};
  const response = await client.patch(`documents/${id}/`, documentData, {
    headers
  });
  return response;
};

export const deleteDocument = async (id: number) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.delete(`documents/${id}/`, {
    headers
  });
  return response;
};
