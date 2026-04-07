import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { User } from "../types";
import { authService, normalizeUser, session, type AuthTokens } from "../lib/authService";

interface Ctx {
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<User>) => Promise<void>;
  changePassword: (oldPw: string, newPw: string) => Promise<void>;
}

const AuthCtx = createContext<Ctx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const u = session.loadUser();
    const t = session.loadTokens();
    if (u && t) { setUser(u); setTokens(t); }
    setLoading(false);
  }, []);

  // Sync profile from backend when we get a fresh token
  useEffect(() => {
    if (!tokens?.access) return;
    authService.getProfile(tokens.access)
      .then((b) => {
        // ✅ FIX 1: load saved user from localStorage first so isPremium is preserved
        const saved = session.loadUser();
        // ✅ FIX 2: also check the standalone isPremium key that survives logout
        const storedPremium = JSON.parse(localStorage.getItem("isPremium") ?? "false");
        const merged = saved ? { ...saved, isPremium: saved.isPremium || storedPremium } : null;
        const updated = normalizeUser(b, merged ?? user);
        setUser(updated);
        session.save(updated, tokens);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens?.access]);

  function persist(u: User, t: AuthTokens) { setUser(u); setTokens(t); session.save(u, t); }

  async function login(email: string, password: string) {
    const res = await authService.login(email, password);
    persist(normalizeUser(res.user), res.tokens);
    toast.success("Welcome back!");
  }

  async function register(email: string, password: string, confirmPassword: string, name: string) {
    const res = await authService.register({ email, password, confirm_password: confirmPassword, full_name: name });
    persist(normalizeUser(res.user), res.tokens);
    toast.success("Account created successfully!");
  }

  async function logout() {
    try { if (tokens) await authService.logout(tokens.refresh, tokens.access); } finally {
      // ✅ FIX 2: preserve isPremium before clearing the session
      const isPremium = user?.isPremium ?? false;
      setUser(null); setTokens(null); session.clear();
      localStorage.setItem("isPremium", JSON.stringify(isPremium));
      toast.success("Logged out successfully");
    }
  }

  async function updateProfile(patch: Partial<User>) {
    if (!user || !tokens) return;
    const b = await authService.updateProfile(tokens.access, { full_name: patch.name, theme_mode: patch.themeMode });
    const updated: User = { ...normalizeUser(b, user), isPremium: patch.isPremium ?? user.isPremium, language: patch.language ?? user.language };
    setUser(updated);
    session.save(updated, tokens);
    // ✅ Keep the standalone key in sync too
    localStorage.setItem("isPremium", JSON.stringify(updated.isPremium));
  }

  async function changePassword(oldPw: string, newPw: string) {
    if (!tokens) return;
    await authService.changePassword(tokens.access, { old_password: oldPw, new_password: newPw });
    toast.success("Password changed successfully");
  }

  return (
    <AuthCtx.Provider value={{ user, tokens, loading, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth(): Ctx {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}