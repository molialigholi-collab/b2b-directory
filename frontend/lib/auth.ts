"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";
const ACCESS_TOKEN_KEY = "b2b_access_token";
const REFRESH_TOKEN_KEY = "b2b_refresh_token";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
};

type TokenPair = {
  access: string;
  refresh: string;
};

function storeTokens(tokens: TokenPair) {
  // Temporary foundation only: production auth should move tokens into secure
  // httpOnly cookies issued by the backend to reduce XSS token exposure.
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function authRequest<T>(path: string, body: Record<string, string>) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.detail || payload?.email?.[0] || payload?.username?.[0] || "Authentication request failed.");
  }

  return payload as T;
}

export async function login(username: string, password: string) {
  const tokens = await authRequest<TokenPair>("/auth/login/", { username, password });
  storeTokens(tokens);
  return tokens;
}

export async function register(username: string, email: string, password: string) {
  const payload = await authRequest<{ tokens: TokenPair; user: AuthUser }>("/auth/register/", { username, email, password });
  storeTokens(payload.tokens);
  return payload.user;
}

export async function getCurrentUser() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/auth/me/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    logout();
    return null;
  }

  return response.json() as Promise<AuthUser>;
}
