import type { ApiErrorResponse } from '@everafter/types';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details: { field?: string; message: string }[] = [],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RefreshResult {
  accessToken: string;
  user: import('@everafter/types').UserResponse;
}

let refreshPromise: Promise<RefreshResult | null> | null = null;

async function doRefresh(): Promise<RefreshResult | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        setAccessToken(null);
        return null;
      }

      const body = await res.json();
      setAccessToken(body.data.accessToken);
      return body.data as RefreshResult;
    } catch {
      setAccessToken(null);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function refreshAuth(): Promise<RefreshResult | null> {
  return doRefresh();
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (res.status === 401 && accessToken) {
    const result = await doRefresh();
    if (result) {
      headers['Authorization'] = `Bearer ${result.accessToken}`;
      res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        credentials: 'include',
      });
    } else {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new ApiError(401, 'UNAUTHORIZED', 'Session expired');
    }
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const body = await res.json();

  if (!res.ok) {
    const err = body as ApiErrorResponse;
    throw new ApiError(
      res.status,
      err.error.code,
      err.error.message,
      err.error.details,
    );
  }

  return body.data as T;
}

export async function apiUpload<T>(
  path: string,
  file: File,
  fieldName = 'file',
): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);

  const headers: Record<string, string> = {};

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include',
  });

  if (res.status === 401 && accessToken) {
    const result = await doRefresh();
    if (result) {
      headers['Authorization'] = `Bearer ${result.accessToken}`;
      res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });
    } else {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new ApiError(401, 'UNAUTHORIZED', 'Session expired');
    }
  }

  const body = await res.json();

  if (!res.ok) {
    const err = body as ApiErrorResponse;
    throw new ApiError(
      res.status,
      err.error.code,
      err.error.message,
      err.error.details,
    );
  }

  return body.data as T;
}
