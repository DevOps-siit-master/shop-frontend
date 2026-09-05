import { AUTH_API } from "./config";

const TOKEN_KEY = "shophub_access_token";

export interface AuthUser {
  userId: string;
  role?: string;
  exp?: number;
}

export async function login(email: string, password: string): Promise<void> {
  const res = await fetch(`${AUTH_API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error(
      res.status === 401 ? "Invalid email or password." : `Login failed: ${res.status}`,
    );
  }
  const { accessToken } = (await res.json()) as { accessToken: string };
  localStorage.setItem(TOKEN_KEY, accessToken);
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Decodes the token's payload without verifying its signature — good enough
 * to gate UI routes. The backend independently verifies the signature on
 * every request, which is the actual security boundary.
 */
export function getUser(): AuthUser | null {
  const token = getToken();
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    // JWTs are base64url, not base64 — atob() needs +/ and padding restored.
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const user = JSON.parse(atob(padded)) as AuthUser;
    if (user.exp && user.exp * 1000 < Date.now()) {
      logout();
      return null;
    }
    return user;
  } catch {
    logout();
    return null;
  }
}

export function isShopOwner(): boolean {
  return getUser()?.role === "shop_owner";
}
