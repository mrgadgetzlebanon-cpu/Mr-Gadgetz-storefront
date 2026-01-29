import { useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

interface ProductImageSliderProps {
  images: string[];
  productName: string;
}

export function ProductImageSlider({ images, productName }: ProductImageSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const autoSlide = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);

    return () => {
      clearInterval(autoSlide);
    };
  }, [emblaApi]);

  return (
    <div className="space-y-4">
      <div className="relative z-10">
        <div 
          className="overflow-hidden rounded-2xl bg-transparent" 
          ref={emblaRef}
        >
          <div className="flex">
            {images.map((img, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0">
                <div className="aspect-square p-6 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/30">
                  <img 
                    src={img} 
                    alt={`${productName} ${i + 1}`} 
                    className="w-full h-full object-contain"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
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
