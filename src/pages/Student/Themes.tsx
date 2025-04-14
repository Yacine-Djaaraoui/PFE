import { useState, useEffect, useRef } from "react";
import { useThemes } from "@/hooks/themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ThemeDetailsDialog = ({ 
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
                <p className="text-[16px] font-semibold">{theme.proposed_by}</p>
              </div>
  
              <div className="text-gray-700 font-medium text-sm">
                <p className="font-semibold pb-2">Spécialité</p>
                <p className="break-words">{theme.specialty}</p>
              </div>
            </div>
  
            <div className="mt-4 flex items-start ">
              <h3 className="text-sm text-[#46494C] font-semibold pr-4">
                Résumé
              </h3>
              <div className="pl-4 font-medium max-w-[85%] ">
                <p className="font-semibold text-sm">Titre complet: </p>
                <p className="text-xs break-words whitespace-pre-wrap ">{theme.title}</p>
                <br />
                <p className="font-semibold text-sm">Description: </p>
                <p className="text-xs break-words whitespace-pre-wrap ">{theme.description}</p>
              </div>
            </div>
  
            <div className="mt-8 flex items-start">
              <h3 className="text-sm text-[#46494C] font-semibold pr-7.5">
                Outils
              </h3>
              <div className="pl-4 font-medium text-xs break-words whitespace-pre-wrap  max-w-[85%] ">
                {theme.tools}
              </div>
            </div>
          </div>
  
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline" className="flex items-center">
              <span className="mr-2">📤</span> Partager
            </Button>
            <Button variant="default" className="flex items-center">
              <span className="mr-2">📥</span> Télécharger
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  

const Themes = () => {
  const [fetchMoreThemes, setFetchMoreThemes] = useState(false);
  const [nextUrl, setNextUrl] = useState<string>("");
  const [themes, setThemes] = useState({});
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const { data, isLoading, error, isFetching } = useThemes({
    next_url: fetchMoreThemes && nextUrl ? themes.next : themes.next,
    ordering: "created_at",
  });

  useEffect(() => {
    if (data && !fetchMoreThemes) {
      setThemes(data);
      setNextUrl(data.next);
    }
  }, [data]);

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

  return (
    <div className="h-screen py-10 pl-8 w-fit">
      {/* Static Header Section */}
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

        <div className="mt-5 w-full relative">
          <h2 className="font-semibold text-primaryTitle inline">
            Liste des thèmes disponibles
          </h2>
        </div>
      </div>

      {/* Dynamic Themes Section */}
      <div className="flex flex-col min-h-[calc(100vh-250px)]">
        {isLoading && !fetchMoreThemes ? (
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
              {themes?.results?.map((theme) => (
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
                    {theme.description.substring(0, 20) + "..."}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Encadrant: {theme?.proposed_by}
                  </p>

                  <div className="flex items-center justify-between mt-3 text-[#5A5A5A] text-xs">
                    <div className="flex items-center">
                      {/* Optional: Add document count or other info */}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-secondary text-white px-4 py-1.5 rounded-sm text-xs"
                      onClick={() => handleOpenDialog(theme)}
                    >
                      Voir plus
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Theme Details Dialog */}
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
