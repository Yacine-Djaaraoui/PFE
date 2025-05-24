import {
    useQuery,
    UseQueryOptions,
    UseQueryResult,
  } from "@tanstack/react-query";
  import { fetchUploads, getUploadDetails } from "@/api/uploads";
  
  export const useUploads = (
    {
      teamId,
      search,
      ordering,
      page,
    }: {
      search?: string;
      ordering?: string;
      page?: number;
      teamId?:number;
    } = {},
    options?: UseQueryOptions
  ): UseQueryResult => {
    return useQuery({
      queryKey: ["uploads", search, ordering, page , teamId],
      queryFn: () => fetchUploads({ search, ordering, page , teamId }),
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
      queryKey: ["uploads", id],
      queryFn: () => getUploadDetails(id),
      refetchOnWindowFocus: false,
      retry: false,
      ...options,
    });
  };