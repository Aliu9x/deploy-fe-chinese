

export type Role = "CUSTOMER" |"ADMIN";

export const UserStatus = {
  APPROVED: "APPROVED",
  SUSPENDED: "SUSPENDED",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
