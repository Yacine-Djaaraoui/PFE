import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { login } from "@/api/login";
import { loginSuccess } from "@/redux/reducers/AuthReducer";
import { jwtDecode } from "jwt-decode";

interface LoginLayoutProps {
  title: string;
  description: string;
  loginType: "teacher" | "student" | "partenaire";
}

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({
  title,
  description,
  loginType,
}) => {
  const { t } = useTranslation("login"); // Use the 'login' namespace
  const dispatch = useDispatch();
  const [error, setError] = useState<string>("");

  const loginMutation: UseMutationResult<any, LoginFormValues> = useMutation({
    mutationFn: (values: LoginFormValues) => {
      return login(values);
    },
    onError: (error: any) => {
      if (error?.response) {
        setError(error.response?.data?.detail);
      } else if (
        error == "No active account found with the given credentials"
      ) {
        setError(t("invalidCredentials"));
      } else {
        setError(error);
      }
    },
    onSuccess: (data: any) => {
      const decodedToken = jwtDecode(data.refresh);
      const userType = decodedToken?.user_type;
      if (userType !== loginType) {
        navigate("/correct-login-page");
        return;
      }
      dispatch(loginSuccess({ token: data.access }));
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      navigate("/");
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
    <div className="flex flex-row w-full h-[100vh] shadow-lg rounded-lg overflow-hidden">
      <div className="w-[56%] bg-linear-to-b from-[#97B2DF] to-[#19488E] flex flex-col items-start justify-center pl-[10%] text-white">
        <h1 className="text-5xl font-extrabold mb-4">{title}</h1>
        <p className="text-4xl font-medium">{description}</p>
      </div>
      <div className="w-[44%] mx-auto px-20 ">
        <div className="h-full w-[90%] flex flex-col  justify-center mx-auto">
          <h2 className="text-3xl font-extrabold text-[#1E1E1E] mb-1.5">
            Bienvenue !
          </h2>
          <p className="text-[20px] font-medium mb-6 text-[#19488E]">
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
                <div>
                  <Field
                    type="email"
                    name="email"
                    className="w-4/5 h-15 px-4 py-2 mt-1 font-medium text-[17px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Email professionnel"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600 text-[16px] mt-1"
                  />
                </div>
                <div>
                  <Field
                    type="password"
                    name="password"
                    className="w-4/5 h-16 px-4 py-2 mt-1 font-medium text-[17px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Mot de passe"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 text-[16px] mt-1"
                  />
                </div>
                {!error && <p className=" mt-3"></p>}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[60%] h-16 px-4 py-2 mt-7 text-white font-medium text-[20px] bg-[#19488E] rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                >
                  {isSubmitting ? "Connexion..." : "Se connecter"}
                </button>
              </Form>
            )}
          </Formik>
          {error && (
                  <p className="text-red-600  text-[18px] mt-3">{error}</p>
                )}

          <p className="mt-4 font-medium text-[18px] text-[#19488E]">
            Pour toute assistance, contactez l'administrateur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
