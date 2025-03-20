import { useTeams } from "@/hooks/teams";
import React, { useState } from "react";
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
import { useJoinRequest } from "@/hooks/useJoinRequest";
import { useCreateGroupe } from "@/hooks/useCreateGroupe";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebsocket";

const Teams = () => {
  const { data, error: teamsError } = useTeams({ match_student_profile: true });
  const joinMutation = useJoinRequest();
  const CreateMutation = useCreateGroupe();
  const queryClient = useQueryClient(); // Get the query client instance

  const [message, setMessage] = useState("");
  const [groupeName, setGroupeName] = useState("");
  const [groupeDescription, setGroupeDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleJoinRequest = (teamId: string, message: string) => {
    joinMutation.mutate(
      { teamId, message },
      {
        onSuccess: () => {
          setError(""); // Clear any previous errors
          setSuccess(`Join request sent successfully for Team ${teamId}!`);
        },
        onError: (error) => {
          setError("Failed to send join request. Please try again.");
        },
      }
    );
  };
  const handleCreateGroupe = (name: string, description: string) => {
    CreateMutation.mutate(
      { name, description },
      {
        onSuccess: () => {
          setError(""); // Clear any previous errors
          setSuccess(`crate team successfully`);
          queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
        onError: (error) => {
          setError("Failed to send join request. Please try again.");
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const { messages } = useWebSocket();
  console.log(messages);
  console.log(message);
  return (
    <div className=" h-screen py-10 pl-8 w-fit ">
      <h2 className="text-primaryTitle font-bold text-[20px] font-inter">
        Bienvenue dans l’espace de gestion des équipes !
      </h2>
      <p className="font-medium text-[16px] mt-2 text-[#092147]/55">
        Pour poursuivre votre projet de fin d’études, vous devez faire partie
        d’une équipe.
      </p>
      <p className="bg-[#D9D9D9]/27 text-[15px] text-[#092147]/66 p-5 mt-2 font-inter font-light">
        Attention : Une fois la période de constitution des équipes terminée,
        les équipes seront figées et vous ne pourrez plus en changer sans
        validation de l’administration.
      </p>

      {/* Display errors from the useTeams hook */}
      {teamsError && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>Error fetching teams: {teamsError.message}</p>
        </div>
      )}
      {success && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p> {success}</p>
        </div>
      )}

      {/* Display errors from the join request */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="mt-5 w-full relative">
        <h2 className="font-semibold text-primaryTitle inline">
          Les groupes existants{" "}
        </h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="inline mr-0 text-right right-0 absolute bg-secondary text-white rounded-md font-instrument px-3 py-1 hover:bg-secondary/80">
              Créer un groupe
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle> Créer un groupe</AlertDialogTitle>
              <AlertDialogDescription>
                {/* Une fois inscrit, vous devrez demander à l’administration pour
                changer de groupe. */}
                <label className="font-medium block mt-2 mb-2">
                  Ajouter un nom a l'equipe
                </label>
                <input
                  type="text"
                  value={groupeName}
                  onChange={(e) => setGroupeName(e.target.value)}
                  className="border block border-gray-300 rounded-lg mb-3 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`name of the team`}
                />
                <label className="font-medium block mt-2 mb-2">
                  Ajouter une description a l'equipe
                </label>
                <input
                  type="text"
                  value={groupeDescription}
                  onChange={(e) => setGroupeDescription(e.target.value)}
                  className="border block border-gray-300 rounded-lg mb-3 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`name of the team`}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-secondary hover:text-white">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleCreateGroupe(groupeName, groupeDescription);
                }}
              >
                Créer le groupe
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {data?.results && (
          <div className="grid grid-cols-3 gap-2 p-1 mt-4">
            {[...data.results]
              .sort((a, b) => b.id - a.id)
              .map((group) => (
                <div
                  key={group.id}
                  className="bg-accent/10 font-inter p-4 rounded-lg relative w-full"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] bg-white rounded-xl py-1 px-1 -ml-1">
                      Groupe n°{group.id}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-inter font-medium mt-2">
                    {group.name}
                  </h3>
                  <h3 className="text-[14px] font-inter font-medium mt-2">
                    {group.description}
                  </h3>
                  <div className="flex items-center justify-between mt-3 text-[#5A5A5A] text-xs">
                    {group.has_capacity ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="w-fit font-semibold text-xs bg-secondary text-white rounded-sm font-instrument px-3 py-2 hover:bg-secondary/80">
                            Rejoindre
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Rejoindre ce groupe ?{" "}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Une fois inscrit, vous devrez demander à
                              l’administration pour changer de groupe.
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
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="hover:bg-secondary hover:text-white">
                              Annuler
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                handleJoinRequest(group.id, message);
                              }}
                            >
                              rejoindre le groupe
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <span className="bg-white">🔒</span>
                    )}

                    <p> {group.member_count} membre</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
