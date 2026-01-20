/**
 * HTTP service configuration
 * Axios-based HTTP client with automatic token refresh and error handling
 */

import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from './cookies';
import { api } from './environment';
import { httpErrorHandler } from './httpErrorHandler';

/**
 * Main HTTP instance
 */
const http: AxiosInstance = axios.create({
  baseURL: api.url,
  timeout: api.timeout,
  headers: { 'Content-Type': 'application/json' }
});

/**
 * Refresh HTTP instance (used for token refresh to avoid circular dependencies)
 */
const refreshHttp: AxiosInstance = axios.create({
  baseURL: api.url,
  headers: { 'Content-Type': 'application/json' }
});

/**
 * Request interceptor - Add access token to headers
 */
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.token = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor - Handle errors and token refresh
 */
http.interceptors.response.use(
  (response) => response,
  httpErrorHandler
);

export { http, refreshHttp };
export default http;
