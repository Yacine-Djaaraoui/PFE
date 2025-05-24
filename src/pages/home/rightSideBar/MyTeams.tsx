import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTeams } from "@/hooks/teams";
import { useGetMembers } from "@/hooks/useGetMembers";
import { NavLink } from "react-router-dom";
import { ReactSVG } from "react-svg";
import editSquare from "@/assets/Edit-Square.svg";

const MyTeams = () => {
  const [showTeams, setShowTeams] = useState(false);
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);
  const { data: teamsData } = useTeams({ is_supervisor: true });

  const toggleTeams = () => {
    setShowTeams((prev) => !prev);
    if (showTeams) {
      setExpandedTeam(null);
    }
  };

  const toggleTeam = (teamId: number) => {
    setExpandedTeam((prev) => (prev === teamId ? null : teamId));
  };

  return (
    <div className="w-full ">
      {teamsData?.results?.length > 0 && (
        <div className="flex justify-between items-start w-full px-4 mb-3">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={toggleTeams}
          >
            <ReactSVG src={editSquare} className="w-5 h-5" />
            <h2 className="text-[16px] font-medium text-[#092147] border-b border-black">
              Mes groupes
            </h2>
            {showTeams ? (
              <FaChevronUp className="text-gray-600 text-sm" />
            ) : (
              <FaChevronDown className="text-gray-600 text-sm" />
            )}
          </div>
        </div>
      )}

      {showTeams && (
        <div className="space-y-3 pl-6">
          {teamsData?.results?.map((team) => (
            <div key={team.id} className="w-full">
              <div
                className="flex cursor-pointer justify-between items-center w-full px-3 py-1.5 bg-gray-100 rounded-lg"
                onClick={() => toggleTeam(team.id)}
              >
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-700 text-sm">
                    Groupe N°{team.id}
                  </h3>
                </div>
                {expandedTeam === team.id ? (
                  <FaChevronUp className="text-gray-600 text-xs" />
                ) : (
                  <FaChevronDown className="text-gray-600 text-xs" />
                )}
              </div>

              {expandedTeam === team.id && (
                <div className="ml-2 mt-1">
                  <TeamDetails team={team} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TeamDetails = ({ team }: { team: any }) => {
  const { data: membersData } = useGetMembers(
    { id: team.id },
    { enabled: true }
  );

  return (
    <div className="bg-white shadow-md rounded-xl p-4 w-full mx-auto border border-[#E6E4F0] text-center">
      {/* Date */}
      <div className="text-gray-500 text-sm flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 11H17M7 15H13M8 3V5M16 3V5M4 7H20M5 21H19C20.1 21 21 20.1 21 19V7C21 5.9 20.1 5 19 5H5C3.9 5 3 5.9 3 7V19C3 20.1 3.9 21 5 21Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span> {team?.created_at.split("T")[0]}</span>
      </div>

      {/* Created By */}
      <div className="flex items-center mt-2 gap-2 ">
        <p className="text-gray-600 text-sm">Créer par </p>
        <NavLink
          to={`/profile/${
            membersData.results?.filter((member) => member.role === "owner")[0]
              .user?.id
          }`}
          className={`w-fit`}
        >
          <span className="text-sm font-medium rounded-2xl border px-2 py-1 border-[#E6E4F0] hover:bg-secondary hover:text-white">
            {membersData.results?.filter((member) => member.role === "owner")[0]
              .user?.first_name +
              " " +
              membersData.results?.filter(
                (member) => member.role === "owner"
              )[0].user?.last_name}
          </span>
        </NavLink>
      </div>

      {/* Members */}
      <div className="flex items-start gap-2 mt-2">
        <p className="text-gray-600 text-sm ">Membres </p>
        <div className="flex flex-wrap gap-2 mb-2 text-left">
          {membersData.results?.map((member, index) => (
            <NavLink to={`/profile/${member?.user?.id}`} className={`w-fit`}>
              <span
                key={index}
                className=" text-sm px-2 py-1 rounded-full border border-[#E6E4F0] hover:bg-secondary hover:text-white text-left"
              >
                {/* <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-6 h-6 rounded-full"
                        /> */}
                {member.user.first_name + " " + member.user.last_name}
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
            {team?.has_capacity ? "incomplet" : "complet"}
          </span>
        </div>
      </div>

      {/* Academic Year */}
      <div className="flex items-center gap-12  mt-3">
        <p className="text-gray-600 text-sm">Year </p>
        <span className="text-sm">{team?.academic_year}</span>
      </div>
    </div>
  );
};

export default MyTeams;
