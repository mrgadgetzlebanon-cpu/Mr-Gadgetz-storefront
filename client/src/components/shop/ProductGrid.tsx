import { ProductCard } from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";
import { cn } from "@/lib/utils";
import type { Product } from "@shared/schema";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isFetching: boolean;
}

export function ProductGrid({
  products,
  isLoading,
  isFetching,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={6} />;
  }

  return (
    <div
      className={cn(
        "product-grid-cq grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 xl:gap-6 justify-items-center transition-opacity duration-200",
        isFetching && "opacity-50",
      )}
    >
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} variant="grid" />
        ))
      ) : (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
}
