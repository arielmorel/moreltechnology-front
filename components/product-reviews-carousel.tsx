"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  title: string | null;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: Date;
}

interface ProductReviewsCarouselProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-transparent text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("es-DO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ProductReviewsCarousel({
  reviews,
  averageRating,
  totalReviews,
}: ProductReviewsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: reviews.length > 3,
    slidesToScroll: 1,
  });

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (reviews.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            Reseñas de clientes
            <span className="w-8 h-1 bg-primary/20 rounded-full" />
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-bold">{averageRating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({totalReviews} {totalReviews === 1 ? "reseña" : "reseñas"})
            </span>
          </div>
        </div>

        {reviews.length > 1 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <div className="h-full rounded-2xl border border-border/50 bg-card p-5 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <StarDisplay rating={review.rating} />
                  <Quote className="h-5 w-5 text-muted-foreground/20 shrink-0" />
                </div>

                {review.title && (
                  <h4 className="font-semibold text-sm mb-2">{review.title}</h4>
                )}

                <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-4">
                  {review.comment}
                </p>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                    {getInitials(review.customerName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {review.customerName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(review.createdAt)}</span>
                      {review.verifiedPurchase && (
                        <span className="flex items-center gap-0.5 text-green-600 dark:text-green-400">
                          <ShieldCheck className="h-3 w-3" />
                          Verificada
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
