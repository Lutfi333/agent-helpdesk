
export interface ConfigResponse {
  status:     number;
  message:    string;
  validation: Validation;
  data:       Data;
}

export interface Data {
  id:          string;
  appName:     string;
  maintenance: Maintenance;
  mainDomain:  string;
  createdAt:   Date;
  updatedAt:   Date;
  minimumCredit: number;
}

export interface Maintenance {
  isMaintenance: boolean;
  message:       string;
}

export interface Validation {
}
