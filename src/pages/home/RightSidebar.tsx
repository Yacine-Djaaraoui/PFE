import { useTeams } from "@/hooks/teams";
import { useGetMembers } from "@/hooks/useGetMembers";
import { group } from "console";
import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";

const RightSidebar = () => {
  const [openGroupe, setOpenGroupe] = useState(false);
  const { data: teamsData, error: teamsError } = useTeams({
    is_member: true,
    match_student_profile: true,
  });

  // Ensure `teamsData` exists before accessing `results`
  const [teamId, setTeamId] = useState<number | null>(null);

  // Update `teamId` when `teamsData` is available
  useEffect(() => {
    if (teamsData?.results?.length > 0) {
      setTeamId(teamsData.results[0].id);
    }
  }, [teamsData]);

  // Fetch members only when `teamId` is available
  const { data: membersData, error: membersErr } = useGetMembers(
    { id: teamId! }, // `teamId!` is safe because we check before updating it
    { enabled: !!teamId } // Ensures request runs only when `teamId` exists
  );

  return (
    <div className="bg-white w-[20%] flex py-5 flex-col items-center gap-4 h-screen   mr-0 ">
      <div
        className="flex items-center gap-2 font-medium text-lg underline cursor-pointer "
        onClick={() => setOpenGroupe(true)}
      >
        <FaPen className="" />
        <h2>Mon groupe</h2>
      </div>
      {openGroupe && (
        <div className="bg-white shadow-md rounded-xl p-4 w-[90%] mx-auto border border-accent">
          {/* Date */}
          <div className="text-gray-500 text-sm flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
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
          <h3 className="font-semibold text-lg mt-2">
            Groupe N°{teamsData.results[0]?.id}
          </h3>

          {/* Created By */}
          <p className="text-gray-600 text-sm mt-2">Créer par :</p>
          <div className="flex items-center gap-2 mt-1">
            {/* <img
              src={group.createdBy.avatar}
              alt={group.createdBy.name}
              className="w-8 h-8 rounded-full"
            /> */}
            <span className="text-sm font-medium">
              {teamsData.results[0]?.owner.username}
            </span>
          </div>

          {/* Members */}
          <p className="text-gray-600 text-sm mt-2">Membres :</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {membersData.results?.map((member, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full border"
              >
                {/* <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-6 h-6 rounded-full"
                /> */}
                <span className="text-sm">{member.user.username}</span>
              </div>
            ))}
            {/* <button className="w-6 h-6 flex items-center justify-center border rounded-full text-gray-500 hover:bg-gray-200">
              +
            </button> */}
          </div>

          {/* Status */}
          <p className="text-gray-600 text-sm mt-3">Status :</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
            <span className="text-sm">
              {teamsData.results[0]?.has_capacity ? "incomplet" : "complet"}
            </span>
          </div>

          {/* Tags */}
          {/* <div className="flex gap-2 mt-3">
            {group.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 text-sm font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div> */}
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
