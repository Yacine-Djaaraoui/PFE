// components/ThemesSection.tsx
import { FaPencilAlt, FaTrash, FaPlus } from "react-icons/fa";
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
import { useState } from "react";
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
import { profile } from "console";

interface Theme {
  id: number;
  title: string;
  co_supervisors?: number[];
  specialty: string;
  description: string;
  tools: string;
  academic_year: number;
  academic_program: string;
}

interface ThemesSectionProps {
  profile: any;
}

export const ThemesSection = ({ profile }: ThemesSectionProps) => {
  const [isAddThemeOpen, setIsAddThemeOpen] = useState(false);
  const [isEditThemeOpen, setIsEditThemeOpen] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState<number | null>(null);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const { data: themesData } = useThemes({
    ordering: "created_at",
    proposed_by: profile?.id,
  });
  const queryClient = useQueryClient();
  

  const themeValidationSchema = Yup.object().shape({
    title: Yup.string().required("Titre est requis"),
    specialty: Yup.string().required("Spécialité est requise"),
    description: Yup.string().required("Description est requise"),
    tools: Yup.string().required("Outils sont requis"),
    academic_year: Yup.string().required("Année académique est requise"),
    academic_program: Yup.string().required("Programme académique est requis"),
  });

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
  };

  const handleDeleteClick = (themeId: number) => {
    setThemeToDelete(themeId);
  };

  const handleConfirmDelete = () => {
    if (themeToDelete) {
      deleteThemeMutation.mutate(themeToDelete);
    }
  };

  return (
    <div className="w-full px-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <FaPencilAlt className="text-gray-600" />
          <h2 className="text-lg font-bold text-[#0D062D] underline">
            Mes thémes
          </h2>
        </div>
        <button
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          onClick={() => setIsAddThemeOpen(true)}
        >
          <FaPlus className="text-gray-600" />
        </button>
      </div>

      {/* Themes List */}
      <div className="space-y-3">
        {themesData?.results?.map((theme) => (
          <div
            key={theme.id}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100"
          >
            <h3 className="font-medium text-[#0D062D]">
              #{theme.id.toString().padStart(2, "0")} {theme.title}
            </h3>
            <div className="flex space-x-2">
              <button
                className="p-2 rounded-md hover:bg-gray-200"
                onClick={() => handleEditClick(theme)}
              >
                <FaPencilAlt className="text-gray-600" />
              </button>
              <button
                className="p-2 rounded-md hover:bg-gray-200 hover:text-red-500"
                onClick={() => handleDeleteClick(theme.id)}
                disabled={deleteThemeMutation.isPending}
              >
                <FaTrash className="text-gray-600 hover:text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Theme Dialog */}
      <Dialog open={isAddThemeOpen} onOpenChange={setIsAddThemeOpen}>
        <DialogContent className="max-w-lg bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#0D062D]">
              Ajouter un thème
            </DialogTitle>
          </DialogHeader>
          <ThemeForm
            initialValues={{
              title: "",
              co_supervisors: "",
              specialty: "",
              description: "",
              tools: "",
              academic_year: "",
              academic_program: "",
            }}
            onSubmit={(values) => {
              const themeData = {
                ...values,
                co_supervisors: values.co_supervisors
                  .split(",")
                  .map((id) => parseInt(id.trim()))
                  .filter((id) => !isNaN(id)),
                academic_year: parseInt(values.academic_year),
              };
              createThemeMutation.mutate(themeData);
            }}
            onCancel={() => setIsAddThemeOpen(false)}
            isSubmitting={createThemeMutation.isPending}
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
                title: currentTheme.title,
                co_supervisors: currentTheme.co_supervisors?.join(",") || "",
                specialty: currentTheme.specialty,
                description: currentTheme.description,
                tools: currentTheme.tools,
                academic_year: currentTheme.academic_year.toString(),
                academic_program: currentTheme.academic_program,
              }}
              onSubmit={(values) => {
                const themeData = {
                  ...values,
                  co_supervisors: values.co_supervisors
                    .split(",")
                    .map((id) => parseInt(id.trim()))
                    .filter((id) => !isNaN(id)),
                  academic_year: parseInt(values.academic_year),
                };
                updateThemeMutation.mutate({
                  id: currentTheme.id,
                  data: themeData,
                });
              }}
              onCancel={() => setIsEditThemeOpen(false)}
              isSubmitting={updateThemeMutation.isPending}
              submitText="Mettre à jour"
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
              {deleteThemeMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const ThemeForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitText,
}: {
  initialValues: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitText: string;
}) => {
  const themeValidationSchema = Yup.object().shape({
    title: Yup.string().required("Titre est requis"),
    specialty: Yup.string().required("Spécialité est requise"),
    description: Yup.string().required("Description est requise"),
    tools: Yup.string().required("Outils sont requis"),
    academic_year: Yup.string().required("Année académique est requise"),
    academic_program: Yup.string().required("Programme académique est requis"),
  });

  const [showCoSupervisors, setShowCoSupervisors] = useState(false);
  const { data: teachersData } = useTeachers({ ordering: "created_at" });
  const profileInfos = useSelector((state: RootState) => state.auth.profile);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={themeValidationSchema}
      onSubmit={onSubmit}
    >
      <Form className="grid gap-4 py-2">
        {/* Titre complet */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Titre complet<span className="text-red-500">*</span>
          </label>
          <Field
            type="text"
            name="title"
            className="w-full p-2 border rounded-md"
            placeholder="Titre du thème"
          />
          <ErrorMessage
            name="title"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>

        {/* Co-encadrants as button + checkbox list using Formik */}
        <Field name="co_supervisors">
          {({ field, form }: any) => (
            <div>
              <label className="block text-sm font-medium mb-1">
                Co-encadrants
              </label>
              <button
                type="button"
                onClick={() => setShowCoSupervisors(!showCoSupervisors)}
                className="w-full p-2 border rounded-md text-left bg-white hover:bg-gray-100"
              >
                {field.value?.length
                  ? `${field.value.length} sélectionné(s)`
                  : "Choisir les co-encadrants"}
              </button>

              {showCoSupervisors && (
                <div className="border rounded-md mt-2 max-h-40 overflow-y-auto p-2 bg-white space-y-1">
                  {teachersData?.results
                    ?.filter((teacher: any) => teacher.id !== profileInfos?.id)
                    .map((teacher: any) => {
                      const isChecked = field.value?.includes(teacher.id);
                      return (
                        <label
                          key={teacher.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const newSelection = new Set(field.value || []);
                              if (e.target.checked) {
                                newSelection.add(teacher.id);
                              } else {
                                newSelection.delete(teacher.id);
                              }
                              form.setFieldValue(
                                "co_supervisors",
                                Array.from(newSelection)
                              );
                            }}
                          />
                          <span>{teacher.username}</span>
                        </label>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </Field>

        {/* Spécialité */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Spécialité<span className="text-red-500">*</span>
          </label>
          <Field
            as="select"
            name="specialty"
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="">Sélectionner une spécialité</option>
            <option value="IASD">IASD</option>
            <option value="SIW">SIW</option>
            <option value="ISI"> ISI</option>
            <option value="1CS">1CS</option>
            <option value="2CS">2CS</option>
          </Field>
          <ErrorMessage
            name="specialty"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description<span className="text-red-500">*</span>
          </label>
          <Field
            as="textarea"
            name="description"
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Description détaillée du thème"
          />
          <ErrorMessage
            name="description"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>

        {/* Outils */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Outils<span className="text-red-500">*</span>
          </label>
          <Field
            type="text"
            name="tools"
            className="w-full p-2 border rounded-md"
            placeholder="Python, React, TensorFlow (séparés par virgule)"
          />
          <ErrorMessage
            name="tools"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>

        {/* Année académique */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Année académique<span className="text-red-500">*</span>
          </label>
          <Field
            as="select"
            name="academic_year"
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="">Sélectionner une année</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </Field>
          <ErrorMessage
            name="academic_year"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>

        {/* Programme académique */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Programme académique<span className="text-red-500">*</span>
          </label>
          <Field
            as="select"
            name="academic_program"
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="">Sélectionner un programme</option>
            <option value="preparatory">Préparatoire</option>
            <option value="superior">Supérieur</option>
          </Field>
          <ErrorMessage
            name="academic_program"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isSubmitting ? "Enregistrement..." : submitText}
          </button>
        </div>
      </Form>
    </Formik>
  );
};
