import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginCredentials) => {
    const data = {
        email: email,
        password: password,
    };
  const response = await client.post("auth/jwt/create/", data);
    return response;
    
};