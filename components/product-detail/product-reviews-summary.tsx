"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  title: string | null;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: Date;
}

interface ProductReviewsSummaryProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function ProductReviewsSummary({
  reviews,
  averageRating,
  totalReviews,
}: ProductReviewsSummaryProps) {
  if (totalReviews === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mt-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Reseñas</h3>
        <span className="text-[10px] text-slate-500">{totalReviews} opiniones</span>
      </div>

      {/* Rating Summary */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900">{averageRating.toFixed(1)}</p>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-3 h-3",
                  star <= Math.round(averageRating) ? "text-amber-400" : "text-slate-200"
                )}
                style={star <= Math.round(averageRating) ? { fill: "#fbbf24" } : { fill: "none" }}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter(r => Math.round(r.rating) === rating).length;
            const percentage = (count / totalReviews) * 100;
            return (
              <div key={rating} className="flex items-center gap-1.5">
                <span className="text-[9px] text-slate-400 w-2">{rating}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyword Filters */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {["Pantalla", "Batería", "Rápido", "Calidad", "precio"].map((keyword) => (
          <button
            key={keyword}
            className="text-[9px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full hover:bg-slate-200 transition-colors capitalize"
          >
            {keyword}
          </button>
        ))}
      </div>

      {/* Key Reviews Preview */}
      <div className="space-y-3">
        {reviews.slice(0, 2).map((review) => (
          <div key={review.id} className="border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">
                {review.customerName?.charAt(0) || "?"}
              </div>
              <span className="text-[10px] font-semibold text-slate-700">{review.customerName || "Anónimo"}</span>
              <div className="flex gap-0.5 ml-auto">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-2.5 h-2.5",
                      star <= review.rating ? "text-amber-400" : "text-slate-200"
                    )}
                    style={star <= review.rating ? { fill: "#fbbf24" } : { fill: "none" }}
                  />
                ))}
              </div>
            </div>
            <p className="text-[10px] text-slate-600 line-clamp-2">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Write Review CTA */}
      <button
        onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
        className="w-full mt-4 py-2.5 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
      >
        Escribir una reseña
      </button>
    </div>
  );
}
