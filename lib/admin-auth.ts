import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface AdminSession {
  token: string;
  createdAt: number;
  expiresAt: number;
}

export function createSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function createSession(): AdminSession {
  const token = createSessionToken();
  const now = Date.now();
  return {
    token,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  };
}

export async function setSessionCookie(session: AdminSession): Promise<void> {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionData) return null;

  try {
    const session: AdminSession = JSON.parse(sessionData);
    if (Date.now() > session.expiresAt) {
      await deleteSession();
      return null;
    }
    return session;
  } catch {
    await deleteSession();
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

export function validateAccessCode(code: string): boolean {
  const validCode = process.env.ADMIN_ACCESS_CODE;
  if (!validCode) return false;
  return code === validCode;
}
