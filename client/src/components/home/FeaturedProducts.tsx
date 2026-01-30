import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "wouter";
import { ChevronRight, Grid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Product } from "@shared/schema";

interface FeaturedProductsProps {
  products: Product[];
  isLoading: boolean;
}

export function FeaturedProducts({
  products,
  isLoading,
}: FeaturedProductsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "slider">("grid");
  const [emblaRef] = useEmblaCarousel({ dragFree: true, align: "start" });

  return (
    <section className="py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Trending Now
            </h2>
            <p className="text-muted-foreground">
              Our most popular products this week.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-muted p-1 rounded-full">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                className="rounded-full h-8 px-3"
                onClick={() => setViewMode("grid")}
                data-testid="button-view-grid"
              >
                <Grid className="w-4 h-4 mr-1" /> Grid
              </Button>
              <Button
                size="sm"
                variant={viewMode === "slider" ? "default" : "ghost"}
                className="rounded-full h-8 px-3"
                onClick={() => setViewMode("slider")}
                data-testid="button-view-slider"
              >
                <LayoutList className="w-4 h-4 mr-1" /> Slider
              </Button>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center text-sm font-medium text-[#2f91f0] hover:text-[#0c57ef] transition-colors"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8 justify-items-center">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} variant="grid" />
            ))}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8 justify-items-center">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden py-4" ref={emblaRef}>
            <div className="flex gap-8 px-2">
              {products.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  className="flex-[0_0_320px] sm:flex-[0_0_350px] min-w-0"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
