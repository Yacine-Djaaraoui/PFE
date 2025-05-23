import { fetchTimeLine, fetchTimeLines } from "@/api/timeLine";
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

  export const useTimeLines = (academic_year : string): UseQueryResult<[]> => {
    return useQuery<any>({
      queryKey: ["timeLines" , academic_year],
      queryFn: () => fetchTimeLines(academic_year),
      refetchOnWindowFocus: false,
      retry: false,
      initialData: [],
    });
  };