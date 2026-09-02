import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex gap-3 p-3 bg-white rounded-xl border border-slate-200">
      {/* Image skeleton */}
      <div className="w-[100px] h-[100px] shrink-0">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-3/4" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-2.5 w-12" />
            <Skeleton className="h-2.5 w-12" />
          </div>
          <div className="flex gap-1.5 mt-2">
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
        </div>
        <div className="mt-2 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
