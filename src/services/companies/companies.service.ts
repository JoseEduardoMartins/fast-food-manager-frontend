/**
 * Company service
 * CRUD operations for companies management
 * Based on backend API documentation
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  CreateCompanyResponse,
  ListCompaniesParams,
  ListCompaniesResponse,
} from './companies.types';

/**
 * Lists companies with optional filters and pagination
 * GET /companies
 */
export const listCompanies = async (params?: ListCompaniesParams): Promise<ListCompaniesResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListCompaniesResponse>(`/companies${queryString}`);
  return response.data;
};

/**
 * Gets a company by ID
 * GET /companies/:id
 */
export const getCompanyById = async (
  id: string,
  selectFields?: string[]
): Promise<Company> => {
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<Company>(`/companies/${id}${queryString}`);
  return response.data;
};

/**
 * Creates a new company
 * POST /companies
 * Returns: { id: string }
 */
export const createCompany = async (data: CreateCompanyRequest): Promise<CreateCompanyResponse> => {
  const response = await http.post<CreateCompanyResponse>('/companies', data);
  return response.data;
};

/**
 * Updates a company
 * PATCH /companies/:id
 * Returns: 204 No Content
 */
export const updateCompany = async (id: string, data: UpdateCompanyRequest): Promise<void> => {
  await http.patch(`/companies/${id}`, data);
};

/**
 * Deletes a company
 * DELETE /companies/:id
 * Returns: 204 No Content
 */
export const deleteCompany = async (id: string): Promise<void> => {
  await http.delete(`/companies/${id}`);
};
