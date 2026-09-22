export function CarouselSectionSkeleton({ title }: { title: string }) {
  return (
    <section className="overflow-hidden py-6 md:py-16">
      <span className="sr-only">{title}</span>
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-4 md:mb-10">
          <div className="h-6 w-28 bg-muted rounded-full mb-3 animate-pulse" />
          <div className="h-8 md:h-10 w-56 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex gap-3 overflow-hidden pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-[75%] sm:w-[45%] md:w-[31%] xl:w-[24%]">
              <div className="rounded-xl border border-border bg-muted aspect-[4/5] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}