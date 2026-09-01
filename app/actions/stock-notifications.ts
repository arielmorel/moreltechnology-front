"use server";

import { prisma } from "@/lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface NotifyResult {
  success: boolean;
  message: string;
}

export async function subscribeToStockNotification(
  productId: string,
  customerName: string | undefined,
  customerEmail: string
): Promise<NotifyResult> {
  try {
    const normalizedEmail = customerEmail.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return { success: false, message: "Correo electrónico inválido" };
    }

    if (!productId || productId.trim() === "") {
      return { success: false, message: "ID de producto inválido" };
    }

    const existing = await prisma.stockNotification.findUnique({
      where: {
        productId_customerEmail: {
          productId,
          customerEmail: normalizedEmail,
        },
      },
    });

    if (existing) {
      if (existing.status === "NOTIFIED") {
        return {
          success: false,
          message: "Ya te notificamos sobre este producto. Revisa tu correo.",
        };
      }

      if (existing.status === "PENDING") {
        return {
          success: false,
          message: "Ya estás en la lista de espera para este producto.",
        };
      }

      // Re-activate if CANCELLED or FAILED
      await prisma.stockNotification.update({
        where: { id: existing.id },
        data: {
          status: "PENDING",
          customerName: customerName?.trim() || existing.customerName,
          notifiedAt: null,
        },
      });

      return {
        success: true,
        message: "Te avisaremos por correo cuando este producto vuelva a estar disponible.",
      };
    }

    await prisma.stockNotification.create({
      data: {
        productId,
        customerName: customerName?.trim() || undefined,
        customerEmail: normalizedEmail,
        status: "PENDING",
      },
    });

    return {
      success: true,
      message: "Te avisaremos por correo cuando este producto vuelva a estar disponible.",
    };
  } catch (error) {
    console.error("Error creating stock notification:", error);
    return {
      success: false,
      message: "Error al procesar tu solicitud. Intenta de nuevo.",
    };
  }
}
