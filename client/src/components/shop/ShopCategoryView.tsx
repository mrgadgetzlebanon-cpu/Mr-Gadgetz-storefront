import { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { usePaginatedProducts, SortOption } from "@/hooks/use-products";
import { useHybridFilters } from "@/hooks/use-hybrid-filters";
import { useDebounce } from "@/hooks/use-debounce";
import { ShopHeader, ProductGrid, ShopPagination } from "@/components/shop";

const ITEMS_PER_PAGE = 24;

interface ShopCategoryViewProps {
  sortParam: SortOption | null;
  pageParam: string | null;
  cursorParam: string | null;
  searchParam: string | null;
  handles?: string[];
  basePath?: string;
  pageTitleOverride?: string;
}

export function ShopCategoryView({
  sortParam,
  pageParam,
  cursorParam,
  searchParam,
  handles = [],
  basePath = "/shop",
  pageTitleOverride,
}: ShopCategoryViewProps) {
  const [, setLocation] = useLocation();

  const [search, setSearch] = useState(searchParam || "");
  const [localPriceRange, setLocalPriceRange] = useState([0, 5000]);
  const [maxPrice, setMaxPrice] = useState(5000);

  useEffect(() => {
    if (searchParam) {
      setSearch(searchParam);
    } else {
      setSearch("");
    }
  }, [searchParam]);

  const sortKey: SortOption =
    sortParam &&
    ["best_selling", "newest", "price_low", "price_high"].includes(sortParam)
      ? sortParam
      : "best_selling";

  const urlPage = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;

  const [cursorMap, setCursorMap] = useState<Map<number, string>>(() =>
    cursorParam && urlPage > 1 ? new Map([[urlPage, cursorParam]]) : new Map(),
  );

  const debouncedPriceRange = useDebounce(localPriceRange, 300);
  const debouncedSearch = useDebounce(search, 400);
  const hasSearch = debouncedSearch.trim().length > 0;
  const isCursorMode = handles.length === 1;
  const isAllProducts = handles.length === 0;
  const currentCursor =
    urlPage > 1 ? cursorParam || cursorMap.get(urlPage) || null : null;

  const {
    data: paginatedResult,
    isLoading: productsLoading,
    isFetching,
  } = usePaginatedProducts({
    handles,
    sortKey,
    cursor: currentCursor,
    first: ITEMS_PER_PAGE,
    searchQuery: debouncedSearch,
  });

  const allFetchedProducts = paginatedResult?.products || [];
  const serverPageInfo = paginatedResult?.pageInfo;
  const isLoading = productsLoading;

  useEffect(() => {
    if (!allFetchedProducts.length) return;

    const highest = allFetchedProducts.reduce((acc, product) => {
      const base = Number(product.price) || 0;
      const compare = Number((product as any).originalPrice) || 0;
      const variantTop =
        (product as any).variants?.reduce((vAcc: number, v: any) => {
          const price = Number(v?.priceV2?.amount || v?.price) || 0;
          const compareAt =
            Number(v?.compareAtPriceV2?.amount || v?.compareAtPrice) || 0;
          return Math.max(vAcc, price, compareAt);
        }, 0) || 0;
      return Math.max(acc, base, compare, variantTop);
    }, 0);

    const rounded = Math.max(50, Math.ceil((highest || 100) / 50) * 50);
    if (rounded !== maxPrice) setMaxPrice(rounded);

    setLocalPriceRange(([min, currentMax]) => {
      if (currentMax > rounded) return [Math.min(min, rounded), rounded];
      return [min, currentMax];
    });
  }, [allFetchedProducts, maxPrice]);

  const { filteredProducts: hybridFilteredProducts } = useHybridFilters({
    products: allFetchedProducts,
    searchTerm: debouncedSearch,
    priceRange: debouncedPriceRange,
    isAllProducts,
    resetKey: `${sortKey}-${debouncedSearch}-${debouncedPriceRange.join("-")}`,
  });

  const totalClientPages = Math.max(
    1,
    Math.ceil(hybridFilteredProducts.length / ITEMS_PER_PAGE),
  );

  const effectivePage = isCursorMode
    ? urlPage
    : Math.min(urlPage, totalClientPages);
  const displayPage = isCursorMode ? urlPage : effectivePage;

  const filteredProducts = useMemo(() => {
    if (isCursorMode) return hybridFilteredProducts;

    const startIndex = (effectivePage - 1) * ITEMS_PER_PAGE;
    return hybridFilteredProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [hybridFilteredProducts, effectivePage, isCursorMode]);

  const hasNextPage = isCursorMode
    ? !!serverPageInfo?.hasNextPage
    : (serverPageInfo?.hasNextPage ?? effectivePage < totalClientPages);
  const hasPrevPage = isCursorMode ? urlPage > 1 : effectivePage > 1;

  const pageTitle = useMemo(() => {
    if (pageTitleOverride) return pageTitleOverride;
    if (hasSearch) return `Search: ${search.trim()}`;
    return "Shop";
  }, [hasSearch, search, pageTitleOverride]);

  const navigateToShop = useCallback(
    (options: {
      sort?: string;
      page?: number;
      cursor?: string;
      search?: string;
    }) => {
      const searchParams = new URLSearchParams();
      const activeSearch = options.search ?? (search.trim() ? search : "");
      if (options.sort) searchParams.set("sort", options.sort);
      if (options.page && options.page > 1)
        searchParams.set("page", options.page.toString());
      if (options.cursor) searchParams.set("cursor", options.cursor);
      if (activeSearch) searchParams.set("search", activeSearch);

      const qs = searchParams.toString();
      setLocation(qs ? `${basePath}?${qs}` : basePath);
    },
    [search, setLocation, basePath],
  );

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSortChange = useCallback(
    (value: string) => {
      navigateToShop({ sort: value, search: search.trim() || undefined });
      scrollToTop();
    },
    [navigateToShop, scrollToTop, search],
  );

  const handleNextPage = useCallback(() => {
    if (!hasNextPage) return;

    const nextPage = urlPage + 1;
    const cursor = serverPageInfo?.endCursor || null;

    if (isCursorMode && cursor) {
      setCursorMap((prev) => new Map(prev).set(nextPage, cursor));
    }

    navigateToShop({
      sort: sortKey,
      page: nextPage,
      cursor: isCursorMode ? cursor || undefined : undefined,
      search: search.trim() || undefined,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [
    hasNextPage,
    urlPage,
    serverPageInfo?.endCursor,
    isCursorMode,
    setCursorMap,
    navigateToShop,
    sortKey,
    search,
  ]);

  const handlePrevPage = useCallback(() => {
    if (!hasPrevPage) return;

    const prevPage = urlPage - 1;
    const prevCursor = cursorMap.get(prevPage);
    navigateToShop({
      sort: sortKey,
      page: prevPage > 1 ? prevPage : undefined,
      cursor: prevCursor,
      search: search.trim() || undefined,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [hasPrevPage, urlPage, cursorMap, navigateToShop, sortKey, search]);

  useEffect(() => {
    if (
      isCursorMode &&
      urlPage > 1 &&
      !cursorParam &&
      !cursorMap.get(urlPage)
    ) {
      navigateToShop({ sort: sortKey, search: search.trim() || undefined });
    }
  }, [
    isCursorMode,
    urlPage,
    cursorParam,
    cursorMap,
    navigateToShop,
    sortKey,
    search,
  ]);
  useEffect(() => {
    if (!isCursorMode && urlPage > totalClientPages) {
      const targetPage = Math.max(1, totalClientPages);
      navigateToShop({
        sort: sortKey,
        page: targetPage > 1 ? targetPage : undefined,
        search: search.trim() || undefined,
      });
    }
  }, [
    isCursorMode,
    urlPage,
    totalClientPages,
    navigateToShop,
    sortKey,
    search,
  ]);

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <ShopHeader
        pageTitle={pageTitle}
        productCount={hybridFilteredProducts.length}
        isFetching={isFetching}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        sortKey={sortKey}
        onSortChange={handleSortChange}
        localPriceRange={localPriceRange}
        currentPage={displayPage}
        onPriceRangeChange={setLocalPriceRange}
        maxPrice={maxPrice}
        totalPages={isCursorMode ? undefined : totalClientPages}
        hasNextPage={!!hasNextPage}
        hasPrevPage={hasPrevPage}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />

      <div className="space-y-8">
        <ProductGrid
          products={filteredProducts}
          isLoading={isLoading}
          isFetching={isFetching}
        />

        <ShopPagination
          currentPage={displayPage}
          totalPages={isCursorMode ? undefined : totalClientPages}
          hasNextPage={!!hasNextPage}
          hasPrevPage={hasPrevPage}
          isFetching={isFetching}
          isAllProducts={isAllProducts && !isCursorMode}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      </div>
    </div>
  );
}
