import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearch } from "wouter";
import {
  usePaginatedProducts,
  buildMultiFieldSearchQuery,
  SortOption,
} from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialQuery = params.get("q") || "";
  const sortParam = (params.get("sort") as SortOption | null) || "best_selling";
  const pageParam = params.get("page");
  const cursorParam = params.get("cursor");

  const [search, setSearch] = useState(initialQuery);

  useEffect(() => {
    setSearch(initialQuery);
  }, [initialQuery]);

  const searchTerm = search.trim();
  const gqlQuery = useMemo(
    () => buildMultiFieldSearchQuery(searchTerm),
    [searchTerm],
  );

  const { data, isLoading, isFetching } = usePaginatedProducts({
    handles: [],
    sortKey: sortParam || "best_selling",
    cursor: cursorParam,
    first: 24,
    searchQuery: gqlQuery,
    enabled: !!searchTerm,
  });

  const products = data?.products || [];

  const pageTitle = searchTerm
    ? `Search: ${searchTerm} | Mr. Gadgetz`
    : "Search | Mr. Gadgetz";

  const resultCount = products.length;

  const updateUrl = (next: {
    q?: string;
    page?: number;
    cursor?: string | null;
    sort?: SortOption;
  }) => {
    const sp = new URLSearchParams();
    const qv = next.q ?? searchTerm;
    if (qv) sp.set("q", qv);
    if (next.sort && next.sort !== "best_selling") sp.set("sort", next.sort);
    if (next.page && next.page > 1) sp.set("page", String(next.page));
    if (next.cursor) sp.set("cursor", next.cursor);
    setLocation(sp.toString() ? `/search?${sp.toString()}` : "/search", {
      replace: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ q: search.trim() });
  };

  const handleBrowseAll = () => setLocation("/shop");

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Search for electronics and gadgets at Mr. Gadgetz. ${search ? `Results for "${search}".` : "Find smartphones, laptops, audio, gaming gear, and more."}`}
        />
        <meta property="og:title" content={pageTitle} />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl font-display font-bold mb-6 text-center">
            Search Results
          </h1>
          <form onSubmit={handleSubmit} className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-12 h-14 rounded-full bg-muted/50 border-transparent focus:bg-background transition-all text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <p className="text-center mt-4 text-muted-foreground">
            {searchTerm
              ? `${resultCount} item${resultCount === 1 ? "" : "s"} found for "${searchTerm}"`
              : "Start typing to search and press Enter..."}
          </p>
        </div>

        {isLoading || isFetching ? (
          <div className="flex flex-wrap gap-4 md:gap-5 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 basis-[45%] md:basis-[30%] lg:basis-[22%] max-w-[260px] min-w-[180px]"
              >
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="flex flex-wrap gap-4 md:gap-5 lg:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-1 basis-[45%] md:basis-[30%] lg:basis-[22%] max-w-[260px] min-w-[180px]"
              >
                <ProductCard product={product} variant="grid" />
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-xl text-muted-foreground">
              No results found for "{searchTerm}".
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={handleBrowseAll}>
                Browse all products
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
