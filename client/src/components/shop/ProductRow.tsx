import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductRowProps {
  title: string;
  products: Product[];
  isLoading?: boolean;
  viewAllLink?: string;
  showNewTag?: boolean;
}

export function ProductRow({ title, products, isLoading, viewAllLink, showNewTag = false }: ProductRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 400);
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="min-w-[250px]">
              <Skeleton className="h-[280px] rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        {viewAllLink && (
          <Link 
            href={viewAllLink}
            className="flex items-center gap-1 text-sm font-medium text-brand-blue hover:text-brand-azure transition-colors group"
            data-testid={`view-all-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      <div className="relative group/row">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 border border-border shadow-lg flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-muted"
            aria-label="Scroll left"
            data-testid={`scroll-left-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
              className="min-w-[300px] md:min-w-[350px] snap-start"
            >
              <ProductCard product={product} showNewTag={showNewTag} />
            </motion.div>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 border border-border shadow-lg flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-muted"
            aria-label="Scroll right"
            data-testid={`scroll-right-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
