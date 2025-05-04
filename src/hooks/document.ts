import { 
  fetchDocuments, 
  fetchDocumentById, 
  createDocument, 
  updateDocument, 
  patchDocument, 
  deleteDocument 
} from "@/api/document";
import { RootState } from "@/redux/store";
import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { useSelector } from "react-redux";
// import { queryClient } from "@/utils/httpClient";

export interface DocumentType {
  id: number;
  file: string;
  created_at: string;
  updated_at: string;
  title: string;
  document_type: string;
  created_by: number;
  updated_by: number;
}

// Hook to fetch documents list
export const useDocuments = (params?: { 
  search?: string, 
  ordering?: string,
  page?: number 
}): UseQueryResult<{ results: DocumentType[], count: number, next: string | null, previous: string | null }> => {
  const token = useSelector((state: RootState) => state.auth.token);
  return useQuery({
    queryKey: ["documents", params, token],
    queryFn: () => fetchDocuments(params),
    refetchOnWindowFocus: false,
    enabled: !!token,
  });
};

// Hook to fetch a single document by ID
export const useDocument = (id: number): UseQueryResult<DocumentType> => {
  const token = useSelector((state: RootState) => state.auth.token);
  return useQuery({
    queryKey: ["document", id, token],
    queryFn: () => fetchDocumentById(id),
    refetchOnWindowFocus: false,
    enabled: !!token && !!id,
  });
};

// Hook to create a new document
export const useCreateDocument = (): UseMutationResult<DocumentType, Error, FormData> => {
  return useMutation({
    mutationFn: createDocument,
  });
};

// Hook to update a document
export const useUpdateDocument = (): UseMutationResult<DocumentType, Error, { id: number, data: FormData }> => {
  return useMutation({
    mutationFn: ({ id, data }) => updateDocument(id, data),
  });
};

// Hook to patch a document
export const usePatchDocument = (): UseMutationResult<DocumentType, Error, { id: number, data: FormData }> => {
  return useMutation({
    mutationFn: ({ id, data }) => patchDocument(id, data),
  });
};

// Hook to delete a document
export const useDeleteDocument = (): UseMutationResult<void, Error, number> => {
  return useMutation({
    mutationFn: deleteDocument,
  });
};
