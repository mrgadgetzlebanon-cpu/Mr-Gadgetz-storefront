import { useState, useCallback, useMemo, useEffect, useRef } from "react";
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
import { SIDEBAR_CONFIG } from "@/config/navigationMap";

interface CategoryItem {
  id: string;
  label: string;
  parentCategory: string;
  image: string;
}

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
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

const categoryFallbackTags: Record<string, string[]> = {
  phones: ["phone", "smartphone", "mobile"],
  tablets: ["tablet", "ipad"],
  laptops: ["computer", "laptop", "pc"],
  watches: ["smart watch", "smartwatch"],
  audio: ["earbuds", "headphones", "speaker"],
  "smart-home": ["dyson", "smart home", "home"],
  gaming: ["gaming", "console", "controller"],
  networking: ["router", "network", "wifi"],
};

const categoryHandleOrder: Record<string, string[]> = {
  phones: ["Mobile Phones", "Mobile Accessories"],
  tablets: ["Tablets", "Tablet Accessories"],
  laptops: [
    "Laptops",
    "Desktops",
    "Computer Accessories",
    "Keyboards",
    "Brands",
  ],
};

export function GlobalCategorySelection() {
  const [activeCategory, setActiveCategory] = useState<string>("phones");
  const [showProducts, setShowProducts] = useState(false);
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");
  const productsSectionRef = useRef<HTMLDivElement>(null);
  const hasInteractedRef = useRef(false);
  const [useFallbackQuery, setUseFallbackQuery] = useState(false);

  const { data: categoryStructure } = useGroupedCollections();

  const activeItem = categories.find((c) => c.id === activeCategory);

  const resolveHandlesForCategory = useCallback(
    (category: CategoryItem | undefined): string[] => {
      if (!categoryStructure || !category) return [];

      const categoryKeys = [
        category.parentCategory,
        category.label,
        category.id,
      ]
        .filter(Boolean)
        .map((val) => normalizeKey(val));

      const categoryConfig = SIDEBAR_CONFIG.find((group) => {
        const groupKey = normalizeKey(group.title);
        return categoryKeys.some(
          (ck) =>
            groupKey === ck || groupKey.includes(ck) || ck.includes(groupKey),
        );
      });

      if (!categoryConfig) return [];

      const orderedCandidates = (categoryHandleOrder[category.id] || []).map(
        (c) => normalizeKey(c),
      );

      const linkCandidates: string[] = [];
      const pushCandidate = (name?: string) => {
        if (!name) return;
        linkCandidates.push(name);
      };

      categoryConfig.links.forEach((link) => {
        pushCandidate(link.type);
        pushCandidate(link.target);
        pushCandidate(link.collection);

        if (link.subLinks) {
          link.subLinks.forEach((sub) => {
            pushCandidate(sub.type);
            pushCandidate(sub.target);
            pushCandidate(sub.collection);
          });
        }
      });

      const normalizedCandidates: string[] = [...orderedCandidates];

      linkCandidates.forEach((name) => {
        const key = normalizeKey(name);
        if (!normalizedCandidates.includes(key)) {
          normalizedCandidates.push(key);
        }
      });

      const childHandleMap = new Map<string, string[]>();
      categoryStructure.grouped.forEach((group) => {
        group.children.forEach((child) => {
          const keys = [child.name, ...(child.filters || [])];
          keys
            .map((k) => normalizeKey(k))
            .forEach((k) => {
              const existing = childHandleMap.get(k) || [];
              childHandleMap.set(k, [...existing, ...child.handles]);
            });
        });
      });

      const orderedHandles: string[] = [];
      const seenHandles = new Set<string>();

      normalizedCandidates.forEach((candidate) => {
        const handles = childHandleMap.get(candidate) || [];
        handles.forEach((h) => {
          if (!seenHandles.has(h)) {
            seenHandles.add(h);
            orderedHandles.push(h);
          }
        });
      });

      return orderedHandles;
    },
    [categoryStructure],
  );

  const resolvedHandles = useMemo(() => {
    if (!activeItem) return [];
    const handles = resolveHandlesForCategory(activeItem);
    if (handles.length > 0) return handles;

    const category = categoryStructure?.grouped.find(
      (g) => g.parent === activeItem.parentCategory,
    );
    return category?.parentHandles || [];
  }, [activeItem, categoryStructure, resolveHandlesForCategory]);

  const fallbackQuery = useMemo(() => {
    const tags = categoryFallbackTags[activeCategory] || [];
    if (tags.length === 0) return "";
    return tags.map((t) => `tag:${t}`).join(" OR ");
  }, [activeCategory]);

  const { data: result, isLoading } = usePaginatedProducts({
    handles: useFallbackQuery ? [] : resolvedHandles,
    sortKey: "best_selling",
    first: 15,
    searchQuery: useFallbackQuery ? fallbackQuery : "",
  });

  useEffect(() => {
    if (resolvedHandles.length === 0 && fallbackQuery) {
      setUseFallbackQuery(true);
    }
  }, [resolvedHandles.length, fallbackQuery]);

  useEffect(() => {
    if (
      !isLoading &&
      !useFallbackQuery &&
      resolvedHandles.length > 0 &&
      (result?.products?.length || 0) === 0 &&
      fallbackQuery
    ) {
      setUseFallbackQuery(true);
    }
  }, [
    isLoading,
    useFallbackQuery,
    resolvedHandles.length,
    result?.products?.length,
    fallbackQuery,
  ]);

  const products = result?.products || [];
  const isProductsLoading = isLoading;

  const sortedProducts = useMemo(() => {
    const computeWeight = (product: any) => {
      const text =
        `${product.productType || ""} ${product.name || ""} ${(product.tags || []).join(" ")}`.toLowerCase();

      const brand = (product.brand || "").toLowerCase();
      const brandPriority = (() => {
        if (brand.includes("apple") || brand.includes("iphone")) return 0;
        if (brand.includes("samsung")) return 1;
        if (brand.includes("tecno") || brand.includes("xiaomi")) return 2;
        return 3;
      })();

      const matches = (keywords: string[]) =>
        keywords.some((k) => text.includes(k));

      const deviceBucket = (() => {
        switch (activeCategory) {
          case "phones": {
            const device = matches(["phone", "smartphone", "mobile phone"]);
            const accessory = matches([
              "case",
              "screen protector",
              "protector",
              "cable",
              "charger",
              "stand",
              "mount",
              "lens",
              "cover",
              "band",
              "dock",
              "adapter",
              "battery",
            ]);
            if (device && !accessory) return 0;
            if (accessory) return 2;
            return 1;
          }
          case "tablets": {
            const device = matches(["tablet", "ipad"]);
            const accessory = matches([
              "case",
              "folio",
              "screen protector",
              "protector",
              "cable",
              "charger",
              "stand",
              "mount",
              "keyboard",
              "dock",
              "cover",
              "adapter",
            ]);
            if (device && !accessory) return 0;
            if (accessory) return 2;
            return 1;
          }
          case "laptops": {
            const device = matches([
              "laptop",
              "notebook",
              "macbook",
              "computer",
              "pc",
              "desktop",
            ]);
            const accessory = matches([
              "case",
              "sleeve",
              "bag",
              "charger",
              "adapter",
              "dock",
              "keyboard",
              "mouse",
              "cable",
              "stand",
              "monitor",
            ]);
            if (device && !accessory) return 0;
            if (accessory) return 2;
            return 1;
          }
          default:
            return 1;
        }
      })();

      // Combine device bucket and brand priority (only meaningful for devices)
      const brandWeight = deviceBucket === 0 ? brandPriority : 0;
      return deviceBucket * 10 + brandWeight;
    };

    return products
      .map((p, index) => ({ p, index, weight: computeWeight(p) }))
      .sort((a, b) => a.weight - b.weight || a.index - b.index)
      .map((item) => item.p);
  }, [products, activeCategory]);

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

  useEffect(() => {
    setUseFallbackQuery(false);
  }, [activeCategory, resolvedHandles.length]);

  useEffect(() => {
    if (showProducts && productsSectionRef.current) {
      if (!hasInteractedRef.current) return;
      productsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showProducts, activeCategory]);
  const handleCategoryClick = (id: string) => {
    hasInteractedRef.current = true;
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
    <section className="py-6 bg-white" data-testid="section-global-categories">
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
              ref={productsSectionRef}
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

              {sortedProducts.length > 0 ? (
                viewMode === "slider" ? (
                  <div className="relative group/slider">
                    <button
                      onClick={scrollPrev}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white dark:hover:bg-zinc-700"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="overflow-hidden py-4" ref={emblaRef}>
                      <div className="flex gap-4 sm:gap-6 md:gap-8 px-2">
                        {sortedProducts.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[230px]"
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 xl:gap-6 justify-items-center">
                    {sortedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <ProductCard product={product} variant="grid" />
                      </motion.div>
                    ))}
                  </div>
                )
              ) : isProductsLoading ? (
                <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[230px] h-[360px] sm:h-[400px] bg-muted rounded-xl animate-pulse"
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
