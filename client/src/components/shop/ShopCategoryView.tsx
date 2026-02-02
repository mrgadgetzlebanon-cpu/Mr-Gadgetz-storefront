import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { usePaginatedProducts, SortOption } from "@/hooks/use-products";
import { useDynamicCategories } from "@/hooks/use-dynamic-categories";
import { useHybridFilters } from "@/hooks/use-hybrid-filters";
import { useDebounce } from "@/hooks/use-debounce";
import {
  ShopSidebar,
  ShopHeader,
  ProductGrid,
  ShopPagination,
  MobileCategoryScroll,
  serializeSelection,
  deserializeSelection,
  buildShopUrl,
} from "@/components/shop";

const ITEMS_PER_PAGE = 24;

interface ShopCategoryViewProps {
  categoryParam: string | null;
  sortParam: SortOption | null;
  pageParam: string | null;
  cursorParam: string | null;
  searchParam: string | null;
}

export function ShopCategoryView({
  categoryParam,
  sortParam,
  pageParam,
  cursorParam,
  searchParam,
}: ShopCategoryViewProps) {
  const [, setLocation] = useLocation();
  const { categoryStructure } = useDynamicCategories();

  const selection = useMemo(
    () => deserializeSelection(categoryParam, categoryStructure),
    [categoryParam, categoryStructure],
  );

  const [search, setSearch] = useState(searchParam || "");
  const [localPriceRange, setLocalPriceRange] = useState([0, 5000]);

  useEffect(() => {
    if (searchParam) {
      setSearch(searchParam);
    } else {
      setSearch("");
    }
  }, [searchParam]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categoryParam]);

  const sortKey: SortOption =
    sortParam &&
    ["best_selling", "newest", "price_low", "price_high"].includes(sortParam)
      ? sortParam
      : "best_selling";

  const urlPage = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;

  const [cursorMap, setCursorMap] = useState<Map<number, string>>(() => {
    if (cursorParam && urlPage > 1) {
      return new Map([[urlPage, cursorParam]]);
    }
    return new Map();
  });

  const debouncedPriceRange = useDebounce(localPriceRange, 300);
  const debouncedSearch = useDebounce(search, 400);
  const hasSearch = debouncedSearch.trim().length > 0;
  const effectiveHandles = hasSearch ? [] : selection.handles;
  const isAllProducts = effectiveHandles.length === 0;
  const currentCursor =
    isAllProducts && urlPage > 1
      ? cursorParam || cursorMap.get(urlPage) || null
      : null;

  const prevCategoryRef = useRef(selection.handles.join(","));
  const prevSortRef = useRef(sortKey);

  const buildCategoryParam = useCallback((category?: string | null) => {
    if (category) return category;
    return "parent:ALL_PRODUCTS";
  }, []);

  useEffect(() => {
    const currentCategory = selection.handles.join(",");
    if (
      prevCategoryRef.current !== currentCategory ||
      prevSortRef.current !== sortKey
    ) {
      setCursorMap(new Map());
      prevCategoryRef.current = currentCategory;
      prevSortRef.current = sortKey;
    }
  }, [selection.handles, sortKey]);

  const {
    data: paginatedResult,
    isLoading: productsLoading,
    isFetching,
  } = usePaginatedProducts({
    handles: effectiveHandles,
    sortKey,
    cursor: currentCursor,
    first: ITEMS_PER_PAGE,
    searchQuery: debouncedSearch,
  });

  const allFetchedProducts = paginatedResult?.products || [];
  const serverPageInfo = paginatedResult?.pageInfo;
  const isLoading = productsLoading;

  const selectionKey = `${selection.type}-${selection.parent || ""}-${selection.childName || ""}`;

  const dynamicFilters = useMemo(() => {
    const set = new Set<string>();
    allFetchedProducts.forEach((product) => {
      if (product.productType) {
        set.add(product.productType);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allFetchedProducts]);

  const {
    filteredProducts: hybridFilteredProducts,
    activeFilters,
    toggleFilter,
    clearFilters,
  } = useHybridFilters({
    products: allFetchedProducts,
    searchTerm: debouncedSearch,
    priceRange: debouncedPriceRange,
    isAllProducts,
    resetKey: selectionKey,
  });

  const totalClientPages = Math.ceil(
    hybridFilteredProducts.length / ITEMS_PER_PAGE,
  );

  const filteredProducts = useMemo(() => {
    if (isAllProducts) {
      return hybridFilteredProducts;
    }
    const startIndex = (urlPage - 1) * ITEMS_PER_PAGE;
    return hybridFilteredProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [hybridFilteredProducts, isAllProducts, urlPage]);

  const hasNextPage = isAllProducts
    ? serverPageInfo?.hasNextPage
    : urlPage < totalClientPages;
  const hasPrevPage = urlPage > 1;

  const pageTitle = useMemo(() => {
    if (hasSearch) return `Search: ${search.trim()}`;
    if (selection.type === "all") return "All Products";
    if (selection.type === "parent") return selection.parent || "Shop";
    if (selection.type === "child") return selection.childName || "Shop";
    return "Shop";
  }, [hasSearch, search, selection]);

  const navigateToShop = useCallback(
    (options: {
      category?: string;
      sort?: string;
      page?: number;
      cursor?: string;
      search?: string;
    }) => {
      const categoryValue = buildCategoryParam(options.category);
      const activeSearch =
        options.search ?? (search.trim() ? search : undefined);
      setLocation(
        buildShopUrl({
          ...options,
          category: categoryValue,
          search: activeSearch,
        }),
      );
    },
    [buildCategoryParam, search, setLocation],
  );

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSelectAll = useCallback(() => {
    navigateToShop({
      category: "parent:ALL_PRODUCTS",
      sort: sortKey,
      search: "",
    });
    scrollToTop();
  }, [navigateToShop, sortKey, scrollToTop]);

  const handleSelectParent = useCallback(
    (parent: string, _handles: string[]) => {
      navigateToShop({
        category: `parent:${parent}`,
        sort: sortKey,
        search: "",
      });
      scrollToTop();
    },
    [navigateToShop, sortKey, scrollToTop],
  );

  const handleSelectChild = useCallback(
    (parent: string, childName: string, _handles: string[]) => {
      navigateToShop({
        category: `child:${parent}:${childName}`,
        sort: sortKey,
        search: "",
      });
      scrollToTop();
    },
    [navigateToShop, sortKey, scrollToTop],
  );

  const handleSortChange = useCallback(
    (value: string) => {
      const serialized = serializeSelection(selection) || "parent:ALL_PRODUCTS";
      navigateToShop({ category: serialized, sort: value });
      scrollToTop();
    },
    [navigateToShop, selection, scrollToTop],
  );

  const handleNextPage = useCallback(() => {
    const serialized = serializeSelection(selection) || "parent:ALL_PRODUCTS";
    const nextPage = urlPage + 1;

    if (isAllProducts && serverPageInfo?.endCursor) {
      const cursor = serverPageInfo.endCursor;
      setCursorMap((prev) => new Map(prev).set(nextPage, cursor));

      if (serverPageInfo?.hasNextPage) {
        navigateToShop({
          category: serialized,
          sort: sortKey,
          page: nextPage,
          cursor: cursor,
        });
      }
    } else if (!isAllProducts && urlPage < totalClientPages) {
      navigateToShop({
        category: serialized || undefined,
        sort: sortKey,
        page: nextPage,
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [
    isAllProducts,
    serverPageInfo?.endCursor,
    serverPageInfo?.hasNextPage,
    urlPage,
    totalClientPages,
    selection,
    sortKey,
    navigateToShop,
  ]);

  const handlePrevPage = useCallback(() => {
    const serialized = serializeSelection(selection) || "parent:ALL_PRODUCTS";
    if (urlPage > 1) {
      const prevPage = urlPage - 1;

      if (isAllProducts && prevPage > 1) {
        const prevCursor = cursorMap.get(prevPage);
        if (prevCursor) {
          navigateToShop({
            category: serialized,
            sort: sortKey,
            page: prevPage,
            cursor: prevCursor,
          });
        } else {
          navigateToShop({ category: serialized, sort: sortKey });
        }
      } else {
        navigateToShop({
          category: serialized,
          sort: sortKey,
          page: prevPage > 1 ? prevPage : undefined,
        });
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [urlPage, selection, sortKey, navigateToShop, isAllProducts, cursorMap]);

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <div className="z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 pb-4 md:static md:bg-transparent md:backdrop-blur-none md:pb-0 md:mx-0 md:px-0">
        <ShopHeader
          pageTitle={pageTitle}
          productCount={filteredProducts.length}
          isFetching={isFetching}
          isLoading={isLoading}
          search={search}
          onSearchChange={setSearch}
          sortKey={sortKey}
          onSortChange={handleSortChange}
          localPriceRange={localPriceRange}
          onPriceRangeChange={setLocalPriceRange}
          currentPage={urlPage}
          totalPages={totalClientPages}
          hasNextPage={!!hasNextPage}
          hasPrevPage={hasPrevPage}
          isAllProducts={isAllProducts}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
          {/*
            Filter by tag section temporarily disabled.
          <FilterBar
            filters={dynamicFilters}
            activeFilters={activeFilters}
            onToggle={toggleFilter}
            onClear={clearFilters}
          />
          */}

        <MobileCategoryScroll
          categoryStructure={categoryStructure}
          selection={selection}
          onSelectAll={handleSelectAll}
          onSelectParent={handleSelectParent}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="hidden lg:block col-span-1 space-y-8 sticky top-24 h-fit">
          <ShopSidebar
            localPriceRange={localPriceRange}
            onPriceRangeChange={setLocalPriceRange}
          />
        </div>

        <div className="col-span-1 lg:col-span-3">
          <ProductGrid
            products={filteredProducts}
            isLoading={isLoading}
            isFetching={isFetching}
          />

          <ShopPagination
            currentPage={urlPage}
            totalPages={totalClientPages}
            hasNextPage={!!hasNextPage}
            hasPrevPage={hasPrevPage}
            isFetching={isFetching}
            isAllProducts={isAllProducts}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
          />
        </div>
      </div>
    </div>
  );
}
