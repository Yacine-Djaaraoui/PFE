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
      if (error == "No active account found with the given credentials") {
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
      <div className="relative w-[56%] bg-secondary flex flex-col items-start justify-center pl-[10%] text-white font-poppins">
      <img
          src={image}
          alt="icon"
          className="top-4 left-4 w-14 h-12"
        />
        <h1 className="text-[40px] font-poppins font-extrabold mb-2 ">
          Bienvenue sur ProjecTrack
        </h1>
        <button className="w-[40%] h-9 px-4 text-white font-normal text-sm bg-[#7495C9] rounded-sm hover:opacity-80">
          Collaborez, innovez , Gérez
        </button>
        <p className="text-2xl font-normal md:pr-54  mt-4 text-white opacity-70">
          une plateforme intuitive et efficace conçue pour simplifier la gestion
          de vos projets académiques.
        </p>

        
      </div>
      <div className="w-[44%] mx-auto px-20 ">
        <div className="h-full w-[90%] flex flex-col justify-center mx-auto">
          <h2 className="text-[26px] font-extrabold text-primaryTitle mb-1.5">
            Bienvenue !
          </h2>
          <p className="text-[18px] font-medium mb-6 text-secondary">
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
                  className="w-[60%] h-15 px-4 py-2 mt-7 text-white font-medium text-[20px] bg-secondary rounded-lg hover:opacity-90"
                >
                  {isSubmitting ? "Connexion..." : "Se connecter"}
                </button>
              </Form>
            )}
          </Formik>
          {error && <p className="text-red-600 text-[18px] mt-3">{error}</p>}

          <p className="mt-2 font-medium text-[12px] text-secondary">
            Pour toute assistance, contactez l'administrateur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
