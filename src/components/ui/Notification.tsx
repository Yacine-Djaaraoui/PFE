import { actionToJoinRequest } from "@/api/actionToJoinRequest";
import {
  useActionToInvitaion,
  useActionToJoinRequest,
  useActionToSupervisionRequest,
} from "@/hooks/useActionToJoinRequest";
import { useWebSocket } from "@/hooks/useWebsocket";
import { RootState } from "@/redux/store";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGetMembers } from "@/hooks/useGetMembers";
import { useTeam } from "@/hooks/teams";
const Notification = () => {
  const { messages, sendMessage, markAsRead } = useWebSocket();
  const [teamIdForgetMembers, setTeamIdForGetMembers] = useState<number | null>(
    null
  );
  const [message, setMessage] = useState("");
  const { data: membersData } = useGetMembers(
    { id: teamIdForgetMembers! },
    { enabled: !!teamIdForgetMembers }
  );
  const { data: Team, error: TeamError } = useTeam(teamIdForgetMembers, {
    enabled: !!teamIdForgetMembers,
  });

  console.log(messages);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const queryClient = useQueryClient(); // Get the query client instance

  const actionToJoinRequest = useActionToJoinRequest();
  const actionToInvitaion = useActionToInvitaion();
  const actionTosupervision = useActionToSupervisionRequest();
  const HandleAction = (
    id: string,
    action: string,
    notification_id: string,
    notification_type: string,
    message?: string
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
    if (notification_type === "theme_supervision_request") {
      actionTosupervision.mutate(
        { id, action, message },
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {/* join requests */}
      <ul className="w-full border-t-[#D0D5DD] border-t ">
        {messages[0]?.notifications?.map((notification) =>
          (notification.type === "team_join_request" ||
            notification.type === "theme_supervision_request" ||
            notification.type === "team_invitation") &&
          notification.status === "unread" ? (
            <div className="flex items-start gap-2">
              <li
                key={notification.id} // Always add a unique key when mapping lists
                className="border-b-[#D0D5DD] relative p-5 w-full border-b text-[#334155] flex-wrap font-normal text-sm  flex items-start justify-between gap-2"
              >
                <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  alt=""
                  className="rounded-full w-9 aspect-square"
                />
                <span className="max-w-[80%]">{notification.content}</span>
                <span className="">
                  {getTimeDifference(notification.created_at)}
                </span>
                <div className="mt-2 w-full">
                  {(notification.type === "theme_supervision_request" ||
                    notification.type === "team_invitation") && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={() =>
                            setTeamIdForGetMembers(
                              notification.metadata.team_id
                            )
                          }
                          className={`w-fit font-semibold text-xs bg-secondary text-white rounded-[3px] font-instrument px-3 py-2 hover:bg-secondary/80`}
                        >
                          Voir Plus
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Les Membres de groupe
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <div className="bg-white shadow-md rounded-xl p-4 w-[90%] mx-auto border border-[#E6E4F0] text-center">
                              {/* Date */}
                              <div className="text-gray-500 text-sm flex items-center gap-2">
                                <svg
                                  className="w-5 h-5 text-gray-400"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M7 11H17M7 15H13M8 3V5M16 3V5M4 7H20M5 21H19C20.1 21 21 20.1 21 19V7C21 5.9 20.1 5 19 5H5C3.9 5 3 5.9 3 7V19C3 20.1 3.9 21 5 21Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <span> {Team?.created_at.split("T")[0]}</span>
                              </div>

                              {/* Group Title */}
                              <h3 className="font-bold text-md mt-2">
                                Groupe N°{Team?.id}
                              </h3>

                              {/* Created By */}
                              <div className="flex items-center mt-2 gap-2 ">
                                <p className="text-gray-600 text-sm">
                                  Créer par{" "}
                                </p>

                                <span className="text-sm font-medium rounded-2xl border px-2 py-1 border-[#E6E4F0]">
                                  {
                                    membersData.results?.filter(
                                      (member) => member.role === "owner"
                                    )[0]?.user?.display_name
                                  }
                                </span>
                              </div>
                              <div className="flex items-start gap-2 mt-2">
                                <p className="text-gray-600 text-sm ">
                                  Membres{" "}
                                </p>
                                <div className="flex flex-wrap gap-2 ">
                                  {membersData.results?.map((member, index) => (
                                    <span
                                      key={index}
                                      className=" text-sm px-2 py-1 rounded-full border border-[#E6E4F0]"
                                    >
                                      {/* <img
                                           src={member.avatar}
                                           alt={member.name}
                                           className="w-6 h-6 rounded-full"
                                           /> */}
                                      {member.user.display_name}
                                    </span>
                                  ))}
                                  {/* <button className="w-6 h-6 flex items-center justify-center border rounded-full text-gray-500 hover:bg-gray-200">
                                       +
                                       </button> */}
                                </div>
                              </div>

                              {/* Status */}
                              <div className="flex items-center gap-7  mt-3">
                                <p className="text-gray-600 text-sm">Status </p>
                                <div className="flex items-center gap-2">
                                  <span className="w-3 h-3 bg-secondary rounded-full"></span>
                                  <span className="text-sm">
                                    {Team?.has_capacity
                                      ? "incomplet"
                                      : "complet"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {notification.type ===
                              "theme_supervision_request" && (
                              <>
                                <label className="font-medium block mt-2 mb-2">
                                  Ajouter un message a l'equipe
                                </label>
                                <input
                                  type="text"
                                  value={message}
                                  onChange={handleChange}
                                  className="border block border-gray-300 rounded-lg mb-3 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder={`message`}
                                />
                              </>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction
                            onClick={() =>
                              HandleAction(
                                notification.type === "team_join_request"
                                  ? notification.metadata.join_request_id
                                  : notification.type ===
                                    "theme_supervision_request"
                                  ? notification.metadata.request_id
                                  : notification.metadata.invitation_id,
                                "accept",
                                notification.id,
                                notification.type,
                                message
                              )
                            }
                            className="bg-secondary cursor-pointer hover:bg-secondary/85 text-white px-3 py-1 rounded"
                          >
                            Accepter
                          </AlertDialogAction>
                          <AlertDialogCancel
                            onClick={() =>
                              HandleAction(
                                notification.type === "team_join_request"
                                  ? notification.metadata.join_request_id
                                  : notification.type ===
                                    "theme_supervision_request"
                                  ? notification.metadata.request_id
                                  : notification.metadata.invitation_id,
                                "decline",
                                notification.id,
                                notification.type
                              )
                            }
                            className=" border-[#D0D5DD] border bg-white cursor-pointer text-[#475569] px-3 py-1 rounded ml-2"
                          >
                            Rejeter
                          </AlertDialogCancel>
                          <AlertDialogCancel className="hover:bg-secondary hover:text-white">
                            Return
                          </AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {!(
                    notification.type === "theme_supervision_request" ||
                    notification.type === "team_invitation"
                  ) && (
                    <button
                      onClick={() =>
                        HandleAction(
                          notification.type === "team_join_request"
                            ? notification.metadata.join_request_id
                            : notification.type === "theme_supervision_request"
                            ? notification.metadata.request_id
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
                  )}
                  {!(
                    notification.type === "theme_supervision_request" ||
                    notification.type === "team_invitation"
                  ) && (
                    <button
                      onClick={() =>
                        HandleAction(
                          notification.type === "team_join_request"
                            ? notification.metadata.join_request_id
                            : notification.type === "theme_supervision_request"
                            ? notification.metadata.request_id
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
                  )}
                </div>
              </li>
            </div>
          ) : (
            <li
              key={notification.id} // Always add a unique key when mapping lists
              className="border-b-[#D0D5DD] relative p-5 w-full border-b text-[#334155] flex-wrap font-normal text-sm  flex items-start justify-between gap-2"
            >
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                alt=""
                className="rounded-full aspect-square w-8"
              />
              <span className="max-w-[80%] text-sm">
                {notification.content}
              </span>
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
