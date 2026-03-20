import api from "./api";
import type {
  BulkDeletePayload,
  Company,
  CreateCompanyPayload,
  PaginatedResponse,
  UpdateCompanyPayload,
} from "../types/company";

export const companyService = {
  getAll: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Company>> => {
    const response = await api.get<PaginatedResponse<Company>>("/companies", {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Company> => {
    const response = await api.get<Company>(`/companies/${id}`);
    return response.data;
  },

  create: async (payload: CreateCompanyPayload): Promise<Company> => {
    const response = await api.post<Company>("/companies", payload);
    return response.data;
  },

  update: async (
    id: string,
    payload: UpdateCompanyPayload
  ): Promise<Company> => {
    const response = await api.put<Company>(`/companies/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },

  bulkDelete: async (payload: BulkDeletePayload): Promise<void> => {
    await api.delete("/companies", { data: payload });
  },
};
