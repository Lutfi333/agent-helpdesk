
export interface CompanyDetailResponse {
  status:     number;
  message:    string;
  validation: Validation;
  data:       Data;
}

export interface Data {
  id:           string;
  accessKey:    string;
  name:         string;
  bio:          string;
  type:         string;
  productTotal: number;
  ticketTotal:  number;
  logo:         Logo;
  settings:     Settings;
  createdAt:    Date;
  updatedAt:    Date;
}

export interface Logo {
  id:          string;
  name:        string;
  size:        number;
  url:         string;
  type:        string;
  isPrivate:   boolean;
  providerKey: string;
}

export interface Settings {
  code:   string;
  email:  string;
  color:  string;
  domain: Domain;
}

export interface Domain {
  isCustom:  boolean;
  subdomain: string;
  fullUrl:   string;
}

export interface Validation {
}

