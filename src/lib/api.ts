/**
 * API configuration and a thin fetch wrapper.
 *
 * The bearer token lives in `.env` as `VITE_API_KEY`. Anything prefixed with
 * `VITE_` is inlined into the client bundle at build time, so treat it as
 * public. If the token must stay secret, move this module behind a small
 * server-side proxy and call that instead.
 */

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '';
export const API_KEY: string = import.meta.env.VITE_API_KEY ?? '';

export const isApiConfigured = Boolean(API_KEY && API_BASE_URL);

/** Headers for an authenticated request against the data service. */
export function authHeaders(extra?: HeadersInit): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
    ...extra,
  };
}

/**
 * Fetch JSON from the configured API with the bearer token attached.
 * Throws a descriptive error when the service is not configured yet.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not set — add it to .env to call the API.');
  }
  if (!API_KEY) {
    throw new Error('VITE_API_KEY is not set — add it to .env to call the API.');
  }

  const url = `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  const response = await fetch(url, {
    ...init,
    headers: authHeaders(init.headers),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}
