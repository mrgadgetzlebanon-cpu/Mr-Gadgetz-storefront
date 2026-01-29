import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div 
      className="bg-white dark:bg-[#1a1a2e] rounded-xl overflow-hidden shadow-md w-full max-w-[350px] mx-auto"
      style={{ height: '500px' }}
    >
      <div className="relative overflow-hidden bg-muted/30" style={{ height: '70%' }}>
        <Skeleton className="w-full h-full" />
      </div>
      <div 
        className="p-4 space-y-3 bg-[#fafafa] dark:bg-[#1e1e32]" 
        style={{ height: '30%' }}
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
