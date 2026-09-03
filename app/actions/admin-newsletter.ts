"use server";

import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/admin-auth";
import { SubscriberStatus } from "@prisma/client";

interface ActionResult {
  success: boolean;
  message: string;
}

async function validateAdmin(): Promise<ActionResult | null> {
  const authed = await isAuthenticated();
  if (!authed) {
    return { success: false, message: "Sesión no válida." };
  }
  return null;
}

export type NewsletterSubscriberData = {
  id: string;
  email: string;
  status: SubscriberStatus;
  source: string;
  subscribedAt: Date;
  unsubscribedAt: Date | null;
  createdAt: Date;
};

export async function getNewsletterSubscribers(
  status?: "ALL" | SubscriberStatus
): Promise<{
  subscribers: NewsletterSubscriberData[];
  total: number;
  subscribedCount: number;
  unsubscribedCount: number;
}> {
  const authError = await validateAdmin();
  if (authError) {
    return { subscribers: [], total: 0, subscribedCount: 0, unsubscribedCount: 0 };
  }

  const where = status && status !== "ALL" ? { status } : {};

  const [subscribers, total, subscribedCount, unsubscribedCount] =
    await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.newsletterSubscriber.count({ where }),
      prisma.newsletterSubscriber.count({ where: { status: "SUBSCRIBED" } }),
      prisma.newsletterSubscriber.count({ where: { status: "UNSUBSCRIBED" } }),
    ]);

  return { subscribers, total, subscribedCount, unsubscribedCount };
}
