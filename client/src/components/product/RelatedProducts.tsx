import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { useProducts, type ExtendedProduct } from "@/hooks/use-products";
import useEmblaCarousel from "embla-carousel-react";

interface RelatedProductsProps {
  currentProductId: number;
  category?: string;
}

type ProductWithVariant = ExtendedProduct & { variantId?: string };

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
    <div className="space-y-4 ">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={cn(
              "w-8 h-8 rounded-full border border-border flex items-center justify-center transition-colors",
              canScrollPrev
                ? "hover:bg-muted"
                : "opacity-40 cursor-not-allowed",
            )}
            data-testid={`button-${title.toLowerCase().replace(/\s+/g, "-")}-prev`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={cn(
              "w-8 h-8 rounded-full border border-border flex items-center justify-center transition-colors",
              canScrollNext
                ? "hover:bg-muted"
                : "opacity-40 cursor-not-allowed",
            )}
            data-testid={`button-${title.toLowerCase().replace(/\s+/g, "-")}-next`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-8 pb-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[220px] sm:w-[240px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RelatedProducts({
  currentProductId,
  category,
}: RelatedProductsProps) {
  const { data: allProducts } = useProducts();

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

  const youMayAlsoLike =
    allProducts
      ?.filter((p) => p.id !== currentProductId)
      .filter((p) => !category || p.category === category)
      .slice(0, 8) || [];

  const hasContent = recentlyViewed.length > 0 || youMayAlsoLike.length > 0;

  if (!hasContent) return null;

  return (
    <div className="mt-16 pt-8 border-t border-border/50 space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">You Might Also Like</h2>
      </div>

      {recentlyViewed.length > 0 && (
        <ProductSlider products={recentlyViewed} title="Recently Viewed" />
      )}

      {youMayAlsoLike.length > 0 && (
        <ProductSlider products={youMayAlsoLike} title="Best Sellers" />
      )}
    </div>
  );
}
