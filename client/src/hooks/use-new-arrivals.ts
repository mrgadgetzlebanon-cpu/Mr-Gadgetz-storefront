import { useMemo } from "react";
import { usePaginatedProducts } from "./use-products";

export function useNewArrivals(first = 12) {
  const queryResult = usePaginatedProducts({
    handles: [],
    sortKey: "newest",
    first,
    searchQuery: "tag:new-arrival",
  });

  const products = useMemo(() => {
    const list = queryResult.data?.products || [];
    return list.filter((product) =>
      (product.tags || []).some((tag) => tag.toLowerCase() === "new-arrival"),
    );
  }, [queryResult.data?.products]);

  return { ...queryResult, products };
}
