"use client";
import axios from "axios";

type AuthCredentials = {
  token: string;
  tokenType: string;
};

const TOKEN_STORAGE_KEY = "token";
const TOKEN_TYPE_STORAGE_KEY = "token_type";

let cachedCredentials: AuthCredentials | null = null;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: true,
});

function buildAuthorizationHeader(creds: AuthCredentials | null) {
  if (!creds?.token) return undefined;
  const prefix = creds.tokenType || "Bearer";
  return `${prefix} ${creds.token}`.trim();
}

function readCredentialsFromStorage(): AuthCredentials | null {
  if (typeof window === "undefined") return cachedCredentials;
  try {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return null;
    const tokenType =
      window.localStorage.getItem(TOKEN_TYPE_STORAGE_KEY) || "Bearer";
    return { token, tokenType };
  } catch {
    return null;
  }
}

function syncCredentials(): AuthCredentials | null {
  const creds = cachedCredentials || readCredentialsFromStorage();
  cachedCredentials = creds;
  const authHeader = buildAuthorizationHeader(creds);
  if (authHeader) {
    api.defaults.headers.common.Authorization = authHeader;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
  return creds;
}

export function hasAuthCredentials() {
  return !!syncCredentials();
}

export function getAuthCredentials(): AuthCredentials | null {
  const creds = syncCredentials();
  return creds ? { ...creds } : null;
}

export function setAuthCredentials(creds: {
  token: string;
  tokenType?: string;
}) {
  if (typeof window === "undefined") return;
  cachedCredentials = {
    token: creds.token,
    tokenType: creds.tokenType || "Bearer",
  };
  window.localStorage.setItem(TOKEN_STORAGE_KEY, cachedCredentials.token);
  window.localStorage.setItem(
    TOKEN_TYPE_STORAGE_KEY,
    cachedCredentials.tokenType
  );
  const authHeader = buildAuthorizationHeader(cachedCredentials);
  if (authHeader) {
    api.defaults.headers.common.Authorization = authHeader;
  }
}

export function clearAuthCredentials() {
  if (typeof window === "undefined") return;
  cachedCredentials = null;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(TOKEN_TYPE_STORAGE_KEY);
  delete api.defaults.headers.common.Authorization;
}

api.interceptors.request.use((config) => {
  const creds = syncCredentials();
  if (creds) {
    config.headers = config.headers || {};
    if (!("Authorization" in config.headers)) {
      const authHeader = buildAuthorizationHeader(creds);
      if (authHeader) {
        config.headers.Authorization = authHeader;
      }
    }
  }
  return config;
});

syncCredentials();

export async function fetcher(url: string) {
  const { data } = await api.get(url);
  return data;
}
