import { useCallback, useEffect, useMemo, useState } from "react";
import type { ExtendedProduct } from "@/hooks/use-products";

interface UseHybridFiltersOptions {
  products: ExtendedProduct[];
  searchTerm: string;
  priceRange: number[];
  isAllProducts: boolean;
  resetKey: string;
}

export function useHybridFilters({
  products,
  searchTerm,
  priceRange,
  isAllProducts,
  resetKey,
}: UseHybridFiltersOptions) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    setActiveFilters([]);
  }, [resetKey]);

  const filteredProducts = useMemo(() => {
    let working = products;

    if (!isAllProducts && searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      working = working.filter((product) =>
        product.name.toLowerCase().includes(lowerSearch),
      );
    }

    if (activeFilters.length > 0) {
      const lookup = activeFilters.map((filter) => filter.toLowerCase());
      working = working.filter((product) => {
        const productType = product.productType?.toLowerCase() || "";
        const tags = (product.tags || []).map((tag) => tag.toLowerCase());
        return lookup.some(
          (filter) => productType === filter || tags.includes(filter),
        );
      });
    }

    return working.filter((product) => {
      const price = Number(product.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });
  }, [activeFilters, isAllProducts, priceRange, products, searchTerm]);

  const toggleFilter = useCallback((filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter],
    );
  }, []);

  const clearFilters = useCallback(() => setActiveFilters([]), []);

  return { filteredProducts, activeFilters, toggleFilter, clearFilters };
}
