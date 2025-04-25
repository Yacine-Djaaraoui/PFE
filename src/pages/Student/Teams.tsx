import { useTeams } from "@/hooks/teams";
import React, { useEffect, useRef, useState } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetMembers } from "@/hooks/useGetMembers";

const Teams = () => {
  const searchResults = useSelector((state: RootState) => state.SearchResult);
  const joinMutation = useJoinRequest();
  const CreateMutation = useCreateGroupe();
  const queryClient = useQueryClient(); // Get the query client instance
  const [nextUrl, setNextUrl] = useState<string>("");
  const [message, setMessage] = useState("");
  const [groupeName, setGroupeName] = useState("");
  const [groupeDescription, setGroupeDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fetchMoreTeams, setFetchMoreTeams] = useState(false);
  const [teams, setTeams] = useState({});
  const isMounted = useRef(true);
  const profile = useSelector((state: RootState) => state.auth.profile);
  const [teamIdForgetMembers, setTeamIdForGetMembers] = useState<number | null>(
    null
  );

  useEffect(() => {
    return () => {
      // Set to false when component unmounts
      isMounted.current = false;
    };
  }, []);
  const {
    data,
    error: teamsError,
    isLoading,
    isFetching,
    isError,
  } = useTeams({
    next_url: fetchMoreTeams && nextUrl ? teams.next : teams.next,
    match_student_profile: true,
    is_member: false,
    ordering: "-created_at",
  });
  const { data: Myteam, error: MyteamsError } = useTeams({
    match_student_profile: true,
    is_member: true,
  });
  useEffect(() => {
    if (searchResults.searchResult) {
      setNextUrl(searchResults.searchResult.next);
      setTeams(searchResults.searchResult);
    }
  }, [searchResults.searchResult]);
  useEffect(() => {
    if (nextUrl) {
      console.log(nextUrl);
      setNextUrl(teams?.next);
      console.log("dfd");
      setTeams((prev) => ({
        ...prev, // Keep all existing state
        status: data.status, // Update status
        count: data.count, // Update total count
        next: data.next, // Update next page URL
        previous: data.previous, // Update previous page URL
        current_page: data.current_page, // Update current page
        total_pages: data.total_pages, // Update total pages
        page_size: data.page_size, // Update page size
        results: [...prev.results, ...data.results], // Append new results to existing ones
      }));
    }
  }, [fetchMoreTeams]);
  useEffect(() => {
    console.log(teams);
  }, [teams]);
  const handleJoinRequest = (teamId: string, message: string) => {
    joinMutation.mutate(
      { teamId, message },
      {
        onSuccess: () => {
          setError(""); // Clear any previous errors
          setSuccess(`Join request sent successfully for Team ${teamId}!`);
        },
        onError: (error) => {
          setError(error?.non_field_errors);
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
          setSuccess(`create team successfully`);
          queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
        onError: (error) => {
          setError(error.name[0]);
        },
      }
    );
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const { data: membersData } = useGetMembers(
    { id: teamIdForgetMembers! },
    { enabled: !!teamIdForgetMembers }
  );
  return (
    <div className=" h-screen py-10 pl-8 w-full  ">
      <h2 className="text-primaryTitle font-bold text-[20px] font-inter">
        Bienvenue dans l’espace de gestion des équipes
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

      <div className="mt-5 w-full relative ">
        <h2 className="font-semibold text-primaryTitle inline">
          Les groupes existants{" "}
        </h2>
        {profile?.user_type === "student" && Myteam?.results?.length === 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="inline cursor-pointer mr-0 text-right right-0 absolute bg-secondary text-white rounded-[3px] font-instrument px-3 py-1 hover:bg-secondary/80">
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
                    Ajouter une description a l'equipe
                  </label>
                  <input
                    type="text"
                    value={groupeDescription}
                    onChange={(e) => setGroupeDescription(e.target.value)}
                    className="border block border-gray-300 rounded-lg mb-3 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`description`}
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="hover:bg-secondary cursor-pointer hover:text-white">
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    handleCreateGroupe("jdfj", groupeDescription);
                  }}
                >
                  Créer le groupe
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {searchResults.searchResultLoading ||
        searchResults.searchResultIsFetching ? (
          <div className="flex justify-center items-center w-full mt-16">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-secondary rounded-full animate-spin"></div>
          </div>
        ) : searchResults.searchResultIsError || isError ? (
          <p className="mx-auto text-2xl text-center w-full mt-16 text-red-300  font-semibold">
            {isError
              ? teamsError.message
              : searchResults.searchResultError.message}
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 p-1 mt-4 w-full">
            {teams?.results?.map((group) => (
              <div
                key={group.id}
                className="bg-accent/10 font-inter p-4 rounded-lg relative w-full"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[12px] bg-white rounded-xl py-1 px-1 -ml-1">
                    Groupe n°{group.id}
                  </span>
                  {!group.has_capacity && <span className="bg-white">🔒</span>}
                </div>
                {/* <h3 className="text-[14px] font-inter font-medium mt-2">
                  {group.name}
                </h3> */}
                <h3 className="text-[14px] font-inter font-medium mt-2">
                  {group.description}
                </h3>
                <div className="flex items-center justify-between mt-3 text-[#5A5A5A] text-xs">
                  {group.has_capacity &&
                  Myteam?.results?.length === 0 &&
                  profile?.user_type === "student" ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className={`w-fit font-semibold text-xs bg-secondary text-white rounded-[3px] font-instrument px-3 py-2 hover:bg-secondary/80`}
                        >
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
                            <textarea
                              type="text"
                              value={message}
                              onChange={handleChange}
                              className="border block w-[300px] border-gray-300 rounded-lg mb-3 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`message`}
                                rows={4}
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
                            Rejoindre le groupe
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    profile?.user_type === "student" && (
                      <button
                        className={`w-fit font-semibold text-xs bg-accent text-white rounded-[3px] font-instrument px-3 py-2`}
                      >
                        Rejoindre
                      </button>
                    )
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        onClick={() => setTeamIdForGetMembers(group.id)}
                        className={`w-fit font-semibold text-xs bg-secondary text-white rounded-[3px] font-instrument px-3 py-2 hover:bg-secondary/80`}
                      >
                        Membres
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
                              <span> {group?.created_at.split("T")[0]}</span>
                            </div>

                            {/* Group Title */}
                            <h3 className="font-bold text-md mt-2">
                              Groupe N°{group?.id}
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
                                  {group?.has_capacity
                                    ? "incomplet"
                                    : "complet"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="hover:bg-secondary hover:text-white">
                          Return
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
        {teams?.next && (
          <div className="flex justify-center items-center w-full">
            <button
              onClick={() => setFetchMoreTeams((prev) => !prev)}
              className="mt-4  cursor-pointer hover:bg-primary/90   bg-primary hover:bg-primarydark  text-white px-8 py-2 rounded-[67px]"
            >
              plus
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
