import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/utils/httpClient";
import { useEffect } from "react";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

export const fetchMyRequests = async () => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.get("join-requests/", { headers });
  return response; // Ensure you're returning the data properly
};

const cancelMyRequest = async (id: string) => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.delete(`join-requests/${id}/cancel/`, {
    headers,
  });
  return response;
};

export const useCancelRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelMyRequest,
    onSuccess: () => {
      // Invalidate and refetch the requests list after cancellation
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
    },
  });
};

// supervision
export const fetchMySupervisionRequests = async () => {
  const token = localStorage.getItem("access_token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await client.get("supervision-requests/", { headers });
  return response; // Ensure you're returning the data properly
};

// const cancelMySupervisionRequest = async (id: string) => {
//   const token = localStorage.getItem("access_token");
//   const headers = token ? { Authorization: `Bearer ${token}` } : {};
//   const response = await client.post(`supervision-requests/${id}/cancel/`, {
//     headers,
//   });
//   return response;
// };
// export const useCancelSupervisionRequest = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: cancelMySupervisionRequest,
//     onSuccess: () => {
//       // Invalidate and refetch the requests list after cancellation
//       queryClient.invalidateQueries({ queryKey: ["mySupervisionRequests"] });
//     },
//   });
// };
