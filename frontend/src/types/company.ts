export type Company = {
  id: string;
  name: string;
  street: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  revenue: number;
  expenses: number;
  profit: number;
  employees: number;
  clients: number;
  created_at: string;
  updated_at: string;
};

export type CreateCompanyPayload = {
  name: string;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  country?: string | null;
  revenue?: number;
  expenses?: number;
  employees?: number;
  clients?: number;
};

export type UpdateCompanyPayload = CreateCompanyPayload;

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

export type BulkDeletePayload = {
  ids: string[];
};
