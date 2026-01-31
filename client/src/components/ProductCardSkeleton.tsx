import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardSkeletonProps {
  variant?: "default" | "grid";
}

export function ProductCardSkeleton({
  variant = "default",
}: ProductCardSkeletonProps) {
  const sizeClasses =
    variant === "grid"
      ? "w-full max-w-[220px] lg:max-w-[240px]"
      : "w-full max-w-[220px] sm:max-w-[240px]";
  const heightClasses =
    variant === "grid" ? "h-[380px]" : "h-[360px] sm:h-[400px]";
  const mediaHeightClasses = variant === "grid" ? "h-[66%]" : "h-[70%]";

  return (
    <div
      className={`bg-white dark:bg-[#1a1a2e] rounded-xl overflow-hidden shadow-md mx-auto ${sizeClasses} ${heightClasses}`}
    >
      <div
        className={`relative overflow-hidden bg-muted/30 ${mediaHeightClasses}`}
      >
        <Skeleton className="w-full h-full" />
      </div>
      <div
        className="p-4 space-y-3 bg-[#fafafa] dark:bg-[#1e1e32]"
        style={{ height: "30%" }}
      >
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 xl:gap-6 justify-items-center">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} variant="grid" />
      ))}
    </div>
  );
}
