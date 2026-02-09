import { Link, useLocation } from "wouter";
import { ShoppingBag, Search, Menu, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { usePaginatedProducts } from "@/hooks/use-products";
import { useDebounce } from "@/hooks/use-debounce";
import { NavigationMenu as MegaMenu } from "@/components/navigation/NavigationMenu";

type NavigationProps = {
  onMobileMenuChange?: (open: boolean) => void;
};

export function Navigation({ onMobileMenuChange }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(
    null,
  );
  const [isDesktop, setIsDesktop] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const [location, setLocation] = useLocation();
  const { itemCount, setIsOpen } = useCart();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const navBarRef = useRef<HTMLDivElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: searchResults, isLoading: searchLoading } =
    usePaginatedProducts({
      handles: [],
      sortKey: "best_selling",
      first: 5,
      searchQuery: debouncedSearchQuery.length > 1 ? debouncedSearchQuery : "",
    });

  const infoPages = [
    "/privacy-policy",
    "/terms-of-service",
    "/shipping-and-returns",
    "/warranty",
  ];

  const isProductPage = location.startsWith("/product/");
  const isShopQuery = location.startsWith("/shop?");
  const isCollectionPage = location.startsWith("/collections");
  const isInfoPage = infoPages.includes(location);

  const isStandardPage =
    location === "/" ||
    location === "/shop" ||
    location === "/search" ||
    location === "/contact" ||
    location === "/payment" ||
    isCollectionPage ||
    isProductPage ||
    isShopQuery ||
    isInfoPage;

  const isNotFoundPage = !isStandardPage;
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

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mediaQuery.removeEventListener("change", updateMatch);
    };
  }, []);

  useEffect(() => {
    const shouldLock = mobileMenuOpen;
    document.body.style.overflow = shouldLock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
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
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const measureNavHeight = () => {
      const height = navBarRef.current?.offsetHeight || 0;
      setNavHeight(height);
    };

    measureNavHeight();
    window.addEventListener("resize", measureNavHeight);
    return () => window.removeEventListener("resize", measureNavHeight);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const id = requestAnimationFrame(() => {
      const height = navBarRef.current?.offsetHeight || 0;
      setNavHeight(height);
    });
    return () => cancelAnimationFrame(id);
  }, [mobileMenuOpen, isScrolled]);

  const displayProducts =
    debouncedSearchQuery.length > 1 ? searchResults?.products || [] : [];

  const shouldShowResults =
    debouncedSearchQuery.length > 1 && (isDesktop || searchOpen);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      triggerSearch();
    }
  };

  const triggerSearch = () => {
    const term = searchQuery.trim();
    if (!term) {
      setLocation("/search");
    } else {
      setLocation(`/search?q=${encodeURIComponent(term)}`);
    }
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

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen((prev) => {
      const next = !prev;
      onMobileMenuChange?.(next);
      return next;
    });
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        "bg-white border-border/50", // mobile default
        isScrolled
          ? "lg:bg-white/90 dark:lg:bg-[#020617]/90 lg:backdrop-blur-md lg:border-border/50"
          : "lg:bg-transparent lg:border-transparent",
      )}
    >
      <div
        className="container mx-auto px-4 md:px-6 flex flex-col gap-2 py-3"
        ref={navBarRef}
      >
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
                  className="w-full rounded-full bg-muted/50 border-border py-[1.3rem] pl-4 pr-14 focus:border-[#0c57ef]/50 outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
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
        <div className="flex lg:hidden items-center gap-3 justify-between">
          {/* Menu */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden hover:bg-muted/50 rounded-full",
              useWhiteLogo && "hover:bg-white/10",
            )}
            onClick={handleToggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className={cn("w-5 h-5", useWhiteLogo && "text-white")} />
            ) : (
              <Menu className={cn("w-5 h-5", useWhiteLogo && "text-white")} />
            )}
          </Button>

          {/* Logo */}
          <div className="flex-1 flex justify-center">
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

        {/* Mobile Sticky Search Bar */}
        <div className="lg:hidden sticky top-[72px] z-[55] bg-transparent shadow-none">
          <div
            className="pb-3 pt-2 px-4 relative w-screen left-1/2 -translate-x-1/2"
            ref={mobileSearchRef}
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                onFocus={() => setSearchOpen(true)}
                placeholder="Search products..."
                className={cn(
                  "w-full border-border py-[1.5rem] pl-4 pr-12 focus:border-[#0c57ef]/50 text-gray-900 placeholder:text-gray-500 outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none",
                  searchQuery ? "bg-white" : "bg-transparent",
                )}
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
            {searchOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-border rounded-2xl shadow-lg z-[60]">
                {searchLoading && debouncedSearchQuery.length > 1 && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                )}
                {!searchLoading && displayProducts.length > 0 && (
                  <div className="divide-y divide-border">
                    {displayProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.handle}`}
                        className="flex items-center gap-3 p-3 hover:bg-muted transition-colors"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        data-testid={`search-result-${product.id}`}
                      >
                        <img
                          src={product.image}
                          className="w-12 h-12 object-contain rounded-lg bg-muted"
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
                {!searchLoading && debouncedSearchQuery.length <= 1 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Start typing to search
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Nav Row */}
        <div className="hidden lg:flex pt-2 justify-center">
          <MegaMenu useWhiteLogo={useWhiteLogo} />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={cn(
            "lg:hidden absolute top-full left-0 right-0 border-b animate-in slide-in-from-top-5 overflow-y-auto",
            useWhiteLogo
              ? "bg-[#020617] border-white/10"
              : "bg-background border-border/50",
          )}
          style={{
            height:
              navHeight > 0
                ? `calc(100vh - ${navHeight}px)`
                : "calc(100vh - 72px)",
            maxHeight:
              navHeight > 0
                ? `calc(100vh - ${navHeight}px)`
                : "calc(100vh - 72px)",
          }}
        >
          <MegaMenu
            useWhiteLogo={useWhiteLogo}
            variant="mobile"
            expandedMobileMenu={expandedMobileMenu}
            onToggleMobileMenu={toggleMobileSubmenu}
            onNavigate={() => {
              setMobileMenuOpen(false);
              onMobileMenuChange?.(false);
            }}
          />
        </div>
      )}
    </nav>
  );
}
