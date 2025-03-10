export interface CategoryListResponse {
  status: number;
  message: string;
  validation: Validation;
  data: Data;
}

export interface CategoryDetailResponse {
  status: number;
  message: string;
  validation: Validation;
  data: CategoryList;
}

export interface Data {
  list: CategoryList[];
  limit: number;
  page: number;
  total: number;
  totalPage: number;
}

export interface CategoryList {
  id: string;
  company: Company;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  image: string;
}

export interface Validation {}
