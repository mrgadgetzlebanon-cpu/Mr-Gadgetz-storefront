import { Link, useLocation } from "wouter";
import { ShoppingBag, Search, Menu, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { usePaginatedProducts } from "@/hooks/use-products";
import { useDebounce } from "@/hooks/use-debounce";
import { NavigationMenu } from "@/components/navigation/NavigationMenu";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(
    null,
  );
  const [location, setLocation] = useLocation();
  const { itemCount, setIsOpen } = useCart();
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: searchResults, isLoading: searchLoading } =
    usePaginatedProducts({
      handles: [],
      sortKey: "best_selling",
      first: 5,
      searchQuery: debouncedSearchQuery.length > 1 ? debouncedSearchQuery : "",
    });

  const isNotFoundPage =
    !["/", "/shop", "/search", "/contact", "/payment"].some(
      (path) =>
        location === path ||
        location.startsWith("/product/") ||
        location.startsWith("/shop?"),
    ) && location !== "/";
  const isContactPage = location === "/contact";
  const useWhiteLogo = isNotFoundPage || (isContactPage && !isScrolled);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayProducts =
    debouncedSearchQuery.length > 1 ? searchResults?.products || [] : [];

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      e.preventDefault();
      setLocation(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const toggleMobileSubmenu = (label: string) => {
    setExpandedMobileMenu(expandedMobileMenu === label ? null : label);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/90 dark:bg-[#020617]/90 backdrop-blur-md border-border/50 py-3"
          : "bg-transparent border-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity relative flex items-center"
          >
            <div className="relative h-8 md:h-10 w-32 md:w-40">
              <img
                src="/MR-Gadgetz-Logo-horizental_1768048140632.png"
                alt="MR.GADGETz"
                className={cn(
                  "absolute inset-0 w-full h-full object-contain transition-opacity duration-300",
                  useWhiteLogo ? "opacity-0" : "opacity-100",
                )}
              />
              <img
                src="/MR-Gadgetz-Logo-horizental-white_1768229870089.png"
                alt="MR.GADGETz"
                className={cn(
                  "absolute inset-0 w-[150px] object-contain transition-opacity duration-300 translate-x-[5px] translate-y-[-19px]",
                  useWhiteLogo ? "opacity-100" : "opacity-0",
                )}
              />
            </div>
          </Link>

          <NavigationMenu useWhiteLogo={useWhiteLogo} />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="relative" ref={searchRef}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "hover:bg-muted/50 rounded-full",
                  useWhiteLogo && "hover:bg-white/10",
                )}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <Search
                  className={cn("w-5 h-5", useWhiteLogo && "text-white")}
                />
              </Button>

              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-[300px] md:w-[400px] bg-background border border-border rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200 z-50">
                  <form onSubmit={handleSearchSubmit}>
                    <Input
                      autoFocus
                      placeholder="Search products... (Press Enter)"
                      className="rounded-full bg-muted/50 border-border focus:border-[#0c57ef]/50 focus:ring-[#0c57ef]/20"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      data-testid="input-search"
                    />
                  </form>
                  {searchLoading && debouncedSearchQuery.length > 1 && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  {!searchLoading && displayProducts.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {displayProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.handle}`}
                          className="flex items-center gap-3 p-2 hover:bg-muted rounded-xl transition-colors"
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          data-testid={`search-result-${product.id}`}
                        >
                          <img
                            src={product.image}
                            className="w-10 h-10 object-contain rounded-lg bg-muted"
                          />
                          <div>
                            <p className="text-sm font-medium leading-none">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              ${product.price}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {!searchLoading &&
                    debouncedSearchQuery.length > 1 &&
                    displayProducts.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No products found
                      </p>
                    )}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative hover:bg-muted/50 rounded-full",
                useWhiteLogo && "hover:bg-white/10",
              )}
              onClick={() => setIsOpen(true)}
              aria-label="Open cart"
            >
              <ShoppingBag
                className={cn("w-5 h-5", useWhiteLogo && "text-white")}
              />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#48bfef] rounded-full border-2 border-background animate-pulse" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden hover:bg-muted/50 rounded-full",
                useWhiteLogo && "hover:bg-white/10",
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className={cn("w-5 h-5", useWhiteLogo && "text-white")} />
              ) : (
                <Menu className={cn("w-5 h-5", useWhiteLogo && "text-white")} />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={cn(
            "lg:hidden absolute top-full left-0 right-0 border-b animate-in slide-in-from-top-5 max-h-[80vh] overflow-y-auto",
            useWhiteLogo
              ? "bg-[#020617] border-white/10"
              : "bg-background border-border/50",
          )}
        >
          <NavigationMenu
            categoryStructure={categoryStructure}
            useWhiteLogo={useWhiteLogo}
            variant="mobile"
            expandedMobileMenu={expandedMobileMenu}
            onToggleMobileMenu={toggleMobileSubmenu}
            onNavigate={() => setMobileMenuOpen(false)}
          />
        </div>
      )}
    </nav>
  );
}
