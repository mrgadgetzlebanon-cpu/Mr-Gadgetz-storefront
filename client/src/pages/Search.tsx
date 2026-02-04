import { Helmet } from "react-helmet-async";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  const [location] = useLocation();
  const { data: products = [], isLoading } = useProducts();

  // Get query from URL
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialQuery);

  const filteredProducts = useMemo(() => {
    if (!search) return [];
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.category ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (product.brand ?? "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  const pageTitle = search
    ? `Search: ${search} | Mr. Gadgetz`
    : "Search | Mr. Gadgetz";

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
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-display font-bold mb-6 text-center">
            Search Results
          </h1>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-12 h-14 rounded-full bg-muted/50 border-transparent focus:bg-background transition-all text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <p className="text-center mt-4 text-muted-foreground">
            {search
              ? `${filteredProducts.length} items found for "${search}"`
              : "Start typing to search..."}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 xl:gap-6 justify-items-center">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-muted/20 rounded-xl w-full max-w-[220px] lg:max-w-[240px] h-[380px] animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 xl:gap-6 justify-items-center">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="grid" />
            ))}
          </div>
        ) : (
          search && (
            <div className="text-center py-24">
              <p className="text-xl text-muted-foreground">
                No products found matching your search.
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
}
