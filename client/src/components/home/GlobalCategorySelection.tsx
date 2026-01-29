import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Grid,
  LayoutList,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { ProductCard } from "@/components/ProductCard";
import {
  usePaginatedProducts,
  useGroupedCollections,
} from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/ui/category-card";

interface CategoryItem {
  id: string;
  label: string;
  parentCategory: string;
  image: string;
}

const categories: CategoryItem[] = [
  {
    id: "phones",
    label: "Phones",
    parentCategory: "Phones",
    image: "/img/Categories/category-phones.png",
  },
  {
    id: "tablets",
    label: "Tablets",
    parentCategory: "Tablets",
    image: "/img/Categories/category-tablets.png",
  },
  {
    id: "laptops",
    label: "Laptops",
    parentCategory: "PC and Laptops",
    image: "/img/Categories/category-laptop.png",
  },
  {
    id: "watches",
    label: "Watches",
    parentCategory: "Watches",
    image: "/img/Categories/category-watches.png",
  },
  {
    id: "smart-home",
    label: "Smart Home",
    parentCategory: "Smart Home",
    image: "/img/Categories/category-smart-home.webp",
  },
  {
    id: "audio",
    label: "Audio",
    parentCategory: "Audio",
    image: "/img/Categories/category-audio.png",
  },
  {
    id: "gaming",
    label: "Gaming",
    parentCategory: "Gaming",
    image: "/img/Categories/category-gaming.png",
  },
  {
    id: "networking",
    label: "Networking",
    parentCategory: "Networking",
    image: "/img/Categories/category-networking.png",
  },
];

export function GlobalCategorySelection() {
  const [activeCategory, setActiveCategory] = useState<string>("phones");
  const [showProducts, setShowProducts] = useState(false);
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");

  const { data: categoryStructure } = useGroupedCollections();

  const activeItem = categories.find((c) => c.id === activeCategory);

  const categoryHandles = useMemo(() => {
    if (!activeItem || !categoryStructure) return [];
    const category = categoryStructure.grouped.find(
      (g) => g.parent === activeItem.parentCategory,
    );
    return category?.parentHandles || [];
  }, [activeItem, categoryStructure]);

  const { data: result, isLoading } = usePaginatedProducts({
    handles: categoryHandles,
    sortKey: "best_selling",
    first: 15,
  });

  const products = result?.products || [];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [categoryEmblaRef, categoryEmblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (activeCategory) {
      setShowProducts(true);
      if (emblaApi) {
        emblaApi.scrollTo(0);
      }
    }
  }, [activeCategory, emblaApi]);
  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
  };

  const scrollCategoriesPrev = useCallback(
    () => categoryEmblaApi?.scrollPrev(),
    [categoryEmblaApi],
  );

  const scrollCategoriesNext = useCallback(
    () => categoryEmblaApi?.scrollNext(),
    [categoryEmblaApi],
  );

  return (
    <section className="py-16 bg-white" data-testid="section-global-categories">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of premium electronics across different
            categories
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative mb-10"
        >
          <div className="absolute right-0 -top-12 flex gap-3">
            <button
              onClick={scrollCategoriesPrev}
              className="w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollCategoriesNext}
              className="w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-hidden py-4" ref={categoryEmblaRef}>
            <div className="flex items-stretch gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex-shrink-0"
                  data-testid={`global-category-${category.id}`}
                >
                  <CategoryCard
                    text={category.label}
                    imageSrc={category.image}
                    onClick={() => handleCategoryClick(category.id)}
                    isActive={activeCategory === category.id}
                    style={{ ["--card-width" as string]: "416px" }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {showProducts && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-semibold">
                  {activeItem?.label} Products
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex bg-muted p-1 rounded-full">
                    <Button
                      size="sm"
                      variant={viewMode === "slider" ? "default" : "ghost"}
                      className="rounded-full h-8 px-3"
                      onClick={() => setViewMode("slider")}
                    >
                      <LayoutList className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      className="rounded-full h-8 px-3"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                  </div>
                  <Link
                    href={`/shop?category=parent:${activeItem?.parentCategory?.replace(/\s+/g, "+")}`}
                    className="inline-flex items-center gap-2 text-[#0c57ef] hover:underline font-medium text-sm"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {products.length > 0 ? (
                viewMode === "slider" ? (
                  <div className="relative group/slider">
                    <button
                      onClick={scrollPrev}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white dark:hover:bg-zinc-700"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="overflow-hidden py-4" ref={emblaRef}>
                      <div className="flex gap-8 px-2">
                        {products.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="flex-shrink-0 w-[350px]"
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={scrollNext}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white dark:hover:bg-zinc-700"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>
                )
              ) : isLoading ? (
                <div className="flex gap-8 overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-[350px] h-[500px] bg-muted rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No products found
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default GlobalCategorySelection;
