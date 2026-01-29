import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-4 w-24 mb-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-3/4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          
          <div className="space-y-3">
            <Skeleton className="h-4 w-16" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-10 h-10 rounded-full" />
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-32 rounded-full" />
              <Skeleton className="h-12 flex-1 rounded-full" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
