import type { TouchEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SLIDE_DURATION_MS = 10000;
const slides = [
  {
    src: "/mobile-hero/iphone-mobile-banner.png",
    href: "/collections/iphone-17",
    label: "iPhone 17",
  },
  {
    src: "/mobile-hero/jbl-mobile-banner.png",
    href: "/collections/jbl",
    label: "JBL",
  },
  {
    src: "/mobile-hero/audio-mobile-banner.png",
    href: "/collections/audio",
    label: "Audio",
  },
  {
    src: "/mobile-hero/gaming-mobile-banner.png",
    href: "/collections/gaming",
    label: "Gaming",
  },
  {
    src: "/mobile-hero/dyson-mobile-banner.png",
    href: "/collections/dyson",
    label: "Dyson",
  },
];

export function MobileHero() {
  const images = useMemo(() => slides.filter(Boolean), []);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const resetTickRef = useRef<number>(0);

  useEffect(() => {
    if (images.length === 0) return;

    let frame: number;
    let start: number | null = null;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      // If a reset was requested (slide changed), restart the timer baseline
      if (resetTickRef.current) {
        start = timestamp;
        resetTickRef.current = 0;
      }
      const elapsed = timestamp - start;
      const pct = Math.min(100, (elapsed / SLIDE_DURATION_MS) * 100);
      setProgress(pct);
      if (elapsed >= SLIDE_DURATION_MS) {
        start = timestamp;
        setActive((prev) => (prev + 1) % images.length);
        setProgress(0);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [images.length]);

  const goTo = (index: number) => {
    setActive((prev) => {
      const next = (index + images.length) % images.length;
      if (next !== prev) {
        setProgress(0);
        resetTickRef.current = performance.now();
      }
      return next;
    });
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchMove = (event: TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return;
    const deltaX = event.touches[0]?.clientX - touchStartX.current;
    if (deltaX === undefined) return;
    if (Math.abs(deltaX) > 40) {
      goTo(deltaX < 0 ? active + 1 : active - 1);
      touchStartX.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  return (
    <section className="w-full" data-testid="mobile-hero">
      <a
        className="relative block w-full aspect-[4/3] overflow-hidden rounded bg-gray-100"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        href={images[active]?.href ?? "#"}
        aria-label={images[active]?.label ?? "Featured collection"}
      >
        {images.map((item, idx) => (
          <img
            key={item.src}
            src={item.src}
            alt={item.label}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              idx === active ? "opacity-100" : "opacity-0",
            )}
            loading={idx === 0 ? "eager" : "lazy"}
          />
        ))}

        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 px-4 mix-blend-difference">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "relative h-[2px] w-12 overflow-hidden bg-white/25",
                idx === active ? "opacity-100" : "opacity-60",
              )}
            >
              {idx === active && (
                <span
                  className="absolute left-0 top-0 h-full bg-white transition-[width]"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
      </a>
    </section>
  );
}

export default MobileHero;
