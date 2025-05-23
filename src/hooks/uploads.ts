import {
    useQuery,
    UseQueryOptions,
    UseQueryResult,
  } from "@tanstack/react-query";
  import { fetchUploads, getUploadDetails } from "@/api/uploads";
  
  export const useUploads = (
    {
      search,
      ordering,
      page,
    }: {
      search?: string;
      ordering?: string;
      page?: number;
    } = {},
    options?: UseQueryOptions
  ): UseQueryResult => {
    return useQuery({
      queryKey: ["uploads", search, ordering, page],
      queryFn: () => fetchUploads({ search, ordering, page }),
      refetchOnWindowFocus: false,
      retry: false,
      ...options,
    });
  };
  
  export const useUploadDetails = (
    id: number,
    options?: UseQueryOptions
  ): UseQueryResult => {
    return useQuery({
      queryKey: ["upload", id],
      queryFn: () => getUploadDetails(id),
      refetchOnWindowFocus: false,
      retry: false,
      ...options,
    });
  };