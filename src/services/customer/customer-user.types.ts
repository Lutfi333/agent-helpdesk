export interface ResponseCustomerUser {
  status:     number;
  message:    string;
  validation: Validation;
  data:       Data;
}

export interface Data {
  list:  CustomerUserList[];
  limit: number;
  page:  number;
  total: number;
}

export interface CustomerUserList {
  id:             string;
  company:        Company;
  companyProduct: Company;
  name:           string;
  email:          string;
  isNeedBalance:  boolean;
  subscription:   Subscription;
  profilePicture: ProfilePicture;
  jobTitle:       string;
  bio:            string;
  role:           string;
  ticketTotal:    number;
  isVerified:     boolean;
  lastActivityAt: Date | null;
  createdAt:      Date;
  updatedAt:      Date;
}

export interface Company {
  id:    string;
  name:  string;
  image: string;
  type?: string;
  code?: string;
}

export interface ProfilePicture {
  id:          string;
  name:        string;
  size:        number;
  url:         string;
  type:        string;
  category:    string;
  isPrivate:   boolean;
  providerKey: string;
}

export interface Subscription {
  status:  string;
  package: Package | null;
  balance: Balance | null;
  startAt: Date;
  endAt:   Date;
}

export interface Balance {
  time:   Time;
  ticket: Ticket;
}

export interface Ticket {
  remaining: number;
  used:      number;
}

export interface Time {
  total:     number;
  remaining: Remaining;
  used:      number;
}

export interface Remaining {
  total:  number;
  hour:   number;
  minute: number;
  second: number;
}

export interface Package {
  id:      string;
  name:    string;
  hours:   number;
  price:   number;
  benefit: string[];
}

export interface Validation {
}
