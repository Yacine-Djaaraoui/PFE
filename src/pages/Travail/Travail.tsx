import Wrapper from "@/hoc/Wrapper";
import React, { useState } from "react";
import Meetings from "./Meetings";
import Livrables from "./Livrables";
import { useTeams } from "@/hooks/teams";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Travail = () => {
  const profile = useSelector((state: RootState) => state.auth.profile);
  const userType = profile?.user_type;
  const { data } = useTeams({
    is_member: true,
  });
  const teamId = data?.results[0]?.id;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Fetch teams where the user is supervisor
  const { data: teamsData } = useTeams({ is_supervisor: true });

  return (
    <div className="h-screen py-10 pl-8 w-full">
      <h2 className="text-primaryTitle font-bold text-[20px] font-inter">
        Bienvenue dans l'espace de gestion du projet !
      </h2>
      <p className="font-medium text-[16px] mt-2 text-[#092147]/55">
        Suivez vos tâches, déposez vos livrables et collaborez avec votre équipe
        et votre encadrant pour mener à bien votre projet.
      </p>
      <p className="bg-[#D9D9D9]/27 text-[15px] text-[#092147]/66 p-5 mt-2 font-inter font-light">
        Attention : Une fois la période de constitution des équipes terminée,
        les équipes seront figées et vous ne pourrez plus en changer sans
        validation de l'administration.
      </p>

      {/* Team Selection Dropdown */}

      {userType !== "student" ? (
        <div>
          <div className="relative mt-12 w-64">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-white text-left bg-secondary border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19488E]"
            >
              <span>
                {selectedTeam ? selectedTeam.name : "Sélectionner une équipe"}
              </span>
              <svg
                className={`w-5 h-5 transition-transform ${
                  isOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {teamsData?.results?.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => {
                      setSelectedTeam({ id: team.id, name: team.name });
                      setIsOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left ${
                      selectedTeam?.id === team.id
                        ? "bg-[#19488E] text-white"
                        : ""
                    }`}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Only show Meetings and Livrables if a team is selected */}
          {selectedTeam && (
            <>
              <Meetings teamId={selectedTeam.id} />
              <Livrables teamId={selectedTeam.id} />
            </>
          )}
          {/* Show message if no team is selected */}
          {!selectedTeam && (
            <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg">
              Veuillez sélectionner une équipe pour voir les réunions et les
              livrables.
            </div>
          )}{" "}
        </div>
      ) : (
        <div>
          <Meetings teamId={teamId} />
          <Livrables teamId={teamId} />
        </div>
      )}
    </div>
  );
};

export default Wrapper(Travail);
