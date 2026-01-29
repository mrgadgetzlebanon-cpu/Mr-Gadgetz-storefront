import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

interface Slide {
  id: number;
  type: "image" | "video";
  src: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-technological-circuit-board-animation-4447-large.mp4",
    title: "Future Ready.",
    subtitle: "Experience the next generation of personal electronics. Designed for power, crafted for elegance.",
    ctaText: "Shop Now",
    ctaLink: "/shop",
  },
  {
    id: 2,
    type: "image",
    src: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2070",
    title: "Next-Gen Audio.",
    subtitle: "Pure sound, zero noise. Immerse yourself in a world of high-fidelity audio.",
    ctaText: "Explore Audio",
    ctaLink: "/shop?category=Headphones",
  },
  {
    id: 3,
    type: "image",
    src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=2070&q=80",
    title: "Pro Performance.",
    subtitle: "Thin, light, and powerful. The perfect companion for your creative workflow.",
    ctaText: "Shop Laptops",
    ctaLink: "/shop?category=Laptops",
  }
];

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 20 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  return (
    <section className="relative h-[90vh] bg-[#020617] text-white overflow-hidden">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full flex items-center justify-center">
              <div className="absolute inset-0">
                {slide.type === "video" ? (
                  <video
                    src={slide.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-60"
                  />
                ) : (
                  <img
                    src={slide.src}
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/30 to-transparent z-10" />
              </div>

              <div className="container relative z-20 px-4 text-center">
                <div className="max-w-3xl mx-auto space-y-6">
                  <span className="inline-block py-1.5 px-4 rounded-full bg-[#0c57ef]/20 backdrop-blur-md border border-[#48bfef]/30 text-sm font-medium tracking-wide text-[#48bfef]">
                    New Collection 2026
                  </span>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-[#48bfef]/80">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href={slide.ctaLink}>
                      <Button
                        size="lg"
                        className="relative overflow-hidden z-10 rounded-full px-8 text-base h-14 bg-[#0c57ef] text-white border-[#0c57ef] shadow-[0_0_30px_rgba(72,191,239,0.3)] transition-all duration-500 ease-in-out hover:text-[#0c57ef] hover:shadow-[0_0_40px_rgba(72,191,239,0.5)] before:content-[''] before:absolute before:z-[-1] before:block before:w-[150%] before:h-0 before:rounded-[50%] before:left-1/2 before:top-[100%] before:translate-x-[-50%] before:translate-y-[-50%] before:bg-white before:transition-all before:duration-500 hover:before:h-[400%] hover:before:top-1/2"
                      >
                        {slide.ctaText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              selectedIndex === i ? "w-8 bg-[#48bfef]" : "w-2 bg-white/30 hover:bg-[#48bfef]/50"
            )}
          />
        ))}
      </div>
    </section>
  );
}
