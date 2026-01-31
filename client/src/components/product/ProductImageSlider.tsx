import { useCallback, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { ProductVariantNode } from "@/hooks/use-product-variant";

interface ProductImageSliderProps {
  images: string[];
  productName: string;
  activeVariant?: ProductVariantNode | null;
}

export function ProductImageSlider({
  images,
  productName,
  activeVariant,
}: ProductImageSliderProps) {
  const normalizedImages = useMemo(() => {
    // Dedupe while preserving order
    const seen = new Set<string>();
    return images.filter((img) => {
      if (!img || seen.has(img)) return false;
      seen.add(img);
      return true;
    });
  }, [images]);

  const hasMultiple = normalizedImages.length > 1;

  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: hasMultiple, watchDrag: hasMultiple },
    hasMultiple ? [autoplayPlugin] : [],
  );

  const resetAutoplay = useCallback(() => {
    const plugins = emblaApi?.plugins?.();
    const autoplay = plugins?.autoplay;
    autoplay?.reset?.();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      resetAutoplay();
    }
  }, [emblaApi, resetAutoplay]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      resetAutoplay();
    }
  }, [emblaApi, resetAutoplay]);

  useEffect(() => {
    if (!emblaApi || !activeVariant?.image) return;
    const index = normalizedImages.findIndex(
      (img) => img === activeVariant.image,
    );
    if (index >= 0) {
      emblaApi.scrollTo(index);
      resetAutoplay();
    }
  }, [activeVariant?.image, emblaApi, normalizedImages, resetAutoplay]);

  return (
    <div className="space-y-4">
      <div className="relative z-10">
        <div
          className="overflow-hidden rounded-2xl bg-transparent"
          ref={emblaRef}
        >
          <div className="flex">
            {normalizedImages.map((img, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0">
                <div className="aspect-square p-6 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/30">
                  <img
                    src={img}
                    alt={`${productName} ${i + 1}`}
                    className="w-full h-full object-contain"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {hasMultiple && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-zinc-800 transition-colors"
              data-testid="button-gallery-prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-zinc-800 transition-colors"
              data-testid="button-gallery-next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
