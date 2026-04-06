import { request } from "./api";
import type { User } from "../types";

export interface BackendUser {
  user_id: string;
  full_name: string;
  email: string;
  created_at: string;
  account_status: string;
  theme_mode?: string;
}

export interface AuthTokens { access: string; refresh: string }
export interface AuthResponse { user: BackendUser; tokens: AuthTokens }

export function normalizeUser(b: BackendUser, prev?: User | null): User {
  return {
    id: b.user_id,
    email: b.email,
    name: b.full_name,
    createdAt: b.created_at,
    accountStatus: b.account_status,
    themeMode: b.theme_mode,
    isPremium: prev?.isPremium ?? false,
    language: prev?.language,
  };
}

const KEY = { user: "currentUser", tokens: "authTokens" } as const;

export const session = {
  save: (user: User, tokens: AuthTokens) => {
    localStorage.setItem(KEY.user, JSON.stringify(user));
    localStorage.setItem(KEY.tokens, JSON.stringify(tokens));
  },
  clear: () => {
    localStorage.removeItem(KEY.user);
    localStorage.removeItem(KEY.tokens);
  },
  loadUser: (): User | null => {
    const r = localStorage.getItem(KEY.user);
    return r ? JSON.parse(r) : null;
  },
  loadTokens: (): AuthTokens | null => {
    const r = localStorage.getItem(KEY.tokens);
    return r ? JSON.parse(r) : null;
  },
};

export const authService = {
  register: (p: { email: string; full_name: string; password: string; confirm_password: string }) =>
    request<AuthResponse>("/auth/register/", { method: "POST", body: JSON.stringify(p) }),

  login: (email: string, password: string) => {
    const payload = { email, password };
    return request<AuthResponse>("/auth/login/", { method: "POST", body: JSON.stringify(payload) });
  },

  logout: (refresh: string, access: string) =>
    request<void>("/auth/logout/", { method: "POST", token: access, body: JSON.stringify({ refresh }) }),

  getProfile: (access: string) =>
    request<BackendUser>("/auth/profile/", { token: access }),

  updateProfile: (access: string, p: { full_name?: string; theme_mode?: string }) =>
    request<BackendUser>("/auth/profile/", { method: "PATCH", token: access, body: JSON.stringify(p) }),

  changePassword: (access: string, p: { old_password: string; new_password: string }) =>
    request<void>("/auth/change-password/", { method: "POST", token: access, body: JSON.stringify(p) }),
};