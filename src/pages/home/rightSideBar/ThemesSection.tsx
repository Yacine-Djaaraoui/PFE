// components/ThemesSection.tsx
import { FaPencilAlt, FaTrash, FaPlus, FaFileUpload } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { deleteTheme, createTheme, updateTheme } from "@/api/themes";
import { useThemes } from "@/hooks/themes";
import { useState, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTeachers } from "@/hooks/teachers";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useCreateDocument, useDeleteDocument } from "@/hooks/document";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import editSquare from "@/assets/Edit-Square.svg";
import plus from "@/assets/Plus.svg";
import deleteIcon from "@/assets/weui_delete-outlined.svg";
import editIcon from "@/assets/basil_edit-outline.svg";

import { ReactSVG } from "react-svg";
import { ThemeDetailsDialog } from "@/pages/Student/Themes";

interface Theme {
  id: number;
  title: string;
  co_supervisors: any[];
  academic_year: string;
  description: string;
  tools: string;
  documents?: any[]; // Array of document IDs
}

interface ThemesSectionProps {
  profile: any;
}

export const ThemesSection = ({ profile }: ThemesSectionProps) => {
  const [isAddThemeOpen, setIsAddThemeOpen] = useState(false);
  const [isEditThemeOpen, setIsEditThemeOpen] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState<number | null>(null);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [isThemesOpen, setIsThemesOpen] = useState(false);
  const [isThemesNonVerifyOpen, setIsThemesNonVerifyOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: themesDataSuper } = useThemes({
    ordering: "created_at",
    proposed_by: profile?.id,
    is_verified: true,
  });

  const { data: themesDataCoSuper } = useThemes({
    ordering: "created_at",
    co_supervised_by: profile?.id,
    is_verified: true,
  });

  const themesData: Theme[] = [
    ...(themesDataSuper?.results || []),
    ...(themesDataCoSuper?.results || []),
  ];

  const { data: themesDataNotVerified } = useThemes({
    ordering: "created_at",
    proposed_by: profile?.id,
    is_verified: false,
  });

  const queryClient = useQueryClient();
  const createDocumentMutation = useCreateDocument();
  const deleteDocumentMutation = useDeleteDocument();

  const createThemeMutation = useMutation({
    mutationFn: createTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      setIsAddThemeOpen(false);
    },
  });

  const updateThemeMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateTheme(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      setIsEditThemeOpen(false);
    },
  });

  const deleteThemeMutation = useMutation({
    mutationFn: deleteTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      setThemeToDelete(null);
    },
  });

  const handleEditClick = (theme: Theme) => {
    setCurrentTheme(theme);
    setIsEditThemeOpen(true);
    setIsDialogOpen(false);
  };

  const handleDeleteClick = (themeId: number) => {
    setThemeToDelete(themeId);
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (themeToDelete) {
      deleteThemeMutation.mutate(themeToDelete);
    }
  };

  // Function to handle document uploads
  const handleDocumentUpload = async (
    files: File[],
    existingDocuments: number[] = []
  ) => {
    const uploadedDocumentIds = [...existingDocuments];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);
      formData.append("document_type", "technical_sheet");

      try {
        const document = await createDocumentMutation.mutateAsync(formData);
        uploadedDocumentIds.push(document.id);
      } catch (error) {
        console.error("Error uploading document:", error);
      }
    }

    return uploadedDocumentIds;
  };

  // Function to handle document deletion
  const handleDocumentDelete = async (documentId: number) => {
    try {
      await deleteDocumentMutation.mutateAsync(documentId);
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      return false;
    }
  };
  const handleThemeClick = (e, theme) => {
    e.stopPropagation(); // Stop the event from propagating
    setIsDialogOpen(true);
    setCurrentTheme(theme);
  };

  return (
    <>
      {
        <div className="w-full px-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setIsThemesOpen(!isThemesOpen)} // Toggle visibility
            >
              <ReactSVG src={editSquare} className="w-5 h-5" />
              <h2 className="text-[16px] font-medium text-[#092147] border-b border-black">
                Mes thémes
              </h2>
              {/* Chevron icon that rotates based on state */}
              {isThemesOpen ? (
                <FaChevronUp className="text-gray-600 text-sm" />
              ) : (
                <FaChevronDown className="text-gray-600 text-sm" />
              )}
            </div>
            {/* <button
              className="rounded-full hover:bg-gray-300 p-1"
              onClick={() => setIsAddThemeOpen(true)}
            >
              <ReactSVG src={plus} className="w-5 h-5" />
            </button> */}
          </div>
          {/* Themes List */}
          {isThemesOpen && (
            <div className="space-y-3">
              {themesData?.map((theme) => (
                <div
                  onClick={(e) => handleThemeClick(e, theme)}
                  key={theme.id}
                  className="flex cursor-pointer justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100"
                >
                  <div>
                    <h3 className="font-normal text-[#141B34]">
                      # {theme.id.toString().padStart(2, "0")} {theme.title}
                    </h3>
                    {theme.academic_year && (
                      <span className="text-xs text-gray-500">
                        Année Academique: {theme.academic_year}
                      </span>
                    )}
                  </div>
                  {theme?.proposed_by?.id === profile?.id && (
                    <div className="flex space-x-1">
                      <button
                        className="p-1 rounded-md hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(theme);
                        }}
                      >
                        <ReactSVG src={editIcon} className="w-5 h-5 mr-0.5" />
                      </button>
                      <button
                        className="p-1 rounded-md hover:bg-red-100 "
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(theme.id);
                        }}
                        disabled={deleteThemeMutation.isPending}
                      >
                        <ReactSVG src={deleteIcon} className="w-full h-full" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Theme Dialog */}
          <Dialog open={isAddThemeOpen} onOpenChange={setIsAddThemeOpen}>
            <DialogContent className="max-w-lg bg-white p-6 rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-secondary">
                  Ajouter un thème
                </DialogTitle>
              </DialogHeader>
              <ThemeForm
                initialValues={{
                  title: "",
                  co_supervisor_ids: [],
                  academic_year: "",
                  specialties: [],
                  description: "",
                  tools: "",
                  documents: [],
                }}
                onSubmit={async (values, files) => {
                  const formValues = { ...values };
                  delete formValues.specialties;

                  // First upload documents if any
                  const documentIds =
                    files && files.length > 0
                      ? await handleDocumentUpload(files)
                      : [];

                  // For years 2 and 3
                  if (
                    values.academic_year === "2" ||
                    values.academic_year === "3"
                  ) {
                    const requestData = {
                      ...formValues,
                      academic_year: values.academic_year === "2" ? "2" : "3",
                      document_ids: documentIds,
                      documents: documentIds,
                    };
                    createThemeMutation.mutate(requestData);
                  }
                  // For years 4 and 5
                  else if (
                    (values.academic_year === "4" ||
                      values.academic_year === "5") &&
                    values.specialties.length > 0
                  ) {
                    values.specialties.forEach((specialty: string) => {
                      const requestData = {
                        ...formValues,
                        academic_year: `${
                          values.academic_year
                        }${specialty.toLowerCase()}`,
                        document_ids: documentIds,
                      };
                      console.log(requestData);
                      createThemeMutation.mutate(requestData);
                    });
                  }
                }}
                onCancel={() => setIsAddThemeOpen(false)}
                isSubmitting={
                  createThemeMutation.isPending ||
                  createDocumentMutation.isPending
                }
                submitText="Enregistrer"
              />
            </DialogContent>
          </Dialog>
          {/* Edit Theme Dialog */}
          <Dialog open={isEditThemeOpen} onOpenChange={setIsEditThemeOpen}>
            <DialogContent className="max-w-lg bg-white p-6 rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-[#0D062D]">
                  Modifier le thème
                </DialogTitle>
              </DialogHeader>
              {currentTheme && (
                <ThemeForm
                  initialValues={{
                    title: currentTheme.title || "",
                    co_supervisor_ids:
                      currentTheme.co_supervisors?.map((supervisor: any) =>
                        typeof supervisor === "object"
                          ? supervisor.id
                          : supervisor
                      ) || [],
                    academic_year: parseAcademicLevel(
                      currentTheme.academic_year
                    ).year,
                    specialties: parseAcademicLevel(currentTheme.academic_year)
                      .specialties,
                    description: currentTheme.description || "",
                    tools: currentTheme.tools || "",
                    documents: currentTheme.documents || [],
                  }}
                  onSubmit={async (values, files) => {
                    // First, gather existing document IDs that weren't deleted

                    let documentIds =
                      values.documents?.map((doc) => doc.id) || [];

                    // Then upload new documents if any
                    if (files && files.length > 0) {
                      const newDocumentIds = await handleDocumentUpload(files);
                      // Combine with existing document IDs
                      documentIds = [...documentIds, ...newDocumentIds];
                    }

                    // Prepare the data object
                    const data: any = {
                      title: values.title,
                      description: values.description,
                      tools: values.tools,
                      document_ids: documentIds, // Use document_ids which is what the backend expects
                    };

                    // Add co-supervisors if any
                    if (values.co_supervisor_ids) {
                      data.co_supervisor_ids = values.co_supervisor_ids;
                    }

                    // Handle academic level
                    if (
                      values.academic_year === "2" ||
                      values.academic_year === "3"
                    ) {
                      data.academic_year = values.academic_year;
                    } else if (
                      (values.academic_year === "4" ||
                        values.academic_year === "5") &&
                      values.specialties.length > 0
                    ) {
                      data.academic_year = `${
                        values.academic_year
                      }${values.specialties[0].toLowerCase()}`;
                    }
                    console.log(data);
                    updateThemeMutation.mutate({
                      id: currentTheme.id,
                      data: data,
                    });
                  }}
                  onCancel={() => setIsEditThemeOpen(false)}
                  isSubmitting={
                    updateThemeMutation.isPending ||
                    createDocumentMutation.isPending
                  }
                  submitText="Mettre à jour"
                  isEditMode={true}
                  onDeleteDocument={handleDocumentDelete}
                />
              )}
            </DialogContent>
          </Dialog>
          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={themeToDelete !== null}
            onOpenChange={(open) => !open && setThemeToDelete(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer le thème</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer ce thème? Cette action est
                  irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={deleteThemeMutation.isPending}
                >
                  {deleteThemeMutation.isPending
                    ? "Suppression..."
                    : "Supprimer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      }
      {
        // {/* Header Section */}
        <div className="w-full px-4">
          <div className="flex justify-between items-center mb-4">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setIsThemesNonVerifyOpen(!isThemesNonVerifyOpen)} // Toggle visibility
            >
              <ReactSVG src={editSquare} className="w-5 h-5" />
              <h2 className="text-[16px] font-medium text-[#092147] border-b border-black">
                Mes thémes (non verifie)
              </h2>
              {/* Chevron icon that rotates based on state */}
              {isThemesNonVerifyOpen ? (
                <FaChevronUp className="text-gray-600 text-sm" />
              ) : (
                <FaChevronDown className="text-gray-600 text-sm" />
              )}
            </div>
            <button
              className="rounded-full hover:bg-gray-300 p-1"
              onClick={() => setIsAddThemeOpen(true)}
            >
              <ReactSVG src={plus} className="w-5 h-5" />
            </button>
          </div>
          {/* Themes List */}
          {isThemesNonVerifyOpen && (
            <div className="space-y-3">
              {themesDataNotVerified?.results?.map((theme) => (
                <div
                  onClick={(e) => handleThemeClick(e, theme)}
                  key={theme.id}
                  className="flex cursor-pointer justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100"
                >
                  <div>
                    <h3 className="font-normal text-[#141B34]">
                      # {theme.id.toString().padStart(2, "0")} {theme.title}
                    </h3>
                    {theme.academic_year && (
                      <span className="text-xs text-gray-500">
                        Année Academique: {theme.academic_year}
                      </span>
                    )}
                  </div>
                  {theme?.proposed_by?.id === profile?.id && (
                    <div className="flex space-x-1">
                      <button
                        className="p-1 rounded-md hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(theme);
                        }}
                      >
                        <ReactSVG src={editIcon} className="w-5 h-5 mr-0.5" />
                      </button>
                      <button
                        className="p-1 rounded-md hover:bg-red-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(theme.id);
                        }}
                        disabled={deleteThemeMutation.isPending}
                      >
                        <ReactSVG src={deleteIcon} className="w-full h-full" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {!isEditThemeOpen && themeToDelete == null && (
            <ThemeDetailsDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              theme={currentTheme}
            />
          )}
        </div>
      }
    </>
  );
};

// Helper function to parse academic level string into year and specialties
function parseAcademicLevel(academicLevel: string) {
  if (!academicLevel) {
    return { year: "", specialties: [] };
  }

  if (/^[4-5][a-z]+$/i.test(academicLevel)) {
    const year = academicLevel[0];
    const specialtyCode = academicLevel.substring(1).toUpperCase();
    return {
      year,
      specialties: [specialtyCode],
    };
  }

  if (academicLevel.includes("2nd Year") || academicLevel === "2") {
    return { year: "2", specialties: [] };
  } else if (academicLevel.includes("3rd Year") || academicLevel === "3") {
    return { year: "3", specialties: [] };
  } else if (
    academicLevel.includes("4th Year") ||
    academicLevel.startsWith("4")
  ) {
    const year = "4";
    const specialties = [];

    if (academicLevel.includes("SIW") || academicLevel.includes("siw"))
      specialties.push("SIW");
    if (academicLevel.includes("ISI") || academicLevel.includes("isi"))
      specialties.push("ISI");
    if (academicLevel.includes("IASD") || academicLevel.includes("iasd"))
      specialties.push("IASD");

    return { year, specialties };
  } else if (
    academicLevel.includes("5th Year") ||
    academicLevel.startsWith("5")
  ) {
    const year = "5";
    const specialties = [];

    if (academicLevel.includes("SIW") || academicLevel.includes("siw"))
      specialties.push("SIW");
    if (academicLevel.includes("ISI") || academicLevel.includes("isi"))
      specialties.push("ISI");
    if (academicLevel.includes("IASD") || academicLevel.includes("iasd"))
      specialties.push("IASD");

    return { year, specialties };
  }

  return { year: "", specialties: [] };
}

interface ThemeFormProps {
  initialValues: any;
  onSubmit: (values: any, files: File[]) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitText: string;
  isEditMode?: boolean;
  onDeleteDocument?: (documentId: number) => Promise<boolean>;
}

const ThemeForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitText,
  isEditMode = false,
}: ThemeFormProps) => {
  const themeValidationSchema = Yup.object().shape({
    title: Yup.string().required("Titre est requis"),
    academic_year: Yup.string().required("Année académique est requise"),
    specialties: Yup.array().when("academic_year", {
      is: (val: string) => val === "4" || val === "5",
      then: (schema) => schema.min(1, "Au moins une spécialité est requise"),
      otherwise: (schema) => schema,
    }),
    description: Yup.string().required("Description est requise"),
    tools: Yup.string().required("Outils sont requis"),
  });

  const [showCoSupervisors, setShowCoSupervisors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: teachersData } = useTeachers({ ordering: "-created_at" });
  const profileInfos = useSelector((state: RootState) => state.auth.profile);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const years = [
    { value: "2", label: "2ème Année" },
    { value: "3", label: "3ème Année" },
    { value: "4", label: "4ème Année" },
    { value: "5", label: "5ème Année" },
  ];

  const specialties = [
    { value: "SIW", label: "SIW" },
    { value: "ISI", label: "ISI" },
    { value: "IASD", label: "IASD" },
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={themeValidationSchema}
      onSubmit={(values) => {
        if (
          !values.title ||
          !values.academic_year ||
          !values.description ||
          !values.tools
        ) {
          return;
        }

        if (
          (values.academic_year === "4" || values.academic_year === "5") &&
          (!values.specialties || values.specialties.length === 0)
        ) {
          return;
        }

        onSubmit(values, uploadedFiles);
      }}
    >
      {({ values, isValid, dirty, setFieldValue }) => (
        <Form className="grid gap-4 py-2 ">
          {/* Titre complet */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <label className="text-sm font-medium mb-1 w-1/3">
                Titre complet <span className="text-red-500">*</span>
              </label>
              <div className="w-full">
                <Field
                  type="text"
                  name="title"
                  className="w-full text-sm p-2 border-2 rounded-md border-secondary focus:border-black focus:outline-none"
                  placeholder="Titre du thème"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
            </div>
          </div>
          {/* Co-encadrants */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <label className="text-sm font-medium mb-1 w-1/3">
                Co-encadrants
              </label>
              <div className="w-full">
                <Field name="co_supervisor_ids">
                  {({ field, form }: any) => {
                    const supervisorIds = Array.isArray(field.value)
                      ? field.value
                      : [];
                    const currentCoSupervisors =
                      teachersData?.results?.filter((teacher: any) =>
                        supervisorIds.includes(teacher.id)
                      ) || [];

                    return (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setShowCoSupervisors(!showCoSupervisors)
                          }
                          className={`w-full text-sm p-2 border-2 rounded-md text-left bg-white hover:bg-gray-50 border-secondary focus:border-black focus:outline-none flex justify-between items-center transition-all ${
                            showCoSupervisors ? "border-black" : ""
                          }`}
                        >
                          {currentCoSupervisors.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {currentCoSupervisors.map((teacher: any) => (
                                <div
                                  key={teacher.id}
                                  className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-xs"
                                >
                                  <span>{teacher.username}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newSelection = supervisorIds.filter(
                                        (id: number) => id !== teacher.id
                                      );
                                      form.setFieldValue(
                                        "co_supervisor_ids",
                                        newSelection
                                      );
                                    }}
                                    className="ml-1 text-red-500 hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500">
                              Choisir les co-encadrants
                            </span>
                          )}
                          <svg
                            className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                              showCoSupervisors ? "transform rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {showCoSupervisors && (
                          <div className="absolute z-10 mt-1 w-full bg-white border-2 border-secondary rounded-md shadow-lg p-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                              {teachersData?.results
                                ?.filter(
                                  (teacher: any) =>
                                    teacher.id !== profileInfos?.id
                                )
                                .map((teacher: any) => {
                                  const isChecked = supervisorIds.includes(
                                    teacher.id
                                  );
                                  return (
                                    <label
                                      key={teacher.id}
                                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                          let newSelection = [...supervisorIds];
                                          if (e.target.checked) {
                                            if (
                                              !newSelection.includes(teacher.id)
                                            ) {
                                              newSelection.push(teacher.id);
                                            }
                                          } else {
                                            newSelection = newSelection.filter(
                                              (id) => id !== teacher.id
                                            );
                                          }
                                          form.setFieldValue(
                                            "co_supervisor_ids",
                                            newSelection
                                          );
                                        }}
                                        className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                                      />
                                      <span className="text-sm font-medium">
                                        {teacher.username}
                                      </span>
                                    </label>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }}
                </Field>
              </div>
            </div>
          </div>
          {/* Academic Year */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <label className="text-sm font-medium mb-1 w-1/3">
                Année académique<span className="text-red-500">*</span>
              </label>
              <div className="w-full">
                <Field
                  as="select"
                  name="academic_year"
                  className="w-full text-sm p-2 border-2 rounded-md bg-white border-secondary focus:border-black focus:outline-none"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const year = e.target.value;
                    setFieldValue("academic_year", year);
                    setFieldValue("specialties", []);
                  }}
                >
                  <option value="">Sélectionner une année</option>
                  {years.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="academic_year"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
            </div>
          </div>
          {/* Specialities */}
          {(values.academic_year === "4" || values.academic_year === "5") && (
            <div className="flex flex-col">
              <div className="flex items-center">
                <label className="text-sm font-medium mb-1 w-1/3">
                  Spécialités<span className="text-red-500">*</span>
                </label>
                <div className="w-full">
                  <div className="flex flex-wrap gap-2">
                    {specialties.map((specialty) => (
                      <label
                        key={specialty.value}
                        className={`flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer ${
                          values.specialties?.includes(specialty.value)
                            ? "bg-gray-100 border-secondary"
                            : ""
                        }`}
                      >
                        <Field
                          type="checkbox"
                          name="specialties"
                          value={specialty.value}
                          checked={values.specialties?.includes(
                            specialty.value
                          )}
                          className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                        />
                        <span className="text-sm">{specialty.label}</span>
                      </label>
                    ))}
                  </div>
                  <ErrorMessage
                    name="specialties"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>
            </div>
          )}
          {/* Description */}
          <div className="flex flex-col">
            <div className="flex">
              <label className="text-sm font-medium mb-1 w-1/3">
                Description<span className="text-red-500">*</span>
              </label>
              <div className="w-full">
                <Field
                  as="textarea"
                  name="description"
                  className="w-full text-sm p-2 border-2 rounded-md border-secondary focus:border-black focus:outline-none"
                  rows={3}
                  placeholder="Description détaillée du thème"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
            </div>
          </div>
          {/* Outils */}
          <div className="flex flex-col">
            <div className="flex">
              <label className="text-sm font-medium mb-1 w-1/3">
                Outils<span className="text-red-500">*</span>
              </label>
              <div className="w-full">
                <Field
                  as="textarea"
                  name="tools"
                  className="w-full text-sm p-2 border-2 rounded-md border-secondary focus:border-black focus:outline-none"
                  rows={3}
                  placeholder="Python, React, TensorFlow (séparés par virgule)"
                />
                <ErrorMessage
                  name="tools"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
            </div>
          </div>
          {/* Document Upload */}
          <div className="flex flex-col">
            <div className="flex">
              <label className="text-sm font-medium mb-1 w-1/3">
                Documents
              </label>
              <div className="w-full">
                <div className="flex items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setUploadedFiles([...uploadedFiles, ...files]);
                    }}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-secondary rounded-md text-sm text-secondary hover:bg-gray-50"
                  >
                    <FaFileUpload />
                    Ajouter des documents
                  </button>
                </div>

                {/* Display documents using Formik Field */}
                <Field name="documents">
                  {({ field, form }: any) => {
                    const documents = field.value || [];

                    return (
                      <>
                        {/* Display existing documents and newly uploaded files together */}
                        {(documents.length > 0 || uploadedFiles.length > 0) && (
                          <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-medium">
                              {isEditMode
                                ? "Documents associés"
                                : "Documents à ajouter"}
                            </h4>

                            {/* Existing documents */}
                            {documents.map((document: any) => {
                              return (
                                <div
                                  key={`existing-${document.id}`}
                                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md border"
                                >
                                  <div className="flex items-center">
                                    <a
                                      href={document.file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:underline truncate max-w-xs"
                                    >
                                      {document.title ||
                                        `Document #${document.id}`}
                                    </a>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // Just remove from UI state - no need to call API yet
                                      // We'll handle this when form is submitted
                                      form.setFieldValue(
                                        "documents",
                                        documents.filter(
                                          (doc: any) => doc.id !== document.id
                                        )
                                      );
                                    }}
                                    className="text-red-500 hover:text-red-700 p-1"
                                    title="Supprimer le document"
                                  >
                                    <FaTrash size={14} />
                                  </button>
                                </div>
                              );
                            })}

                            {/* Newly uploaded files */}
                            {uploadedFiles.map((file, index) => (
                              <div
                                key={`new-${index}`}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded-md border"
                              >
                                <span className="text-sm truncate max-w-xs">
                                  {file.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUploadedFiles(
                                      uploadedFiles.filter(
                                        (_, i) => i !== index
                                      )
                                    );
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1"
                                  title="Retirer le document"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  }}
                </Field>
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !(isValid && dirty)}
              className="px-4 py-2 text-sm font-medium bg-secondary text-white rounded-md hover:opacity-80 disabled:opacity-50"
            >
              {isSubmitting ? "Enregistrement..." : submitText}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
