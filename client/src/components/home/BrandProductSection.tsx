import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { useCollectionProducts } from "@/hooks/use-products";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BrandTab {
  id: string;
  label: string;
  collectionHandle: string;
}

interface BrandProductSectionProps {
  title: string;
  tabs: BrandTab[];
  viewAllLink?: string;
  className?: string;
  bgClassName?: string;
}

export function BrandProductSection({
  title,
  tabs,
  viewAllLink,
  className,
  bgClassName,
}: BrandProductSectionProps) {
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || "");
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");

  const ribbonRef = useRef<HTMLDivElement>(null);
  const [isRibbonScrollable, setIsRibbonScrollable] = useState(false);
  const [isRibbonDragging, setIsRibbonDragging] = useState(false);
  const ribbonStartX = useRef(0);
  const ribbonScrollLeft = useRef(0);
  const hasDraggedRef = useRef(false);
  const dragThreshold = 5;

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) || tabs[0],
    [tabs, activeTabId],
  );

  const { data, isLoading } = useCollectionProducts(
    activeTab?.collectionHandle || "",
  );

  const products = data?.products || [];

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
    if (emblaApi) {
      emblaApi.scrollTo(0);
    }
  }, [activeTabId, emblaApi]);

  useEffect(() => {
    const checkScrollable = () => {
      if (ribbonRef.current) {
        const { scrollWidth, clientWidth } = ribbonRef.current;
        setIsRibbonScrollable(scrollWidth > clientWidth);
      }
    };
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [tabs]);

  useEffect(() => {
    const el = ribbonRef.current;
    if (!el) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (!isRibbonScrollable) return;
      setIsRibbonDragging(true);
      hasDraggedRef.current = false;
      ribbonStartX.current = e.pageX - el.offsetLeft;
      ribbonScrollLeft.current = el.scrollLeft;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isRibbonDragging) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const delta = Math.abs(x - ribbonStartX.current);
      if (delta > dragThreshold) {
        hasDraggedRef.current = true;
      }
      const walk = (x - ribbonStartX.current) * 1.5;
      el.scrollLeft = ribbonScrollLeft.current - walk;
    };

    const handleMouseUp = () => {
      setIsRibbonDragging(false);
    };

    el.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isRibbonScrollable, isRibbonDragging]);

  const handleTabClick = (id: string) => {
    if (!hasDraggedRef.current) {
      setActiveTabId(id);
    }
    hasDraggedRef.current = false;
  };

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

        {tabs.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            ref={ribbonRef}
            className={cn(
              "flex gap-3 md:gap-4 pb-4 mb-6 select-none",
              "overflow-x-auto scrollbar-hide",
              "lg:justify-center lg:flex-wrap lg:overflow-visible",
              isRibbonScrollable && !isRibbonDragging && "cursor-grab",
              isRibbonDragging && "cursor-grabbing",
            )}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "flex-shrink-0 px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all duration-300",
                  activeTabId === tab.id
                    ? "bg-[#0c57ef] border-[#0c57ef] text-white shadow-lg shadow-[#0c57ef]/30"
                    : "bg-transparent border-gray-300 dark:border-gray-600 text-foreground hover:border-[#0c57ef] hover:text-[#0c57ef]",
                )}
                data-testid={`${sectionId}-tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTabId}-${viewMode}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
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
                    <div className="flex gap-8 px-2">
                      {products.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.03 }}
                          className="flex-shrink-0 w-[220px] sm:w-[240px]"
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
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <ProductCard product={product} variant="grid" />
                    </motion.div>
                  ))}
                </div>
              )
            ) : isLoading ? (
              <div className="flex gap-8 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-[220px] sm:w-[240px] h-[360px] sm:h-[400px] bg-muted rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No products found
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default BrandProductSection;
