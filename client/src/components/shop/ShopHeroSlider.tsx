import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
  }),
  center: {
    x: 0,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
  }),
};

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  gradient: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: "apple",
    title: "Apple",
    subtitle: "Experience Innovation",
    cta: "Shop Apple",
    link: "/shop?category=parent:Phones",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1920&q=80",
    gradient: "from-black/80 via-black/40 to-transparent",
  },
  {
    id: "samsung",
    title: "Samsung",
    subtitle: "Galaxy of Possibilities",
    cta: "Explore Samsung",
    link: "/shop?category=parent:Phones",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1920&q=80",
    gradient: "from-blue-900/80 via-blue-900/40 to-transparent",
  },
  {
    id: "gaming",
    title: "Gaming Gear",
    subtitle: "Level Up Your Game",
    cta: "Shop Gaming",
    link: "/shop?category=parent:Gaming",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1920&q=80",
    gradient: "from-purple-900/80 via-purple-900/40 to-transparent",
  },
  {
    id: "audio",
    title: "Premium Audio",
    subtitle: "Sound Perfection",
    cta: "Shop Audio",
    link: "/shop?category=parent:Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&q=80",
    gradient: "from-cyan-900/80 via-cyan-900/40 to-transparent",
  },
];

export function ShopHeroSlider() {
  const [[currentSlide, direction], setSlide] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const paginate = (newDirection: number) => {
    const newIndex = (currentSlide + newDirection + heroSlides.length) % heroSlides.length;
    setSlide([newIndex, newDirection]);
  };

  const nextSlide = useCallback(() => {
    paginate(1);
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    paginate(-1);
  }, [currentSlide]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleManualNavigation = (direction: "prev" | "next") => {
    setIsAutoPlaying(false);
    if (direction === "prev") prevSlide();
    else nextSlide();
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden rounded-2xl">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        {(() => {
          const slide = heroSlides[currentSlide];
          return (
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
              }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-8 md:px-16">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="max-w-xl"
                  >
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
                      {slide.title}
                    </h2>
                    <p className="text-xl md:text-2xl text-white/80 mb-8">
                      {slide.subtitle}
                    </p>
                    <Link href={slide.link}>
                      <Button
                        size="lg"
                        className="bg-white text-black hover:bg-white/90 rounded-full px-8 text-base font-semibold"
                        data-testid={`hero-cta-${slide.id}`}
                      >
                        {slide.cta}
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <button
        onClick={() => handleManualNavigation("prev")}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
        aria-label="Previous slide"
        data-testid="hero-prev-button"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => handleManualNavigation("next")}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
        aria-label="Next slide"
        data-testid="hero-next-button"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const dir = index > currentSlide ? 1 : -1;
              setSlide([index, dir]);
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-white"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`hero-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
