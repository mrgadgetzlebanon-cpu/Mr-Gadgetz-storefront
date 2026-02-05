import { useRef, useState, useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";

const BrandSpheresCanvas = lazy(() => import("./BrandSpheresCanvas"));

export function BrandSpheres() {
  const [isActive, setIsActive] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isVisible =
          rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        setIsActive(isVisible);
        if (isVisible && !shouldRender) {
          setShouldRender(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldRender]);

  return (
    <section
      ref={containerRef}
      className="relative py-20 overflow-hidden bg-[#020617]"
      data-testid="section-brand-spheres"
    >
      <div className="container mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-[1.2rem] md:text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            Trusted Brands
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            We partner with the world's leading technology brands to bring you
            the best products
          </p>
        </motion.div>
      </div>

      <div className="h-[500px] relative">
        {shouldRender && (
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            }
          >
            <BrandSpheresCanvas isActive={isActive} />
          </Suspense>
        )}

        <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-8">
          <p className="text-white/40 text-sm">Move your mouse to interact</p>
        </div>
      </div>
    </section>
  );
}

export default BrandSpheres;
