import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { login } from "@/api/login";
import { loginSuccess } from "@/redux/reducers/AuthReducer";
import image from "@/assets/loginIcon.png";
import { jwtDecode } from "jwt-decode";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Import icons from react-icons

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { t } = useTranslation("login"); // Use the 'login' namespace
  const dispatch = useDispatch();
  const [error, setError] = useState<string>("");

  const loginMutation: UseMutationResult<any, LoginFormValues> = useMutation({
    mutationFn: (values: LoginFormValues) => {
      return login(values);
    },
    onError: (error: any) => {
      if (
        error == "No active account found with the given credentials"
      ) {
        setError(t("invalidCredentials"));
      } else {
        setError(error);
      }
    },
    onSuccess: (data: any) => {
      dispatch(loginSuccess({ token: data.access }));
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      navigate("/dashboard");
    },
  });

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setSubmitting(true);
      await loginMutation.mutateAsync(values);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-row w-full h-[100vh] overflow-hidden">
      <div className="relative w-[56%] bg-linear-to-b from-accent to-secondary flex flex-col items-start justify-center pl-[10%] text-white">
        <h1 className="text-5xl font-extrabold mb-4 ">
          Bienvenue sur ProjecTrack
        </h1>
        <p className="text-4xl font-medium md:pr-90">
          Collaborez, innovez , Gérez votre projet en un clic !
        </p>
        <button className="w-[25%] h-10 px-4 mt-5 text-white font-normal text-[18px] bg-accent rounded-lg hover:opacity-80">
          un œil sur les projets
        </button>
        <img
          src={image}
          alt="icon"
          className="absolute top-4 left-4 w-16 h-14"
        />
      </div>
      <div className="w-[44%] mx-auto px-20 ">
        <div className="h-full w-[90%] flex flex-col justify-center mx-auto">
          <h2 className="text-3xl font-extrabold text-primaryTitle mb-1.5">
            Bienvenue !
          </h2>
          <p className="text-[20px] font-medium mb-6 text-secondary">
            Connectez-vous avec votre adresse e-mail et
            <br /> mot de passe attribué par l'école .
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="w-full space-y-4">
                <div className="relative">
                  <div className="flex items-center">
                    <FaEnvelope className="absolute left-7 text-gray-400 w-6 h-6 " />
                    <Field
                      type="email"
                      name="email"
                      className="w-4/5 h-15 pl-16 px-4 py-2 mt-1 font-medium text-[17px] border border-accent rounded-lg hover:border-secondary"
                      placeholder="Email professionnel"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600 text-[16px] mt-1"
                  />
                </div>
                <div className="relative">
                  <div className="flex items-center">
                    <FaLock className="absolute left-7 text-gray-400 w-6 h-6" />
                    <Field
                      type="password"
                      name="password"
                      className="w-4/5 h-16 pl-16 px-4 py-2 mt-1 font-medium text-[17px] border border-accent rounded-lg hover:border-secondary"
                      placeholder="Mot de passe"
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 text-[16px] mt-1"
                  />
                </div>
                {!error && <p className="mt-3"></p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[60%] h-16 px-4 py-2 mt-7 text-white font-medium text-[20px] bg-secondary rounded-lg hover:opacity-90"
                >
                  {isSubmitting ? "Connexion..." : "Se connecter"}
                </button>
              </Form>
            )}
          </Formik>
          {error && <p className="text-red-600 text-[18px] mt-3">{error}</p>}

          <p className="mt-4 font-medium text-[16px] text-secondary">
            Pour toute assistance, contactez l'administrateur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;