import React, { useState, useRef } from "react";
import {
  FileText,
  Image,
  Download,
  MessageCircle,
  Send,
  X,
  Upload,
  Trash2,
} from "lucide-react";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUploads,
  getUploadDetails,
  createUpload,
  deleteUpload,
  addCommentToUpload,
} from "@/api/uploads";
import {
  useDocuments,
  useCreateDocument,
  useDeleteDocument,
} from "@/hooks/document";
import { useUploads, useUploadDetails } from "@/hooks/uploads";
import { toast } from "react-toastify";
import { createDocument } from "@/api/document";
import { useTeams } from "@/hooks/teams";

const Livrables = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedUpload, setSelectedUpload] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const {
      data,
    } = useTeams({
      is_member : true ,
    });

    const teamId = data?.results[0]?.id ;

  // Fetch documents and uploads
  const { data: uploads, isLoading: isLoadingUploads } = useUploads();
  const { data: uploadDetails, refetch: refetchUploadDetails } = useUploadDetails(
    selectedUpload?.id
  );



  // Mutations

  const deleteDocumentMutation = useDeleteDocument();
 // Create Upload Mutation
 const createUploadMutation = useMutation({
    mutationFn: (data: { team: number; title: string; url: string; description?: string }) => 
      createUpload(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["uploads"]);
      toast.success("Livrable ajouté avec succès");
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de l'ajout du livrable");
      console.error("Error creating upload:", error);
    }
  });

  // Delete Upload Mutation
  const deleteUploadMutation = useMutation({
    mutationFn: (id: number) => deleteUpload(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(["uploads"]);
      toast.success("Livrable supprimé avec succès");
      if (selectedUpload?.id === id) {
        setSelectedUpload(null);
      }
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la suppression du livrable");
      console.error("Error deleting upload:", error);
    }
  });

  // Add Comment Mutation
  const addCommentMutation = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) => 
      addCommentToUpload(id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(["upload", selectedUpload?.id]);
      setNewComment("");
      toast.success("Commentaire ajouté");
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de l'ajout du commentaire");
      console.error("Error adding comment:", error);
    }
  });

  // Document Mutations (if needed)
  const createDocumentMutation = useMutation({
    mutationFn: (formData: FormData) => createDocument(formData),
    onError: (error: Error) => {
      toast.error("Erreur lors de l'upload du document");
      console.error("Error uploading document:", error);
    }
  });

  

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      const file = e.target.files[0];

      try {
        // First upload the document
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", file.name);
        formData.append("document_type", "technical_sheet");

        const documentResponse = await createDocumentMutation.mutateAsync(formData);
        const documentUrl = documentResponse?.file;

        // Then create the upload with the document URL
        await createUploadMutation.mutateAsync({
          team: teamId,
          title: file.name,
          url: documentUrl,
        });
      } catch (error) {
        console.log(error)
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteUpload = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livrable ?")) {
      try {
        await deleteUploadMutation.mutateAsync(id);
        toast.success("Livrable supprimé avec succès");
        queryClient.invalidateQueries(["uploads"]);
        if (selectedUpload?.id === id) {
          setSelectedUpload(null);
        }
      } catch (error) {
        toast.error("Erreur lors de la suppression du livrable");
      }
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      try {
        await deleteDocumentMutation.mutateAsync(id);
        toast.success("Document supprimé avec succès");
        queryClient.invalidateQueries(["documents"]);
      } catch (error) {
        toast.error("Erreur lors de la suppression du document");
      }
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() && selectedUpload) {
      try {
        await addCommentMutation.mutateAsync({
          id: selectedUpload.id,
          content: newComment,
        });
        setNewComment("");
        refetchUploadDetails();
        toast.success("Commentaire ajouté");
      } catch (error) {
        toast.error("Erreur lors de l'ajout du commentaire");
      }
    }
  };

  const closeComments = () => {
    setSelectedUpload(null);
  };

  const getFileIcon = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    if (["pdf"].includes(extension || "")) {
      return <FileText className="w-5 h-5 text-secondary" />;
    }
    if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
      return <Image className="w-5 h-5 text-secondary" />;
    }
    return <FileText className="w-5 h-5 text-secondary" />;
  };

  return (
    <div className="mt-6">
      <div className="flex">
        {/* Main content */}
        <div
          className={`transition-all duration-300 ${
            selectedUpload ? "w-2/3" : "w-full"
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left panel: File list */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Nos livrables
                </h2>
              </div>

              <div className="p-2 space-y-1">
                {isLoadingUploads ? (
                  <div className="p-4 text-center text-gray-500">
                    Chargement...
                  </div>
                ) : uploads?.results?.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Aucun livrable
                  </div>
                ) : (
                  uploads?.results?.map((upload: any) => (
                    <div
                      key={upload.id}
                      onClick={() => setSelectedUpload(upload)}
                      className="flex items-center justify-between p-4 px-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          {getFileIcon(upload.url)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {upload.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            Ajouté par : {upload.author?.username || "Inconnu"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-gray-500">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{upload.comments?.length || 0}</span>
                        </div>
                        <button
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUpload(upload.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <a
                          href={upload.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-secondary hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right panel: File upload */}
            {!selectedUpload && (
              <div className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-200 h-[250px]">
                <div className="flex flex-col items-center justify-center text-center py-3">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Upload className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isUploading ? "Téléversement en cours..." : "Ajouter un livrable"}
                  </h3>
                  {!isUploading && (
                    <>
                      <p className="text-gray-500 mb-6">ou</p>
                      <button
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className="bg-secondary text-white px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Choisir un fichier
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments sidebar */}
        {selectedUpload && (
          <div className="w-3/5 bg-white border-y border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedUpload.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {uploadDetails?.comments?.length || 0} commentaire(s)
                  </p>
                </div>
                <button
                  onClick={closeComments}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {uploadDetails?.comments?.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  Aucun commentaire
                </div>
              ) : (
                uploadDetails?.comments?.map((comment: any) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {comment.author?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">
                          {comment.author?.username || "Utilisateur"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add comment */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  VO
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-secondary focus:border-transparent text-sm"
                    rows="3"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || addCommentMutation.isLoading}
                      className="bg-secondary text-white px-4 py-2 rounded-lg font-medium hover:opacity-80 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {addCommentMutation.isLoading ? "Envoi..." : "Envoyer"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Livrables;