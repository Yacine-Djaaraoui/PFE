import { actionToJoinRequest } from "@/api/actionToJoinRequest";
import { useActionToJoinRequest } from "@/hooks/useActionToJoinRequest";
import { useWebSocket } from "@/hooks/useWebsocket";
import { RootState } from "@/redux/store";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";

const Notification = () => {
    const { messages, sendMessage, markAsRead } = useWebSocket();
    console.log(messages)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const queryClient = useQueryClient(); // Get the query client instance

 
  const actionToJoinRequest = useActionToJoinRequest();
  const HandleAction = (
    id: string,
    action: string,
    notification_id: string
  ) => {
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
          notification.type === "team_join_request" &&
          notification.status === "unread" ? (
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
                      notification.metadata.join_request_id,
                      "accept",
                      notification.id
                    )
                  }
                  className="mt-2 bg-secondary cursor-pointer hover:bg-secondary/85 text-white px-3 py-1 rounded"
                >
                  Accepter
                </button>
                <button
                  onClick={() =>
                    HandleAction(
                      notification.metadata.join_request_id,
                      "decline",
                      notification.id
                    )
                  }
                  className="mt-2 border-[#D0D5DD] border bg-white cursor-pointer text-[#475569] px-3 py-1 rounded ml-2"
                >
                  Rejeter
                </button>
              </div>
            </li>
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
      {/* other type of notification */}
      {/* <ul className="w-full border-t-[#D0D5DD] border-t ">
        {messages[0]?.notifications?.map(
          (notification) =>
            notification.type !== "team_join_request" &&
            notification.status === "unread" && (
              <li
                key={notification.id} // Always add a unique key when mapping lists
                className="border-b-[#D0D5DD] p-5 border-b text-[#334155] font-normal text-sm"
              >
                {notification.content}
              </li>
            )
        )}
      </ul> */}
      {/* <ul className="mt-2 space-y-4 p-4">
        <li className="border-b pb-2">
          <strong>Belkharchouche snds</strong> a demandé à rejoindre votre
          équipe en tant que **Designer ui-ux**.
          <div className="mt-2">
            <button className="bg-blue-500 text-white px-2 py-1 rounded-md">
              Accepter
            </button>
            <button className="bg-gray-300 text-black px-2 py-1 rounded-md ml-2">
              Rejeter
            </button>
          </div>
        </li>
        <li className="border-b pb-2">
          <strong>Oualid</strong> a commenté le livrable **Design Assets -
          file**.
          <blockquote className="border-l-4 pl-2 mt-1 text-gray-600">
            "Looks perfect, there's only one thing missing check back-log!"
          </blockquote>
        </li>
        <li className="border-b pb-2">
          <strong>Rappel !</strong> La soumission du rapport final est dans 3
          jours.
          <div className="mt-2">
            <button className="bg-blue-500 text-white px-2 py-1 rounded-md">
              Télécharger pdf
            </button>
          </div>
        </li>
        <li>
          <strong>Soundous</strong> a partagé un fichier avec vous:
          <div className="flex items-center space-x-2 mt-1">
            📄 <span className="text-blue-500">Cahier de charge.pdf</span> (2.2
            MB)
          </div>
        </li>
      </ul> */}
    </>
  );
};

export default Notification;
