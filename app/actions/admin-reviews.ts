"use server";

import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/admin-auth";
import { ReviewStatus } from "@prisma/client";

interface ReviewResult {
  success: boolean;
  message: string;
}

async function validateAdmin(): Promise<ReviewResult | null> {
  const authed = await isAuthenticated();
  if (!authed) {
    return { success: false, message: "Sesión no válida." };
  }
  return null;
}

export async function getAdminReviews(
  status?: "ALL" | ReviewStatus
): Promise<{
  reviews: Array<{
    id: string;
    productId: number;
    customerName: string;
    customerEmail: string;
    rating: number;
    title: string | null;
    comment: string;
    status: ReviewStatus;
    verifiedPurchase: boolean;
    createdAt: Date;
  }>;
  total: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}> {
  const authError = await validateAdmin();
  if (authError) {
    return { reviews: [], total: 0, pendingCount: 0, approvedCount: 0, rejectedCount: 0 };
  }

  const where = status && status !== "ALL" ? { status } : {};

  const [reviews, total, pendingCount, approvedCount, rejectedCount] =
    await Promise.all([
      prisma.productReview.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.productReview.count({ where }),
      prisma.productReview.count({ where: { status: "PENDING" } }),
      prisma.productReview.count({ where: { status: "APPROVED" } }),
      prisma.productReview.count({ where: { status: "REJECTED" } }),
    ]);

  return { reviews, total, pendingCount, approvedCount, rejectedCount };
}

export async function updateReviewStatus(
  reviewId: string,
  newStatus: ReviewStatus
): Promise<ReviewResult> {
  const authError = await validateAdmin();
  if (authError) return authError;

  if (!reviewId || typeof reviewId !== "string") {
    return { success: false, message: "ID de reseña inválido." };
  }

  if (!["APPROVED", "REJECTED"].includes(newStatus)) {
    return { success: false, message: "Estado no válido." };
  }

  try {
    const review = await prisma.productReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return { success: false, message: "Reseña no encontrada." };
    }

    await prisma.productReview.update({
      where: { id: reviewId },
      data: { status: newStatus },
    });

    const label = newStatus === "APPROVED" ? "aprobada" : "rechazada";
    return { success: true, message: `Reseña ${label} correctamente.` };
  } catch (error) {
    console.error("Error updating review status:", error);
    return { success: false, message: "Error al actualizar la reseña." };
  }
}

export async function getDashboardStats(): Promise<{
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
}> {
  const authError = await validateAdmin();
  if (authError) {
    return { totalReviews: 0, pendingReviews: 0, approvedReviews: 0, rejectedReviews: 0 };
  }

  const [totalReviews, pendingReviews, approvedReviews, rejectedReviews] =
    await Promise.all([
      prisma.productReview.count(),
      prisma.productReview.count({ where: { status: "PENDING" } }),
      prisma.productReview.count({ where: { status: "APPROVED" } }),
      prisma.productReview.count({ where: { status: "REJECTED" } }),
    ]);

  return { totalReviews, pendingReviews, approvedReviews, rejectedReviews };
}
