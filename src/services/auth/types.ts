import { IdName } from "@/types/common";
import { Response } from "@/types/response";

export interface AuthLoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  company: Company;
  name: string;
  email: string;
  jobTitle: string;
  profilePicture: ProfilePicture;
  bio: string;
  role: string;
  contact: string;
  lastActivityAt: Date;
  passwordResetToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  image: string;
  type: string;
}

export interface ProfilePicture {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
  isPrivate: boolean;
  providerKey: string;
}

export interface AuthLoginResponse
  extends Response<{ token: string; user: AuthUser }> {}

export interface AuthMeResponse extends Response<AuthUser> {}
