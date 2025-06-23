import { P, R } from "@/types/response";

export type UserListResponse = P<UserList>

export interface UserList {
  id:             string;
  company:        Company;
  companyProduct: Company;
  name:           string;
  email:          string;
  isNeedBalance:  boolean;
  subscription:   null;
  profilePicture: ProfilePicture;
  jobTitle:       string;
  bio:            string;
  role:           string;
  category:       Company;
  isVerified:     boolean;
  lastActivityAt: null;
  createdAt:      Date;
  updatedAt:      Date;
}

export interface Company {
  id:   string;
  name: string;
}

export interface ProfilePicture {
  id:          string;
  name:        string;
  size:        number;
  url:         string;
  type:        string;
  isPrivate:   boolean;
  providerKey: string;
}

export interface Validation {
}

/**
 * DETAIL RESPONSE
 */

export type UserDetailResponse  = R<DataUser>

export interface DataUser {
  id:             string;
  company:        Company;
  companyProduct: Company;
  name:           string;
  email:          string;
  isNeedBalance:  boolean;
  subscription:   null;
  profilePicture: ProfilePicture;
  jobTitle:       string;
  bio:            string;
  isVerified:     boolean;
  lastActivityAt: null;
  createdAt:      Date;
  updatedAt:      Date;
}

export interface Company {
  id:   string;
  name: string;
}

export interface ProfilePicture {
  id:          string;
  name:        string;
  size:        number;
  url:         string;
  type:        string;
  isPrivate:   boolean;
  providerKey: string;
}


