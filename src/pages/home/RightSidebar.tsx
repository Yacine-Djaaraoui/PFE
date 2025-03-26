import { useTeams } from "@/hooks/teams";
import { useGetMembers } from "@/hooks/useGetMembers";
import { RootState } from "@/redux/store";
import { group } from "console";
import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { useSelector } from "react-redux";
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
import { useDeleteTeam } from "@/hooks/useDeleteTeam";
import { useCancelRequest } from "@/api/myRequests";
import { useMyRequests } from "@/hooks/useRequests";
import { useNavigate } from "react-router-dom";
const RightSidebar = () => {
  const profile = useSelector((state: RootState) => state.auth.profile);

  const [openGroupe, setOpenGroupe] = useState(false);
  const [openrequests, setopenrequests] = useState(false);
  const { data: teamsData, error: teamsError } = useTeams({
    is_member: true,
    match_student_profile: true,
  });
  const { data: requests, isLoading, error } = useMyRequests();

  const cancelRequest = useCancelRequest();

  // Ensure `teamsData` exists before accessing `results`
  const [teamId, setTeamId] = useState<number | null>(null);

  // Update `teamId` when `teamsData` is available
  useEffect(() => {
    if (teamsData?.results?.length > 0) {
      setTeamId(teamsData.results[0].id);
    }
  }, [teamsData]);
  useEffect(() => {
    console.log("requests", requests);
  }, [requests]);

  // Fetch members only when `teamId` is available
  const { data: membersData, error: membersErr } = useGetMembers(
    { id: teamId! }, // `teamId!` is safe because we check before updating it
    { enabled: !!teamId } // Ensures request runs only when `teamId` exists
  );
  const deleteTeamMutation = useDeleteTeam();

  const handleDelete = (id: string) => {
    deleteTeamMutation.mutate({ id });
  };
  const navigate = useNavigate();
  console.log(profile);
  return (
    <div className="bg-white w-[20%] flex py-5 flex-col items-center gap-4 h-screen    mr-0 ">
      {/* User Info */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex flex-col items-end space-y-0">
          <p className="text-[#0D062D] text-[16px] font-medium">
            {profile?.first_name + " " + profile?.last_name}
          </p>
          <p className="text-[#787486] text-[16px]">Constantine, Algeria</p>
        </div>
        <div className="w-12 h-12 rounded-xl overflow-hidden">
          <img
            src={profile?.profile_picture_url}
            alt="User"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      {teamsData?.results?.length > 0 && (
        <div
          className="flex items-center gap-2 font-medium text-lg underline cursor-pointer "
          onClick={() => setOpenGroupe((prev) => !prev)}
        >
          <FaPen className="text-sm" />
          <h2>Mon groupe</h2>
        </div>
      )}
      {openGroupe && (
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
            <span> {teamsData.results[0]?.created_at.split("T")[0]}</span>
          </div>

          {/* Group Title */}
          <h3 className="font-bold text-md mt-2">
            Groupe N°{teamsData.results[0]?.id}
          </h3>

          {/* Created By */}
          <div className="flex items-center mt-2 gap-2 ">
            <p className="text-gray-600 text-sm">Créer par </p>

            <span className="text-sm font-medium rounded-2xl border px-2 py-1 border-[#E6E4F0]">
              {
                membersData.results?.filter(
                  (member) => member.role === "owner"
                )[0].user?.display_name
              }
            </span>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <p className="text-gray-600 text-sm ">Membres </p>
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
                {teamsData?.results[0]?.has_capacity ? "incomplet" : "complet"}
              </span>
            </div>
          </div>
          {profile?.id === teamsData?.results[0]?.owner.id && (
            <div className="flex items-center justify-around gap-1">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="bg-secondary hover:bg-secondary/90 text-white text-sm mx-auto rounded mt-4  px-2 w-[40%] py-1 text-center cursor-pointer">
                    Supprumer
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle> supprumer un groupe</AlertDialogTitle>
                    <AlertDialogDescription>
                      êtes-vous sûr de suppremer le groupe ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:bg-secondary hover:text-white">
                      Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(teamsData?.results[0]?.id)}
                    >
                      suppremer le groupe
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <button
                disabled={!teamsData?.results[0]?.has_capacity}
                onClick={() => navigate("/students")}
                className={`${
                  teamsData?.results[0]?.has_capacity
                    ? "bg-secondary  hover:bg-secondary/90"
                    : "bg-accent"
                }  text-white text-sm mx-auto rounded mt-4  px-2 w-[40%] py-1 text-center cursor-pointer`}
              >
                Ajouter
              </button>
            </div>
          )}
        </div>
      )}
      {requests?.results?.length > 0 && (
        <div
          className="flex items-center gap-2 font-medium text-lg underline cursor-pointer "
          onClick={() => setopenrequests((prev) => !prev)}
        >
          <FaPen className="text-sm" />
          <h2>Mon requets</h2>
        </div>
      )}
      {openrequests && (
        <ul className="space-y-2">
          {requests?.results?.map((request: any) => (
            <li
              className="bg-white shadow-md rounded-xl p-4 w-[90%] mx-auto border border-[#E6E4F0] flex flex-col items-center "
              key={request.id}
            >
              <p className="text-gray-400 mb-3 ">
                {" "}
                vous avez envoyé une demande d'adhésion à l'équipe{" "}
                <span className="font-bold">{request.team.name} </span>
                numéro <span className="font-bold">{request.team.id}</span>
              </p>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={cancelRequest.isPending}
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded cursor-pointer hover:bg-red-400 "
                  >
                    Annuler le demande
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle> Anuuler le demande</AlertDialogTitle>
                    <AlertDialogDescription>
                      {" "}
                      êtes-vous sûr d'annuler la demande
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:bg-secondary hover:text-white">
                      Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => cancelRequest.mutate(request.id)}
                    >
                      Annuler le demande{" "}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RightSidebar;
