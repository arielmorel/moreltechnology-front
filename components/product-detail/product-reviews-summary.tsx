"use client";

import * as React from "react";
import { Star, ChevronDown, PenLine } from "lucide-react";
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
  const [showBreakdown, setShowBreakdown] = React.useState(false);

  if (totalReviews === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-4 mt-4 md:mt-6 shadow-sm">
      {/* Mobile: Compact Header */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-slate-900 leading-none">{averageRating.toFixed(1)}</p>
              <div className="flex gap-0.5 mt-1">
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
            <div className="text-left">
              <p className="text-xs text-slate-500">{totalReviews} reseñas</p>
            </div>
          </div>

          <button
            onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            <PenLine className="w-3 h-3" />
            Escribir
          </button>
        </div>

        {/* Collapsible Breakdown */}
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center gap-1.5 mt-3 text-[10px] font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ChevronDown className={cn("w-3 h-3 transition-transform", showBreakdown && "rotate-180")} />
          {showBreakdown ? "Ocultar desglose" : "Ver desglose de estrellas"}
        </button>

        {showBreakdown && (
          <div className="mt-3 space-y-1.5">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(r => Math.round(r.rating) === rating).length;
              const percentage = (count / totalReviews) * 100;
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 w-2">{rating}</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-400 w-4 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* First Review Preview */}
        {reviews.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">
                {reviews[0].customerName?.charAt(0) || "?"}
              </div>
              <span className="text-[10px] font-semibold text-slate-700">{reviews[0].customerName || "Anónimo"}</span>
              <div className="flex gap-0.5 ml-auto">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-2.5 h-2.5",
                      star <= reviews[0].rating ? "text-amber-400" : "text-slate-200"
                    )}
                    style={star <= reviews[0].rating ? { fill: "#fbbf24" } : { fill: "none" }}
                  />
                ))}
              </div>
            </div>
            <p className="text-[10px] text-slate-600 line-clamp-2">{reviews[0].comment}</p>
          </div>
        )}
      </div>

      {/* Desktop: Full Layout */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Reseñas</h3>
          <span className="text-[10px] text-slate-500">{totalReviews} opiniones</span>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900">{averageRating.toFixed(1)}</p>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-3.5 h-3.5",
                    star <= Math.round(averageRating) ? "text-amber-400" : "text-slate-200"
                  )}
                  style={star <= Math.round(averageRating) ? { fill: "#fbbf24" } : { fill: "none" }}
                />
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(r => Math.round(r.rating) === rating).length;
              const percentage = (count / totalReviews) * 100;
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 w-2">{rating}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-400 w-4 text-right">{count}</span>
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

        <button
          onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full mt-4 py-2.5 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Escribir una reseña
        </button>
      </div>
    </div>
  );
}
