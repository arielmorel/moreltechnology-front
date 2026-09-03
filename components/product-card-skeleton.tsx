import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex bg-white rounded-xl border border-slate-200 p-3 gap-3 lg:p-0 lg:gap-0">
      {/* Image skeleton */}
      <div className="shrink-0 w-[110px] h-[110px] rounded-lg sm:w-[130px] sm:h-[130px] lg:w-[170px] lg:h-full lg:rounded-l-xl lg:rounded-tr-none">
        <Skeleton className="w-full h-full rounded-lg lg:rounded-l-xl lg:rounded-tr-none" />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 flex flex-col justify-between lg:py-3 lg:pr-3 lg:pl-4">
        <div className="space-y-1.5">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-3/4" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-2.5 w-20" />
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
