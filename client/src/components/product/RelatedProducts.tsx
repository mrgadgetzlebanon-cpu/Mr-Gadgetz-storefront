import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { useProducts, type ExtendedProduct } from "@/hooks/use-products";
import useEmblaCarousel from "embla-carousel-react";

interface RelatedProductsProps {
  currentProductId: number;
  productType?: string | null;
  vendor?: string | null;
}

type ProductWithVariant = ExtendedProduct & { variantId?: string };

// Helper to shuffle the results so you don't always get the same 8
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function ProductSlider({
  products,
  title,
}: {
  products: ProductWithVariant[];
  title: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (products.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg">{title}</h3>
      </div>

      <div className="relative group/slider">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white dark:hover:bg-zinc-700",
            !canScrollPrev && "opacity-0 cursor-not-allowed",
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="overflow-hidden py-4" ref={emblaRef}>
          <div className="flex gap-8 sm:gap-6 md:gap-8 px-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[230px]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white dark:hover:bg-zinc-700",
            !canScrollNext && "opacity-0 cursor-not-allowed",
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function RelatedProducts({
  currentProductId,
  productType,
  vendor,
}: RelatedProductsProps) {
  const { data: allProducts } = useProducts();
  const normalizedType = productType?.trim();

  // Recently Viewed Logic
  const [recentlyViewed, setRecentlyViewed] = useState<ProductWithVariant[]>(
    [],
  );

  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored && allProducts) {
      try {
        const ids: number[] = JSON.parse(stored);
        const products: ProductWithVariant[] = [];
        for (const id of ids) {
          if (id === currentProductId) continue;
          const found = allProducts.find((p) => p.id === id);
          if (found) products.push(found);
          if (products.length >= 8) break;
        }
        setRecentlyViewed(products);
      } catch {
        setRecentlyViewed([]);
      }
    }
  }, [allProducts, currentProductId]);

  useEffect(() => {
    if (!currentProductId) return;
    const stored = localStorage.getItem("recentlyViewed");
    let ids: number[] = [];
    try {
      ids = stored ? JSON.parse(stored) : [];
    } catch {
      ids = [];
    }
    ids = ids.filter((id) => id !== currentProductId);
    ids.unshift(currentProductId);
    ids = ids.slice(0, 10);
    localStorage.setItem("recentlyViewed", JSON.stringify(ids));
  }, [currentProductId]);

  const currentProduct = useMemo(
    () => allProducts?.find((p) => p.id === currentProductId),
    [allProducts, currentProductId],
  );

  // 1. Related by TYPE (Priority)
  const relatedByType = useMemo(() => {
    const targetType =
      normalizedType?.toLowerCase() ||
      currentProduct?.productType?.toLowerCase();

    if (!targetType || !allProducts) return [];

    // STRICT FILTER: Match Product Type Exactly
    const results = allProducts.filter(
      (p) =>
        p.id !== currentProductId &&
        (p.productType?.toLowerCase() || "") === targetType,
    );

    return shuffleArray(results).slice(0, 8);
  }, [
    allProducts,
    currentProduct?.productType,
    currentProductId,
    normalizedType,
  ]);

  // 2. Fallback: Related by Collection (Only if Type fails)
  const relatedByCollection = useMemo(() => {
    if (!currentProduct?.category || !allProducts) return [];

    const results = allProducts.filter(
      (p) =>
        p.id !== currentProductId &&
        p.category === currentProduct.category &&
        p.category !== "Home page" &&
        p.category !== "All",
    );

    return shuffleArray(results).slice(0, 8);
  }, [allProducts, currentProduct?.category, currentProductId]);

  // LOGIC SWAP: Priority is now relatedByType
  const similarProducts =
    relatedByType.length > 0 ? relatedByType : relatedByCollection;

  const hasContent = similarProducts.length > 0 || recentlyViewed.length > 0;

  if (!hasContent) return null;

  return (
    <div className="mt-16 pt-8 border-t border-border/50 space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">You Might Also Like</h2>
      </div>

      {similarProducts.length > 0 && (
        <ProductSlider products={similarProducts} title="Similar Products" />
      )}

      {recentlyViewed.length > 0 && (
        <ProductSlider products={recentlyViewed} title="Recently Viewed" />
      )}
    </div>
  );
}
