import { actionToJoinRequest } from "@/api/actionToJoinRequest";
import {
  useActionToInvitaion,
  useActionToJoinRequest,
} from "@/hooks/useActionToJoinRequest";
import { useWebSocket } from "@/hooks/useWebsocket";
import { RootState } from "@/redux/store";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";

const Notification = () => {
  const { messages, sendMessage, markAsRead } = useWebSocket();
  console.log(messages);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const queryClient = useQueryClient(); // Get the query client instance

  const actionToJoinRequest = useActionToJoinRequest();
  const actionToInvitaion = useActionToInvitaion();
  const HandleAction = (
    id: string,
    action: string,
    notification_id: string,
    notification_type: string
  ) => {
    if (notification_type === "team_join_request") {
      actionToJoinRequest.mutate(
        { id, action },
        {
          onSuccess: () => {
            setError(""); // Clear any previous errors
            setSuccess(`create team successfully`);
            markAsRead(notification_id);
            queryClient.invalidateQueries({ queryKey: ["teams"] });
          },
          onError: (error) => {
            setError("Failed to send join request. Please try again.");
          },
        }
      );
    }
    if (notification_type === "team_invitation") {
      actionToInvitaion.mutate(
        { id, action },
        {
          onSuccess: () => {
            setError(""); // Clear any previous errors
            setSuccess(`create team successfully`);
            markAsRead(notification_id);
            queryClient.invalidateQueries({ queryKey: ["teams"] });
          },
          onError: (error) => {
            setError("Failed to send join request. Please try again.");
          },
        }
      );
    }
  };
  const getTimeDifference = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays}j`; // "j" for "jours" (days in French)
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo`; // "mo" for "months"
  };

  return (
    <>
      {/* join requests */}
      <ul className="w-full border-t-[#D0D5DD] border-t ">
        {messages[0]?.notifications?.map((notification) =>
          (notification.type === "team_join_request" ||
            notification.type === "team_invitation") &&
          notification.status === "unread" ? (
            <div className="flex items-start gap-2">
              <li
                key={notification.id} // Always add a unique key when mapping lists
                className="border-b-[#D0D5DD] relative p-5 w-full border-b text-[#334155] flex-wrap font-normal text-sm  flex items-start justify-between gap-2"
              >
                <span className="max-w-[85%]">{notification.content}</span>
                <span className="">
                  {getTimeDifference(notification.created_at)}
                </span>
                <div className="mt-2 w-full">
                  <button
                    onClick={() =>
                      HandleAction(
                        notification.type === "team_join_request"
                          ? notification.metadata.join_request_id
                          : notification.metadata.invitation_id,
                        "accept",
                        notification.id,
                        notification.type
                      )
                    }
                    className="mt-2 bg-secondary cursor-pointer hover:bg-secondary/85 text-white px-3 py-1 rounded"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() =>
                      HandleAction(
                        notification.type === "team_join_request"
                          ? notification.metadata.join_request_id
                          : notification.metadata.invitation_id,
                        "decline",
                        notification.id,
                        notification.type
                      )
                    }
                    className="mt-2 border-[#D0D5DD] border bg-white cursor-pointer text-[#475569] px-3 py-1 rounded ml-2"
                  >
                    Rejeter
                  </button>
                </div>
              </li>
            </div>
          ) : (
            <li
              key={notification.id} // Always add a unique key when mapping lists
              className="border-b-[#D0D5DD] relative p-5 w-full border-b text-[#334155] flex-wrap font-normal text-sm  flex items-start justify-between gap-2"
            >
              <span className="max-w-[85%]">{notification.content}</span>
              <span className="">
                {getTimeDifference(notification.created_at)}
              </span>
            </li>
          )
        )}
      </ul>
    </>
  );
};

export default Notification;
