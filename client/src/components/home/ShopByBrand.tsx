import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";

const imageModules = import.meta.glob<string>(
  "/public/images/*.{png,jpg,jpeg,webp,svg}",
  {
    eager: true,
    import: "default",
  },
);

const LOOPS = 3;

type Brand = {
  label: string;
  slug: string;
  src: string;
};

export function ShopByBrand() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const Maps = setLocation;

  const brands = useMemo<Brand[]>(() => {
    const entries = Object.entries(imageModules).map(([path, url]) => {
      const filename = path.split("/").pop() || "";
      const base = filename.replace(/\.[^.]+$/, "");
      const src =
        typeof url === "string"
          ? url
          : (url as { default?: string })?.default || "";
      return {
        label: base,
        slug: base.toLowerCase(),
        src,
      };
    });
    return entries.filter((b) => b.src);
  }, []);

  const loopBrands = useMemo<Brand[]>(
    () => Array.from({ length: LOOPS }, () => brands).flat(),
    [brands],
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || brands.length === 0) return;

    const setMiddle = () => {
      const segment = container.scrollWidth / LOOPS;
      container.scrollLeft = segment;
    };

    setMiddle();

    const handleScroll = () => {
      const segment = container.scrollWidth / LOOPS;
      if (!segment) return;
      const threshold = segment * 0.1;
      if (container.scrollLeft <= threshold) {
        container.scrollLeft += segment;
      } else if (container.scrollLeft >= segment * (LOOPS - 1) - threshold) {
        container.scrollLeft -= segment;
      }
    };

    const handleResize = () => {
      setMiddle();
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [brands.length]);

  const scrollByAmount = (direction: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = container.clientWidth * 0.7;
    container.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const handleNavigate = (brand: Brand) => {
    Maps(`/search?q=${encodeURIComponent(brand.slug)}&type=product`);
  };

  return (
    <section className="py-6 bg-white" data-testid="section-shop-by-brand">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-[1.2rem] md:text-3xl lg:text-4xl font-display font-bold mb-3">
            Shop by Brand
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore top brands curated for you
          </p>
        </div>

        <div className="relative mb-4">
          <div className="absolute right-0 -top-12 flex gap-3">
            <button
              onClick={() => scrollByAmount(-1)}
              className="w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white"
              aria-label="Scroll brands left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollByAmount(1)}
              className="w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white"
              aria-label="Scroll brands right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex items-center gap-4 sm:gap-6 py-4">
              {loopBrands.map((brand, idx) => (
                <button
                  key={`${brand.slug}-${idx}`}
                  onClick={() => handleNavigate(brand)}
                  className="flex-shrink-0 snap-start"
                  aria-label={`Shop ${brand.label}`}
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center overflow-hidden transition-transform transition-colors duration-200 hover:scale-105 hover:border-[#0c57ef]">
                    <img
                      src={brand.src}
                      alt={brand.label}
                      className="w-[85%] h-[85%] object-contain filter grayscale"
                      loading="lazy"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShopByBrand;
