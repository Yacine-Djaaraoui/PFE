import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/utils/httpClient";
import { useEffect } from "react";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const fetchMySupervisorRequest = async () => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.get("supervision-requests/?status=pending/", {
    headers,
  });
  return response; // Ensure you're returning the data properly
};

const cancelMySuervisorRequest = async (id: string) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.post(`supervision-requests/${id}/cancel/`, {
    headers,
  });
  return response;
};

export const useCancelSupervisorRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelMySuervisorRequest,
    onSuccess: () => {
      // Invalidate and refetch the requests list after cancellation
      queryClient.invalidateQueries({ queryKey: ["mySupervisorRequests"] });
    },
  });
};
