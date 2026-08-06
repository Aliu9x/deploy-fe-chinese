
import axios from "services/axios.customize";
import type {Role } from "@/types/file.constants";
const headers = {
  delay: 1000,
};
export const loginApi = (username: string, password: string) => {
  const urlBackend = "/api/v1/auth/login";
  return axios.post<IBackendRes<ILogin>>(
    urlBackend,
    { username, password },
    { headers: { delay: 1000 } }
  );
};

export const registerApi = (
  email: string,
  password: string,
  phone: string,
  fullName: string,
) => {
  const urlBackend = "/api/v1/auth/register";
  return axios.post<IBackendRes<ILogin>>(urlBackend, {
    email,
    phone,
    password,
    fullName,
  });
};

// ===== API update user (PATCH /api/v1/users/:id) =====
export const updateUserApi = (id: string, data: IUpdateUserReq) => {
  const urlBackend = `/api/v1/users/${id}`;
  return axios.patch<IBackendRes<UserItem>>(urlBackend, data);
};

export interface ListUsersParams {
  page?: number;
  limit?: number;
  q?: string;
  role?: "ADMIN" | "CUSTOMER";
}

export const fetchUsersApi = (params: ListUsersParams) => {
  const urlBackend = "/api/v1/users";

  return axios.get(urlBackend, {
    params,
    headers,
  });
};

export const fetchAccountApi = () => {
  const urlBackend = "/api/v1/auth/account";
  return axios.get<any>(urlBackend, { headers });
};

export const logoutApi = () => {
  const urlBackend = "/api/v1/auth/logout";
  return axios.post(urlBackend, { headers });
};

// export const getUserApi = (params: UserQuery) => {
//   const queryNew = buildGetAllHotels(params);
//   const urlBackend = `/api/v1/users${queryNew}`;
//   return axios.get<any>(urlBackend);
// };

// export const createUserApi = (payload: any) => {
//   const urlBackend = `/api/v1/users`;
//   return axios.post<any>(urlBackend, payload);
// };

