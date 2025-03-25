import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { set_password } from "@/api/settings/setPassword";
import { CheckCircle } from "lucide-react"; // Import a check icon from Lucide (or any other icon library)

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Le mot de passe actuel est requis"),
  newPassword: Yup.string()
    .min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères")
    .required("Le nouveau mot de passe est requis"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Les mots de passe ne correspondent pas")
    .required("Confirmez votre nouveau mot de passe"),
});

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface ApiError {
  current_password?: string[];
  new_password?: string[];
  non_field_errors?: string[];
}

const SettingCard = () => {
  const [emailVerified, setEmailVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); // New state for success message

  const setPasswordMutation = useMutation({
    mutationFn: (values: {
      current_password: string;
      new_password: string;
    }) => {
      return set_password({
        current_password: values.current_password,
        new_password: values.new_password,
      });
    },
    onError: (error: any) => {
      console.log(error);
      setApiError(error);
      setIsSuccess(false); // Ensure success state is false on error
    },
    onSuccess: () => {
      setIsSuccess(true); // Set success state to true
      setApiError(null);
      // Don't close the modal immediately, let the user see the success message
    },
  });

  const handleSubmit = async (
    values: PasswordFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      await setPasswordMutation.mutateAsync({
        current_password: values.currentPassword,
        new_password: values.newPassword,
      });
    } catch (error) {
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setApiError(null);
    setIsSuccess(false); // Reset success state when closing modal
  };

  return (
    <div className="w-[62.5%] mt-12 h-[80vh] bg-white p-6 border border-[#E6E6E6] rounded-lg shadow font-inter">
      <h2 className="text-sm font-bold mb-4">INFORMATIONS DU COMPTE</h2>

      {!emailVerified && (
        <div className="bg-[#97B2DF]/12 p-3 rounded-md mb-4 border border-[#E6E6E6] text-sm">
          <span className="mr-1">
            🔹 Vous n'avez pas vérifié votre e-mail !
          </span>
          <span>
            Pour publier un projet et effectuer d'autres actions, veuillez{" "}
            <a
              href="#"
              className="text-secondary font-semibold hover:underline"
            >
              vérifier votre email.
            </a>
          </span>
        </div>
      )}

      <div className="space-y-4 w-1/2">
        <div className="space-y-2">
          <label className="block text-gray-600 text-sm font-semibold">
            Email
          </label>
          <input
            type="email"
            value="hello@esi-sba.dz"
            disabled
            className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-md border border-gray-300 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-600 text-sm font-semibold">
            Mot de passe{" "}
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-secondary font-semibold hover:underline ml-2"
            >
              | Modifier
            </button>
          </label>
          <input
            type="password"
            value="************"
            disabled
            className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-md border border-gray-300 focus:outline-none"
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Modifier le mot de passe
            </h2>

            {isSuccess ? (
              <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <p className="text-lg font-medium text-gray-800 mb-4">
                  Votre mot de passe a été changé avec succès!
                </p>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-secondary text-white rounded-md hover:opacity-80"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <Formik
                initialValues={{
                  currentPassword: "",
                  newPassword: "",
                  confirmNewPassword: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    {/* ... your existing form fields ... */}
                    <div>
                      <label className="block text-gray-600 text-sm font-medium">
                        Mot de passe actuel
                      </label>
                      <Field
                        type="password"
                        name="currentPassword"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                      <ErrorMessage
                        name="currentPassword"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                      {apiError?.current_password && (
                        <div className="text-red-500 text-xs mt-1">
                          {apiError.current_password.join(" ")}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm font-medium">
                        Nouveau mot de passe
                      </label>
                      <Field
                        type="password"
                        name="newPassword"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                      <ErrorMessage
                        name="newPassword"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                      {apiError?.new_password && (
                        <div className="text-red-500 text-xs mt-1">
                          {apiError.new_password.join(" ")}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-600 text-sm font-medium">
                        Confirmer le nouveau mot de passe
                      </label>
                      <Field
                        type="password"
                        name="confirmNewPassword"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                      <ErrorMessage
                        name="confirmNewPassword"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {apiError?.non_field_errors && (
                      <div className="text-red-500 text-xs">
                        {apiError.non_field_errors.join(" ")}
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:opacity-80"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || setPasswordMutation.isPending}
                        className="px-4 py-2 bg-secondary text-white rounded-md hover:opacity-80 disabled:opacity-50"
                      >
                        {setPasswordMutation.isPending
                          ? "Chargement..."
                          : "Confirmer"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingCard;
