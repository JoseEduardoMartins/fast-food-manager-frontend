/**
 * HTTP error handler
 * Handles token refresh and error responses.
 * 401 with token "PERMISSION_DENIED" = lack of permission (do not logout).
 */

import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { getRefreshToken, setAccessToken } from './cookies';
import { refreshHttp, http } from './http';

let isRefreshing = false;

let failedRequestsQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const HTTP_STATUS_CODE = {
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  conflict: 409,
  serverError: 500,
} as const;

interface ApiError {
  message?: string;
  permission?: string;
  token?: string;
}

/**
 * Refreshes the access token using the refresh token
 */
const refreshToken = async (): Promise<string | null> => {
  try {
    isRefreshing = true;

    const storedRefreshToken = getRefreshToken();

    if (!storedRefreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await refreshHttp.post('/auth/refresh', {
      refresh_token: storedRefreshToken
    });

    const { access_token: newAccessToken } = response.data;

    if (newAccessToken) {
      setAccessToken(newAccessToken);
    }

    failedRequestsQueue.forEach((request) => request.resolve(newAccessToken));
    failedRequestsQueue = [];

    return newAccessToken;
  } catch (error) {
    failedRequestsQueue.forEach((request) => request.reject(error));
    failedRequestsQueue = [];
    return null;
  } finally {
    isRefreshing = false;
  }
};

/**
 * HTTP error handler
 * Handles 401 errors by refreshing tokens and retrying requests
 */
export const httpErrorHandler = async (
  error: AxiosError<ApiError>
): Promise<any> => {
  const { status, config, response } = error;

  if (status === HTTP_STATUS_CODE.unauthorized && response?.data) {
    const data = response.data as ApiError;
    if (data.token === 'PERMISSION_DENIED') {
      if (typeof window !== 'undefined') {
        toast.error('Você não tem permissão para esta ação.');
      }
      return Promise.reject(error);
    }
  }

  if (status === HTTP_STATUS_CODE.unauthorized && config) {
    const originalRequest = config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          resolve: (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.token = token;
            }
            resolve(http(originalRequest));
          },
          reject
        });
      });
    }

    if (!originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshToken();

            if (newToken && originalRequest.headers) {
              originalRequest.headers.token = newToken;
              return http(originalRequest);
            }

      // If refresh failed, redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }

  // Handle other errors
  const message = response?.data?.message;

  switch (status) {
    case HTTP_STATUS_CODE.badRequest:
      console.error('Bad Request:', message || response?.data);
      break;
    case HTTP_STATUS_CODE.unauthorized:
      console.error('Unauthorized:', message || response?.data);
      if (typeof window !== 'undefined') {
        const data = response?.data as ApiError | undefined;
        if (data?.token !== 'PERMISSION_DENIED') {
          window.location.href = '/login';
        }
      }
      break;
    case HTTP_STATUS_CODE.notFound:
      console.error('Not Found:', message || response?.data);
      break;
    case HTTP_STATUS_CODE.conflict:
      console.error('Conflict:', message || response?.data);
      break;
    case HTTP_STATUS_CODE.serverError:
      console.error('Internal Server Error:', message || response?.data);
      break;
    default:
      console.error('HTTP Error:', status, message || response?.data);
  }

  return Promise.reject(error);
};
