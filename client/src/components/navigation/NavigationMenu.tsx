import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import megaMenu from "@/lib/mega-menu.json";
import { COLLECTIONS_QUERY, shopifyFetch } from "@/lib/shopify";

interface MegaMenuProps {
  useWhiteLogo: boolean;
  variant?: "desktop" | "mobile";
  expandedMobileMenu?: string | null;
  onToggleMobileMenu?: (label: string) => void;
  onNavigate?: () => void;
}

type MenuNode = {
  label: string;
  href: string;
  image?: string;
  children?: MenuNode[];
};

const menuData = megaMenu as MenuNode[];

export function NavigationMenu({
  useWhiteLogo,
  variant = "desktop",
  expandedMobileMenu,
  onToggleMobileMenu,
  onNavigate,
}: MegaMenuProps) {
  const navItems = useMemo(() => menuData, []);

  const [collectionImages, setCollectionImages] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await shopifyFetch<{
          collections: {
            edges: Array<{
              node: {
                handle: string;
                image?: { url: string | null } | null;
              };
            }>;
          };
        }>({ query: COLLECTIONS_QUERY, variables: { first: 100 } });

        if (!isMounted || !data?.collections?.edges) return;

        const map = data.collections.edges.reduce<Record<string, string>>(
          (acc, { node }) => {
            const url = node.image?.url;
            if (url) acc[node.handle] = url;
            return acc;
          },
          {},
        );

        setCollectionImages(map);
        if (process.env.NODE_ENV !== "production") {
          console.debug("Loaded collection images handles", Object.keys(map));
          console.debug("Networking image", map["networking"]);
        }
      } catch (error) {
        console.error("Failed to load collection images", error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const [activeRoot, setActiveRoot] = useState<string | null>(null);
  const [activeChild, setActiveChild] = useState<string | null>(null);

  if (variant === "mobile") {
    return (
      <div className="flex flex-col p-4 gap-1">
        {navItems.map((item) => {
          const hasChildren = (item.children?.length || 0) > 0;
          const isExpanded = expandedMobileMenu === item.label;
          const handle = item.href?.startsWith("/collections/")
            ? item.href.split("/").pop() || ""
            : "";
          const itemImage = item.image || collectionImages[handle];
          return (
            <div key={item.label}>
              <button
                onClick={() =>
                  hasChildren
                    ? onToggleMobileMenu?.(item.label)
                    : onNavigate?.()
                }
                className={cn(
                  "w-full flex items-center justify-between gap-3 text-lg font-medium py-3 px-4 rounded-lg transition-colors",
                  useWhiteLogo
                    ? "text-white hover:bg-white/10"
                    : "hover:bg-muted",
                )}
              >
                <Link
                  href={item.href || "#"}
                  className={cn(
                    "flex-1 text-left flex items-center gap-3",
                    useWhiteLogo ? "text-white" : "text-foreground",
                  )}
                  onClick={onNavigate}
                >
                  {itemImage && (
                    <img
                      src={itemImage}
                      alt={`${item.label} collection`}
                      className="w-9 h-9 rounded-md object-contain bg-muted/30"
                      loading="lazy"
                    />
                  )}
                  <span>{item.label}</span>
                </Link>
                {hasChildren && (
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 transition-transform",
                      isExpanded && "rotate-180",
                    )}
                  />
                )}
              </button>
              {hasChildren && isExpanded && (
                <div className="pl-4 pb-2 space-y-2 animate-in slide-in-from-top-2">
                  {item.children?.map((child) => {
                    const hasGrand = (child.children?.length || 0) > 0;
                    return (
                      <div key={child.label} className="space-y-1">
                        <Link
                          href={child.href}
                          className={cn(
                            "block py-2 px-4 rounded-lg text-base font-medium transition-colors",
                            useWhiteLogo
                              ? "text-white/90 hover:bg-white/10"
                              : "text-foreground hover:bg-muted",
                          )}
                          onClick={onNavigate}
                        >
                          {child.label}
                        </Link>
                        {hasGrand && (
                          <div className="ml-2 border-l border-border/50 pl-3 flex flex-col">
                            {child.children!.map((grand) => (
                              <Link
                                key={grand.label}
                                href={grand.href}
                                className={cn(
                                  "block py-1.5 px-3 rounded-lg text-sm transition-colors",
                                  useWhiteLogo
                                    ? "text-white/70 hover:bg-white/10 hover:text-white"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                )}
                                onClick={onNavigate}
                              >
                                {grand.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="hidden lg:flex flex-wrap justify-center items-center gap-3 overflow-visible max-w-full px-2 relative z-[60]">
      {navItems.map((item) => {
        const hasChildren = (item.children?.length || 0) > 0;
        const isOpen = activeRoot === item.label && hasChildren;

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => setActiveRoot(item.label)}
            onMouseLeave={() => {
              setActiveRoot(null);
              setActiveChild(null);
            }}
          >
            <Link
              href={item.href || "#"}
              className={cn(
                "flex items-center gap-1 text-sm font-semibold px-3 py-2 whitespace-nowrap transition-colors",
                useWhiteLogo
                  ? "text-white/80 hover:text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
              {hasChildren && (
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              )}
            </Link>

            {isOpen && (
              <div className="absolute left-0 top-full pt-2 z-[70]">
                <div className="relative bg-white border border-gray-200 shadow-2xl rounded-md w-[260px] py-2">
                  {(item.children || []).map((child) => {
                    const childKey = `${item.label}-${child.label}`;
                    const childHasChildren = (child.children?.length || 0) > 0;
                    const childActive = activeChild === childKey;

                    return (
                      <div
                        key={child.label}
                        className="relative"
                        onMouseEnter={() => setActiveChild(childKey)}
                      >
                        <Link
                          href={child.href}
                          className={cn(
                            "flex items-center justify-between px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 transition-colors",
                            childActive && "bg-gray-100",
                          )}
                        >
                          <span>{child.label}</span>
                          {childHasChildren && (
                            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                          )}
                        </Link>

                        {childHasChildren && childActive && (
                          <div className="absolute left-full top-0 z-[75] ml-[1px]">
                            <div className="bg-white border border-gray-200 shadow-2xl rounded-md w-[260px] py-2 relative">
                              {child.children?.map((grand) => (
                                <Link
                                  key={grand.label}
                                  href={grand.href}
                                  className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 transition-colors whitespace-nowrap"
                                >
                                  {grand.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
