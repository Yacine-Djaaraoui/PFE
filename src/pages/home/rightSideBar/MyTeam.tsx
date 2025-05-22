import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaPen, FaPencilAlt } from "react-icons/fa";
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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTeams } from "@/hooks/teams";
import { useGetMembers } from "@/hooks/useGetMembers";
import { NavLink, useNavigate } from "react-router-dom";
import { useDeleteTeam } from "@/hooks/useDeleteTeam";
import { ReactSVG } from "react-svg";
import editSquare from "@/assets/Edit-Square.svg";
import { Button } from "@/components/ui/button";

const MyTeam = () => {
  const profile = useSelector((state: RootState) => state.auth.profile);
  const [openGroupe, setOpenGroupe] = useState(false);
  const [teamId, setTeamId] = useState<number | null>(null);

  const { data: teamsData } = useTeams({
    is_member: true,
    match_student_profile: true,
  });
  useEffect(() => {
    if (teamsData?.results?.length > 0) {
      setTeamId(teamsData.results[0].id);
    }
  }, [teamsData]);
  const { data: membersData } = useGetMembers(
    { id: teamId! },
    { enabled: !!teamId }
  );
  const deleteTeamMutation = useDeleteTeam();
  const handleDelete = (id: string) => {
    deleteTeamMutation.mutate({ id });
    setOpenGroupe(false);
  };
  const navigate = useNavigate();

  return (
    <>
      {teamsData?.results?.length > 0 && (
        <div className="flex cursor-pointer justify-between items-start w-full px-4 mb-1">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setOpenGroupe((prev) => !prev)}
          >
            <ReactSVG src={editSquare} className="w-5 h-5" />
            <h2 className="text-[16px] font-medium text-[#092147] border-b border-black">
              Mon groupe
            </h2>
            {openGroupe ? (
              <FaChevronUp className="text-gray-600 text-sm" />
            ) : (
              <FaChevronDown className="text-gray-600 text-sm" />
            )}
            {/* Chevron icon that rotates based on state */}
          </div>
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
          <h3 className="font-semibold text-left ml-0 mr-auto text-gray-600 text-md mt-2">
            Groupe N°{teamsData.results[0]?.id}
          </h3>

          {/* Created By */}
          <div className="flex items-center mt-2 gap-2 ">
            <p className="text-gray-600 text-sm">Créer par </p>
            <NavLink
              to={`/profile/${
                membersData.results?.filter(
                  (member) => member.role === "owner"
                )[0].id
              }`}
              className={`w-fit`}
            >
              <span className="text-sm font-medium rounded-2xl border px-2 py-1 border-[#E6E4F0] hover:bg-secondary hover:text-white">
                {
                  membersData.results?.filter(
                    (member) => member.role === "owner"
                  )[0].user?.display_name
                }
              </span>
            </NavLink>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <p className="text-gray-600 text-sm ">Membres </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {membersData.results?.map((member, index) => (
                <NavLink to={`/profile/${member?.id}`} className={`w-fit`}>
                  <span
                    key={index}
                    className=" text-sm px-2 py-1 rounded-full border border-[#E6E4F0] hover:bg-secondary hover:text-white"
                  >
                    {/* <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-6 h-6 rounded-full"
                  /> */}
                    {member.user.display_name}
                  </span>
                </NavLink>
              ))}
              {/* <button className="w-6 h-6 flex items-center justify-center border rounded-full text-gray-500 hover:bg-gray-200">
              +
              </button> */}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-8  mt-1">
            <p className="text-gray-600 text-sm">Status </p>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-secondary rounded-full"></span>
              <span className="text-sm">
                {teamsData?.results[0]?.has_capacity ? "incomplet" : "complet"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-12  mt-3">
            <p className="text-gray-600 text-sm">Year </p>
            <span className="text-sm">
              {teamsData?.results[0]?.academic_year}
            </span>
          </div>
          {profile?.id === teamsData?.results[0]?.owner.id && (
            <div className="flex items-center justify-start gap-16  mt-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg- w-[35%] text-white bg-secondary px-4 py-1.5 rounded-sm text-xs">
                    Supprimer
                  </Button>
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
              <Button
                disabled={!teamsData?.results[0]?.has_capacity}
                onClick={() => navigate("/students")}
                className={`${
                  teamsData?.results[0]?.has_capacity
                    ? "bg-secondary  hover:bg-secondary/90"
                    : "bg-accent"
                }  bg-secondary w-[35%] text-white px-4 py-1.5 rounded-sm text-xs`}
              >
                Ajouter
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MyTeam;
