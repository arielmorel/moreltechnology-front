import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ rating }: { rating: number }) {
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
