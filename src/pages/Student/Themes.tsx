import { useState, useEffect, useRef } from "react";
import { useThemes } from "@/hooks/themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Filter, ChevronDown } from "lucide-react";
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
import { useSupervisorRequest } from "@/hooks/useSupervisorRequest";
import { useTeams } from "@/hooks/teams";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const ThemeDetailsDialog = ({
  isOpen,
  onOpenChange,
  theme,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  theme: any;
}) => {
  if (!theme) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-2/5 px-8 py-11 rounded-2xl border-none overflow-y-auto max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-left">
            Fiche de présentation du thème
          </DialogTitle>
        </DialogHeader>

        <div className=" border border-gray-200 rounded-2xl p-4">
          <div className="flex justify-between items-start border-b border-gray-200 pb-2">
            <div>
              <p className="text-[16px] font-semibold pb-2">
                {theme.proposed_by?.first_name +
                  " " +
                  theme.proposed_by?.last_name}
              </p>
              <div className="ml-2 text-[12px]">
                {theme?.co_supervisors?.length > 0 && (
                  <div className="">
                    {theme.co_supervisors.map(
                      (supervisor: any, index: number) => (
                        <p key={index} className="truncate">
                          {supervisor.first_name} {supervisor.last_name}
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="text-gray-700 font-medium text-sm">
              <p className="font-semibold pb-2">Année Académique</p>
              <p className="break-words">{theme?.academic_year}</p>
            </div>
          </div>

          <div className="mt-4 flex items-start ">
            <h3 className="text-sm text-[#46494C] font-semibold pr-4">
              Résumé
            </h3>
            <div className="pl-4 font-medium max-w-[85%] ">
              <p className="font-semibold text-sm">Titre complet: </p>
              <p className="text-xs break-words whitespace-pre-wrap ">
                {theme.title}
              </p>
              <br />
              <p className="font-semibold text-sm">Description: </p>
              <p className="text-xs break-words whitespace-pre-wrap ">
                {theme.description}
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-start border-b border-gray-200 pb-4">
            <h3 className="text-sm text-[#46494C] font-semibold pr-7.5 ">
              Outils
            </h3>
            <div className="pl-4 font-medium text-xs break-words whitespace-pre-wrap max-w-[85%]">
              {theme.tools}
            </div>
          </div>

          {theme.documents && theme.documents.length > 0 && (
            <div className="mt-4 flex items-start">
              <h3 className="text-sm text-[#46494C] font-semibold pr-7.5">
                Documents
              </h3>
              <div className="pl-4 font-medium text-xs break-words max-w-[85%]">
                <ul className="space-y-2">
                  {theme.documents.map((doc: any) => (
                    <li key={doc.id} className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-600" />
                      <a
                        href={doc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {doc.title || `Document ${doc.id}`}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Themes = () => {
  const searchResults = useSelector((state: RootState) => state.SearchResult);
  const [fetchMoreThemes, setFetchMoreThemes] = useState(false);
  const [nextUrl, setNextUrl] = useState("");
  const [themes, setThemes] = useState({});
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [teamId, setTeamId] = useState();
  const isMounted = useRef(true);
  const joinMutation = useSupervisorRequest();
  const [demanderror, setError] = useState("");
  const [success, setSuccess] = useState("");
  const currentUser = useSelector((state: RootState) => state.auth.profile);
  const { data: teamsData } = useTeams({
    is_member: true,
    is_owner: true,
    match_student_profile: true,
  });

  // Filter states
  const [activeFilter, setActiveFilter] = useState("all");
  const [academicYearFilter, setAcademicYearFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const { data, isLoading, error, isFetching } = useThemes({
    next_url: fetchMoreThemes && nextUrl ? themes?.next : themes?.next,
    ordering: "created_at",
    academic_year: academicYearFilter || undefined,
     proposed_by:
      activeFilter === "proposed_by_me" ? currentUser?.id : undefined,
    co_supervised_by:
      activeFilter === "co_supervised_by_me" ? currentUser?.id : undefined,
    is_verified: true,
  });

  useEffect(() => {
    if (teamsData?.results?.length > 0) {
      setTeamId(teamsData.results[0].id);
    }
  }, [teamsData]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if ((searchResults.searchResult || data) && !fetchMoreThemes) {
      if (searchResults.searchTerm !== "") {
        setThemes(searchResults.searchResult);
        setNextUrl(searchResults.searchResult?.next || "");
      } else {
        setThemes(data);
        setNextUrl(data?.next || "");
      }
    }
  }, [searchResults.searchResult, data]);
  useEffect(() => {}, [searchResults.searchResult, data]);

  useEffect(() => {
    if (nextUrl && fetchMoreThemes) {
      setNextUrl(themes?.next);
      setThemes((prev) => ({
        ...prev,
        status: data.status,
        count: data.count,
        next: data.next,
        previous: data.previous,
        current_page: data.current_page,
        total_pages: data.total_pages,
        page_size: data.page_size,
        results: [...prev.results, ...data.results],
      }));
    }
  }, [fetchMoreThemes]);

  const loadMoreThemes = () => {
    if (themes?.next) {
      setFetchMoreThemes((prev) => !prev);
    }
  };

  const handleOpenDialog = (theme) => {
    setSelectedTheme(theme);
    setIsDialogOpen(true);
  };

  const handleJoinRequest = (
    teamId: string,
    message: string,
    themeId: string
  ) => {
    joinMutation.mutate(
      { teamId, message, themeId },
      {
        onSuccess: () => {
          setError("");
          setSuccess("Supervisor request sent successfully");
        },
        onError: (error) => {
          setError(error?.error);
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setAcademicYearFilter("");
    setShowFilterDropdown(false);
  };

  const handleAcademicYearChange = (year: string) => {
    setAcademicYearFilter(year);
    setActiveFilter("all");
    setShowFilterDropdown(false);
  };

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  return (
    <div className="h-screen py-10 pl-8 w-fit">
      <div>
        <h2 className="text-primaryTitle font-bold text-[20px] font-inter">
          Bienvenue dans l'espace de choix des thèmes de PFE !
        </h2>
        <p className="font-medium text-[16px] mt-2 text-[#092147]/55">
          Vous devez consulter les thèmes proposés par les enseignants et les
          partenaires de l'école, puis soumettre votre fiche de vœux en classant
          vos préférences.
        </p>
        <p className="bg-[#D9D9D9]/27 text-[15px] text-[#092147]/66 p-5 mt-2 font-inter font-light">
          Attention :️ Une fois votre fiche de vœux soumise, vous ne pourrez
          plus la modifier sans validation de l'administration.
        </p>

        <div className="mt-5 w-full relative flex justify-between items-center">
          <h2 className="font-semibold text-primaryTitle">
            Liste des thèmes disponibles
          </h2>
          {currentUser?.user_type !== "student" && (
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={toggleFilterDropdown}
                >
                  <Filter size={16} />
                  Filtres
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showFilterDropdown ? "rotate-180" : ""
                    }`}
                  />
                </Button>
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="p-2">
                      <h3 className="text-sm font-medium text-gray-700 px-2 py-1 border-b border-gray-200">
                        Type de thème
                      </h3>
                      <div className="space-y-1 mt-2">
                        <button
                          onClick={() => handleFilterChange("all")}
                          className={`block w-full text-left px-3 py-2 text-sm rounded ${
                            activeFilter === "all"
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Tous les thèmes
                        </button>
                        <button
                          onClick={() => handleFilterChange("proposed_by_me")}
                          className={`block w-full text-left px-3 py-2 text-sm rounded ${
                            activeFilter === "proposed_by_me"
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Proposés par moi
                        </button>
                        <button
                          onClick={() =>
                            handleFilterChange("co_supervised_by_me")
                          }
                          className={`block w-full text-left px-3 py-2 text-sm rounded ${
                            activeFilter === "co_supervised_by_me"
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Co-encadrés par moi
                        </button>
                      </div>

                      <h3 className="text-sm font-medium text-gray-700 px-2 py-1 mt-3 border-b border-gray-200">
                        Année académique
                      </h3>
                      <div className="grid grid-cols-2 gap-1 mt-2">
                        {[
                          "2",
                          "3",
                          "4isi",
                          "4siw",
                          "4iasd",
                          "5siw",
                          "5isi",
                          "5iasd",
                        ].map((year) => (
                          <button
                            key={year}
                            onClick={() => handleAcademicYearChange(year)}
                            className={`px-2 py-1.5 text-xs rounded ${
                              academicYearFilter === year
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {year === "2" && "2ème année"}
                            {year === "3" && "3ème année"}
                            {year === "4isi" && "4ISI"}
                            {year === "4siw" && "4SIW"}
                            {year === "4iasd" && "4IASD"}
                            {year === "5siw" && "5SIW"}
                            {year === "5isi" && "5ISI"}
                            {year === "5iasd" && "5IASD"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {(activeFilter !== "all" || academicYearFilter) && (
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md">
                  Filtre actif:{" "}
                  <span className="font-medium">
                    {activeFilter === "proposed_by_me" && "Proposés par moi"}
                    {activeFilter === "co_supervised_by_me" &&
                      "Co-encadrés par moi"}
                    {academicYearFilter && (
                      <>
                        {activeFilter !== "all" && " + "}
                        {academicYearFilter === "2" && "2ème année"}
                        {academicYearFilter === "3" && "3ème année"}
                        {academicYearFilter === "4isi" && "4ISI"}
                        {academicYearFilter === "4siw" && "4SIW"}
                        {academicYearFilter === "4iasd" && "4IASD"}
                        {academicYearFilter === "5siw" && "5SIW"}
                        {academicYearFilter === "5isi" && "5ISI"}
                        {academicYearFilter === "5iasd" && "5IASD"}
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {success && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p> {success}</p>
        </div>
      )}

      {demanderror && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{demanderror}</p>
        </div>
      )}

      <div className="flex flex-col min-h-[calc(100vh-250px)]">
        {isLoading ||
        ((searchResults.searchResultLoading ||
          searchResults.searchResultIsFetching) &&
          !fetchMoreThemes) ? (
          <div className="grid grid-cols-3 gap-4 p-1 mt-4 w-full">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="bg-accent/10 font-inter p-4 rounded-lg relative w-full shadow-md animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 ml-auto mt-3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 border border-red-200 bg-red-50 rounded-md">
            Error loading themes. Please try again later.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 p-1 mt-4 w-full">
              {themes?.results
                ?.filter((theme1) =>
                  data?.results?.some((theme2) => theme2.id === theme1.id)
                )
                .map((theme) => (
                  <div
                    key={theme?.id}
                    className="bg-accent/10 font-inter p-4 rounded-lg relative w-full shadow-md"
                  >
                    <div className="flex justify-start items-center">
                      <p className="text-[14px] bg-white rounded-xl py-1 px-2 -ml-1">
                        Théme n°{theme?.id}
                      </p>
                    </div>
                    <h3 className="text-[14px] font-inter font-bold my-2">
                      {theme.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Encadrant: {theme?.proposed_by?.first_name}
                    </p>

                    <div className="flex items-center justify-between mt-3 text-[#5A5A5A] text-xs">
                      <div className="flex items-center">
                        {theme.documents && theme.documents.length > 0 && (
                          <div className="flex items-center text-gray-500">
                            <FileText className="h-4 w-4 mr-1" />
                            <span>{theme.documents.length}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-secondary text-white px-4 py-1.5 rounded-sm text-xs"
                          onClick={() => handleOpenDialog(theme)}
                        >
                          Voir plus
                        </Button>
                        {teamId && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="bg-secondary text-white px-4 py-1.5 rounded-sm text-xs"
                              >
                                Demander
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Demander ce encadrant ?{" "}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Une fois inscrit, vous devrez demander à
                                  l'administration pour changer de groupe.
                                  <label className="font-medium block mt-2 mb-2">
                                    Ajouter un message a l'encadrant
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
                                    handleJoinRequest(
                                      teamId,
                                      message,
                                      theme.id
                                    );
                                  }}
                                >
                                  Demander
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <ThemeDetailsDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              theme={selectedTheme}
            />

            {isFetching && fetchMoreThemes && (
              <div className="flex justify-center items-center w-full mt-4">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-secondary rounded-full animate-spin"></div>
              </div>
            )}

            {themes?.next && (
              <div className="flex justify-center items-center w-full mt-4">
                <button
                  onClick={loadMoreThemes}
                  className="mt-4 cursor-pointer hover:bg-primary/90 bg-primary hover:bg-primarydark text-white px-8 py-2 rounded-[67px]"
                >
                  Plus
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Themes;
