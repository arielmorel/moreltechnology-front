"use server";

import { prisma } from "@/lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CreateReviewInput {
  productId: number;
  name: string;
  email: string;
  rating: number;
  title?: string;
  comment: string;
}

interface ReviewResult {
  success: boolean;
  message: string;
}

export async function createProductReview(
  input: CreateReviewInput
): Promise<ReviewResult> {
  try {
    const { productId, name, email, rating, title, comment } = input;

    if (!productId || typeof productId !== "number" || productId <= 0) {
      return { success: false, message: "ID de producto inválido." };
    }

    const trimmedName = name?.trim();
    if (!trimmedName || trimmedName.length < 2) {
      return {
        success: false,
        message: "El nombre debe tener al menos 2 caracteres.",
      };
    }

    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      return { success: false, message: "Introduce un correo electrónico válido." };
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return {
        success: false,
        message: "La valoración debe ser un número entero entre 1 y 5.",
      };
    }

    const trimmedComment = comment?.trim();
    if (!trimmedComment || trimmedComment.length < 10) {
      return {
        success: false,
        message: "El comentario debe tener al menos 10 caracteres.",
      };
    }

    await prisma.productReview.create({
      data: {
        productId,
        customerName: trimmedName,
        customerEmail: normalizedEmail,
        rating,
        title: title?.trim() || null,
        comment: trimmedComment,
        verifiedPurchase: false,
        status: "PENDING",
      },
    });

    return {
      success: true,
      message: "¡Reseña enviada! Será publicada tras ser revisada por nuestro equipo.",
    };
  } catch (error) {
    console.error("Error creating product review:", error);
    return {
      success: false,
      message: "Error al enviar la reseña. Intenta de nuevo.",
    };
  }
}

export async function getApprovedReviews(productId: number) {
  try {
    const reviews = await prisma.productReview.findMany({
      where: {
        productId,
        status: "APPROVED",
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        customerName: true,
        rating: true,
        title: true,
        comment: true,
        verifiedPurchase: true,
        createdAt: true,
      },
    });

    const stats = await prisma.productReview.aggregate({
      where: { productId, status: "APPROVED" },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      reviews,
      averageRating: stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : 0,
      totalReviews: stats._count.rating,
    };
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    return { reviews: [], averageRating: 0, totalReviews: 0 };
  }
}
