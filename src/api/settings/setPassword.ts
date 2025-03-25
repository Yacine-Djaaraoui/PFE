import { ApiClient } from "@/utils/httpClient";

const client = ApiClient({
  baseURL: "/api/",
  withCredentials: false,
});

interface infos {
  current_password: string;
  new_password: string;
}

export const set_password = async ({current_password , new_password }: infos) => {
    const data = {
      current_password: current_password,
      new_password: new_password,
    };
  const response = await client.post("auth/users/set_password/", data);
    return response;
    
};