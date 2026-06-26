import type { AuthUser, Role } from "./types";

const KEY = "inventory.auth";

export function getAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuth(user: AuthUser) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export function getToken(): string | null {
  return getAuth()?.token ?? null;
}

export function hasRole(...roles: Role[]): boolean {
  const user = getAuth();
  if (!user) return false;
  return user.roles.some((role) => roles.includes(role));
}

export function isManagerPlus() {
  return hasRole("MANAGER", "ADMIN");
}

export function isAdmin() {
  return hasRole("ADMIN");
}
