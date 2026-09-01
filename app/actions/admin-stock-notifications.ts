"use server";

import { prisma } from "@/lib/db";
import { StockNotificationStatus } from "@prisma/client";

type NotificationWithCounts = {
  notifications: Array<{
    id: string;
    productId: string;
    customerName: string | null;
    customerEmail: string;
    status: StockNotificationStatus;
    notifiedAt: Date | null;
    createdAt: Date;
  }>;
  total: number;
  pendingCount: number;
  notifiedCount: number;
  cancelledCount: number;
  failedCount: number;
};

export async function getAdminStockNotifications(
  status?: StockNotificationStatus
): Promise<NotificationWithCounts> {
  const where = status ? { status } : {};

  const [notifications, total, pendingCount, notifiedCount, cancelledCount, failedCount] =
    await Promise.all([
      prisma.stockNotification.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.stockNotification.count({ where: {} }),
      prisma.stockNotification.count({ where: { status: "PENDING" } }),
      prisma.stockNotification.count({ where: { status: "NOTIFIED" } }),
      prisma.stockNotification.count({ where: { status: "CANCELLED" } }),
      prisma.stockNotification.count({ where: { status: "FAILED" } }),
    ]);

  return {
    notifications,
    total,
    pendingCount,
    notifiedCount,
    cancelledCount,
    failedCount,
  };
}

export async function updateStockNotificationStatus(
  id: string,
  newStatus: StockNotificationStatus
): Promise<{ success: boolean; message: string }> {
  try {
    const notification = await prisma.stockNotification.findUnique({
      where: { id },
    });

    if (!notification) {
      return { success: false, message: "Notificación no encontrada" };
    }

    await prisma.stockNotification.update({
      where: { id },
      data: {
        status: newStatus,
        ...(newStatus === "NOTIFIED" ? { notifiedAt: new Date() } : {}),
      },
    });

    return { success: true, message: "Estado actualizado correctamente" };
  } catch (error) {
    console.error("Error updating stock notification:", error);
    return { success: false, message: "Error al actualizar el estado" };
  }
}
