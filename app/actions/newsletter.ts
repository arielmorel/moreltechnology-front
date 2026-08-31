"use server";

import { prisma } from "@/lib/db";
import { SubscriptionSource } from "@prisma/client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONSENT_VERSION = "v1";

interface SubscribeResult {
  success: boolean;
  message: string;
}

export async function subscribeToNewsletter(
  email: string,
  source: SubscriptionSource = "WEBSITE"
): Promise<SubscribeResult> {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return { success: false, message: "Email inválido" };
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing && existing.status === "SUBSCRIBED") {
      return { success: false, message: "Ya estás suscrito a nuestro newsletter" };
    }

    if (existing && existing.status === "UNSUBSCRIBED") {
      await prisma.newsletterSubscriber.update({
        where: { email: normalizedEmail },
        data: {
          status: "SUBSCRIBED",
          source,
          consentGivenAt: new Date(),
          consentVersion: CONSENT_VERSION,
          subscribedAt: new Date(),
          unsubscribedAt: null,
        },
      });
      return { success: true, message: "¡Te has re-suscrito correctamente!" };
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
        status: "SUBSCRIBED",
        source,
        consentGivenAt: new Date(),
        consentVersion: CONSENT_VERSION,
      },
    });

    return { success: true, message: "¡Gracias por suscribirte!" };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return { success: false, message: "Error al procesar tu suscripción" };
  }
}

export async function unsubscribeFromNewsletter(
  email: string
): Promise<SubscribeResult> {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return { success: false, message: "Email inválido" };
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (!existing) {
      return { success: false, message: "No se encontró una suscripción con ese email" };
    }

    if (existing.status === "UNSUBSCRIBED") {
      return { success: false, message: "Ya estás desuscrito" };
    }

    await prisma.newsletterSubscriber.update({
      where: { email: normalizedEmail },
      data: {
        status: "UNSUBSCRIBED",
        unsubscribedAt: new Date(),
      },
    });

    return { success: true, message: "Te has desuscrito correctamente" };
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error);
    return { success: false, message: "Error al procesar tu desuscripción" };
  }
}
