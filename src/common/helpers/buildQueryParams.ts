/**
 * Appends a filter parameter to URLSearchParams
 * Handles different types: arrays, dates, booleans, strings, numbers
 */
const appendParam = (
  params: URLSearchParams,
  key: string,
  value: unknown
): void => {
  if (value === undefined || value === null) {
    return;
  }

  if (Array.isArray(value)) {
    if (value.length > 0) {
      // For arrays, we can either join them or append multiple times
      // Joining is more common for selectFields, etc
      params.append(key, value.join(','));
    }
  } else if (value instanceof Date) {
    params.append(key, value.toISOString());
  } else if (typeof value === 'boolean') {
    params.append(key, String(value));
  } else if (typeof value === 'number') {
    params.append(key, String(value));
  } else if (typeof value === 'string') {
    if (value.trim()) {
      params.append(key, value);
    }
  } else {
    // For other types, try to stringify
    params.append(key, String(value));
  }
};

/**
 * Type for query parameters value
 */
export type QueryParamValue = string | number | boolean | Date | string[] | number[] | undefined | null;

/**
 * Builds query string from optional params using URLSearchParams
 * Returns empty string if no params, otherwise returns "?key=value&..."
 * 
 * @example
 * buildQueryParams({ name: 'João', role: 'customer' })
 * // Returns: "?name=João&role=customer"
 * 
 * buildQueryParams({ selectFields: ['id', 'name', 'email'] })
 * // Returns: "?selectFields=id,name,email"
 */
export const buildQueryParams = (params?: Record<string, QueryParamValue>): string => {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    appendParam(searchParams, key, value);
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};
