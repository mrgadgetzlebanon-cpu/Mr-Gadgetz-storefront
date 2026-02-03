import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Grid,
  LayoutList,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { ProductCard } from "@/components/ProductCard";
import {
  usePaginatedProducts,
  useGroupedCollections,
} from "@/hooks/use-products";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DirectProductSectionProps {
  title: string;
  parentCategory?: string;
  parentCategories?: string[];
  brandFilter?: string;
  viewAllLink?: string;
  className?: string;
  bgClassName?: string;
}

export function DirectProductSection({
  title,
  parentCategory,
  parentCategories,
  brandFilter,
  viewAllLink,
  className,
  bgClassName,
}: DirectProductSectionProps) {
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");
  const { data: categoryStructure } = useGroupedCollections();

  const categoryHandles = useMemo(() => {
    if (!categoryStructure) return [];

    const categoriesToSearch =
      parentCategories || (parentCategory ? [parentCategory] : []);
    if (categoriesToSearch.length === 0) return [];

    const handles: string[] = [];
    for (const cat of categoriesToSearch) {
      const category = categoryStructure.grouped.find((g) => g.parent === cat);

      if (category) {
        handles.push(...category.parentHandles);
      } else {
        handles.push(cat);
      }
    }
    return handles;
  }, [parentCategory, parentCategories, categoryStructure]);

  const { data: result, isLoading } = usePaginatedProducts({
    handles: categoryHandles.length > 0 ? categoryHandles : [],
    sortKey: "best_selling",
    first: 30,
  });

  const products = useMemo(() => {
    const allProducts = result?.products || [];
    if (brandFilter) {
      const brandLower = brandFilter.toLowerCase();
      return allProducts
        .filter(
          (p) =>
            p.brand?.toLowerCase().includes(brandLower) ||
            p.name.toLowerCase().includes(brandLower),
        )
        .slice(0, 15);
    }
    return allProducts.slice(0, 15);
  }, [result, brandFilter]);

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

  const sectionId = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <section
      className={cn("py-12", bgClassName, className)}
      data-testid={`section-${sectionId}`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            {title}
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex bg-muted p-1 rounded-full">
              <Button
                size="sm"
                variant={viewMode === "slider" ? "default" : "ghost"}
                className="rounded-full h-8 px-3"
                onClick={() => setViewMode("slider")}
                data-testid={`${sectionId}-view-slider`}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                className="rounded-full h-8 px-3"
                onClick={() => setViewMode("grid")}
                data-testid={`${sectionId}-view-grid`}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
            {viewAllLink && (
              <Link
                href={viewAllLink}
                className="inline-flex items-center gap-2 text-[#0c57ef] hover:underline font-medium text-sm"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </motion.div>

        {products.length > 0 ? (
          viewMode === "slider" ? (
            <div className="relative group/slider">
              <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white dark:hover:bg-zinc-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="overflow-hidden py-4" ref={emblaRef}>
                <div className="flex gap-4 sm:gap-6 md:gap-8 px-2">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.03 }}
                      className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[230px]"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </div>

              <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white dark:hover:bg-zinc-700"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 xl:gap-6 justify-items-center">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                >
                  <ProductCard product={product} variant="grid" />
                </motion.div>
              ))}
            </div>
          )
        ) : isLoading ? (
          <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[230px] h-[360px] sm:h-[400px] bg-muted rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No products available
          </div>
        )}
      </div>
    </section>
  );
}

export default DirectProductSection;
