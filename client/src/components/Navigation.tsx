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
  const [isDesktop, setIsDesktop] = useState(false);
  const [location, setLocation] = useLocation();
  const { itemCount, setIsOpen } = useCart();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

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
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateMatch = () => setIsDesktop(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const desktopHit = searchRef.current?.contains(target);
      const mobileHit = mobileSearchRef.current?.contains(target);
      if (!desktopHit && !mobileHit) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      mediaQuery.removeEventListener("change", updateMatch);
    };
  }, []);

  const displayProducts =
    debouncedSearchQuery.length > 1 ? searchResults?.products || [] : [];

  const shouldShowResults =
    debouncedSearchQuery.length > 1 && (isDesktop || searchOpen);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      e.preventDefault();
      triggerSearch();
    }
  };

  const triggerSearch = () => {
    const term = searchQuery.trim();
    if (!term) return;
    setLocation(`/shop?search=${encodeURIComponent(term)}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch();
  };

  const toggleMobileSubmenu = (label: string) => {
    setExpandedMobileMenu(expandedMobileMenu === label ? null : label);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/90 dark:bg-[#020617]/90 backdrop-blur-md border-border/50"
          : "bg-transparent border-transparent",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex flex-col gap-2 py-3">
        {/* Desktop Top Row */}
        <div className="hidden lg:flex items-center gap-4 justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity relative flex items-center"
          >
            <div className="relative h-10 w-40">
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

          {/* Desktop Search */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-[50%]" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  placeholder="Search products..."
                  className="w-full rounded-full bg-muted/50 border-border py-[1.3rem] pl-4 pr-14 focus:border-[#0c57ef]/50 focus:ring-[#0c57ef]/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  data-testid="input-search-desktop"
                />
                <button
                  type="button"
                  onClick={triggerSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0c57ef] hover:bg-[#2a6df0] text-white flex items-center justify-center transition-colors"
                  aria-label="Search products"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
              {shouldShowResults && (
                <div className="absolute left-0 top-full mt-2 w-full max-w-[900px] bg-background border border-border rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200 z-[80]">
                  {searchLoading && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  {!searchLoading && displayProducts.length > 0 && (
                    <div className="space-y-2">
                      {displayProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.handle}`}
                          className="flex items-center gap-3 p-2 hover:bg-muted rounded-xl transition-colors"
                          onClick={() => {
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
                  {!searchLoading && displayProducts.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      {debouncedSearchQuery.length > 1
                        ? "No products found"
                        : "Start typing to search"}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cart */}
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
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#0c57ef] text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Button>
        </div>

        {/* Mobile Top Row */}
        <div className="flex lg:hidden items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity relative flex items-center"
          >
            <div className="relative h-8 w-32">
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

          {/* Actions */}
          <div className="flex items-center gap-2">
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
              <Search className={cn("w-5 h-5", useWhiteLogo && "text-white")} />
            </Button>

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
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#0c57ef] text-[10px] font-semibold text-white">
                  {itemCount}
                </span>
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

        {/* Mobile Search Drawer */}
        {searchOpen && (
          <div
            ref={mobileSearchRef}
            className={cn(
              "lg:hidden absolute left-0 top-full w-full bg-background border-b border-border p-4 z-50 animate-in slide-in-from-top-2",
            )}
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                autoFocus
                placeholder="Search products..."
                className="rounded-full bg-muted/50 border-border py-[1.3rem] pl-4 pr-14 focus:border-[#0c57ef]/50 focus:ring-[#0c57ef]/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                data-testid="input-search-mobile"
              />
              <button
                type="button"
                onClick={triggerSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0c57ef] hover:bg-[#2a6df0] text-white flex items-center justify-center transition-colors"
                aria-label="Search products"
              >
                <Search className="w-4 h-4" />
              </button>
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

        {/* Desktop Nav Row */}
        <div className="hidden lg:flex pt-2 justify-center">
          <NavigationMenu useWhiteLogo={useWhiteLogo} />
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
