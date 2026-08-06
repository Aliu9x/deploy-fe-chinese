import type { Role, UserStatus } from "./file.constants";

export { };

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      page: number;
      limit: number;
      pages: number;
      total: number;
    };
    result: T[];
  }

  interface IPaginateMeta {
    page: number;
    limit: number;
    pages: number;
    total: number;
  }
  interface ILogin {
    access_token: string;
    user: IUser;
  }

  interface UsersData {
    result: UserItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }


  interface UserItem {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    role: UpdateUserRole;
    status: UpdateUserStatus;
    createdAt?: string;
    updatedAt?: string;
  }
  interface IUpdateUserReq {
    full_name?: string;
    email?: string;
    phone?: string;
    role?: UpdateUserRole;
    status?: UpdateUserStatus;
  }
}