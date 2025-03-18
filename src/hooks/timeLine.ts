import { fetchTimeLine } from "@/api/timeLine";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useTimeLine = (): UseQueryResult<[]> => {
    return useQuery<any>({
      queryKey: ["timeLine"],
      queryFn: fetchTimeLine,
      refetchOnWindowFocus: false,
      retry: false,
      initialData: [],
    });
  };