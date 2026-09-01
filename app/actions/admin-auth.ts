"use server";

import {
  createSession,
  setSessionCookie,
  deleteSession,
  validateAccessCode,
  isAuthenticated,
} from "@/lib/admin-auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

interface AuthResult {
  success: boolean;
  message: string;
}

export async function adminLogin(code: string): Promise<AuthResult> {
  const rateLimitKey = "admin-login";
  const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);

  if (!rateLimit.success) {
    const minutes = Math.ceil(rateLimit.resetIn / 60_000);
    return {
      success: false,
      message: `Demasiados intentos. Intenta de nuevo en ${minutes} minuto${minutes > 1 ? "s" : ""}.`,
    };
  }

  if (!code || typeof code !== "string") {
    return { success: false, message: "Introduce el código de acceso." };
  }

  if (!validateAccessCode(code)) {
    return { success: false, message: "Código incorrecto." };
  }

  const session = createSession();
  await setSessionCookie(session);
  resetRateLimit(rateLimitKey);

  return { success: true, message: "Acceso concedido." };
}

export async function adminLogout(): Promise<void> {
  await deleteSession();
}

export async function checkAdminSession(): Promise<boolean> {
  return isAuthenticated();
}
