import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { ProductCard } from "@/components/ProductCard";
import {
  usePaginatedProducts,
  useGroupedCollections,
} from "@/hooks/use-products";
import { cn } from "@/lib/utils";

interface Subcategory {
  id: string;
  label: string;
  filterFn?: (product: any) => boolean;
  collectionHandle?: string;
}

interface CategoryProductSectionProps {
  title: string;
  subcategories: Subcategory[];
  parentCategory?: string;
  viewAllLink?: string;
  hasSubsections?: boolean;
  className?: string;
}

export function CategoryProductSection({
  title,
  subcategories,
  parentCategory,
  viewAllLink,
  hasSubsections = true,
  className,
}: CategoryProductSectionProps) {
  const [activeSubcategory, setActiveSubcategory] = useState<string>(
    subcategories[0]?.id || "",
  );
  const [showProducts, setShowProducts] = useState(!hasSubsections);

  const { data: categoryStructure } = useGroupedCollections();

  const categoryHandles = useMemo(() => {
    if (!parentCategory || !categoryStructure) return [];
    const category = categoryStructure.grouped.find(
      (g) => g.parent === parentCategory,
    );
    return category?.parentHandles || [];
  }, [parentCategory, categoryStructure]);

  const { data: result, isLoading } = usePaginatedProducts({
    handles: categoryHandles,
    sortKey: "best_selling",
    first: 50,
  });

  const allProducts = result?.products || [];

  const filteredProducts = useMemo(() => {
    if (!hasSubsections) return allProducts.slice(0, 15);

    const activeSub = subcategories.find((s) => s.id === activeSubcategory);
    if (!activeSub) return [];

    if (activeSub.filterFn) {
      return allProducts.filter(activeSub.filterFn).slice(0, 15);
    }

    return allProducts.slice(0, 15);
  }, [allProducts, activeSubcategory, subcategories, hasSubsections]);

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

  useEffect(() => {
    if (hasSubsections && activeSubcategory) {
      setShowProducts(true);
    }
  }, [activeSubcategory, hasSubsections]);

  const handleSubcategoryClick = (id: string) => {
    setActiveSubcategory(id);
    if (emblaApi) {
      emblaApi.scrollTo(0);
    }
  };

  if (isLoading && !hasSubsections) {
    return (
      <section className={cn("py-12", className)}>
        <div className="container mx-auto px-4">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-8" />
          <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[230px] h-[360px] sm:h-[400px] bg-muted rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn("py-12", className)}
      data-testid={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            {title}
          </h2>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-2 text-[#0c57ef] hover:underline font-medium text-sm"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </motion.div>

        {hasSubsections && subcategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide mb-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubcategoryClick(sub.id)}
                className={cn(
                  "flex-shrink-0 px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all duration-300",
                  activeSubcategory === sub.id
                    ? "bg-[#0c57ef] border-[#0c57ef] text-white shadow-lg shadow-[#0c57ef]/30"
                    : "bg-transparent border-gray-300 dark:border-gray-600 text-foreground hover:border-[#0c57ef] hover:text-[#0c57ef]",
                )}
                data-testid={`subcategory-${sub.id}`}
              >
                {sub.label}
              </button>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {(showProducts || !hasSubsections) && (
            <motion.div
              key={activeSubcategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative group/slider"
            >
              {filteredProducts.length > 0 ? (
                <>
                  <button
                    onClick={scrollPrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white dark:hover:bg-zinc-700"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="overflow-hidden py-4" ref={emblaRef}>
                    <div className="flex gap-4 sm:gap-6 md:gap-8 px-2">
                      {filteredProducts.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
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
                </>
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
                  No products found in this category
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default CategoryProductSection;
