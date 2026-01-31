import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Grid,
  LayoutList,
} from "lucide-react";
import { usePaginatedProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

export function NewArrivals() {
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");
  const { data: result, isLoading } = usePaginatedProducts({
    handles: [],
    sortKey: "newest",
    first: 15,
  });
  const products = result?.products || [];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="h-6 w-24 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex gap-8 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[220px] sm:w-[240px] h-[360px] sm:h-[400px] bg-muted rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-white" data-testid="section-new-arrivals">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            New Arrivals
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex bg-muted p-1 rounded-full">
              <Button
                size="sm"
                variant={viewMode === "slider" ? "default" : "ghost"}
                className="rounded-full h-8 px-3"
                onClick={() => setViewMode("slider")}
                data-testid="new-arrivals-view-slider"
              >
                <LayoutList className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                className="rounded-full h-8 px-3"
                onClick={() => setViewMode("grid")}
                data-testid="new-arrivals-view-grid"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
            <Link
              href="/shop?sort=newest"
              className="inline-flex items-center gap-2 text-[#0c57ef] hover:underline font-medium"
              data-testid="link-view-all-new"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {viewMode === "slider" ? (
          <div className="relative group/slider">
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white dark:hover:bg-zinc-700"
              data-testid="button-slider-prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="overflow-hidden py-4" ref={emblaRef}>
              <div className="flex gap-8 px-2">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex-shrink-0 w-[220px] sm:w-[240px]"
                  >
                    <ProductCard product={product} showNewTag />
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white dark:hover:bg-zinc-700"
              data-testid="button-slider-next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 xl:gap-6 justify-items-center">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} showNewTag variant="grid" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default NewArrivals;
