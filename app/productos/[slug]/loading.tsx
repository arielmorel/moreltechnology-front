export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-48 bg-muted rounded" />
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square md:aspect-[4/3] bg-muted rounded-3xl" />
            <div className="space-y-6">
              <div className="h-12 w-3/4 bg-muted rounded" />
              <div className="h-6 w-1/4 bg-muted rounded" />
              <div className="h-32 w-full bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}