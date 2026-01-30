import { useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIDEBAR_CONFIG, type SidebarLink } from "@/config/navigationMap";
import { categoryStructure } from "@/config/categoryStructure";

interface NavigationMenuProps {
  useWhiteLogo: boolean;
  variant?: "desktop" | "mobile";
  expandedMobileMenu?: string | null;
  onToggleMobileMenu?: (label: string) => void;
  onNavigate?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  children: { label: string; href: string }[];
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function resolveCollectionParent(collection?: string) {
  if (!collection) return null;
  const target = slugify(collection);
  for (const group of categoryStructure.grouped) {
    const match = group.children.find(
      (child) => child.name === collection || slugify(child.name) === target,
    );
    if (match) {
      return { parent: group.parent, child: match.name };
    }
  }
  return null;
}

function buildHref(link: SidebarLink, parent: string): string {
  const params = new URLSearchParams();
  const resolved = resolveCollectionParent(link.collection);
  const effectiveParent = resolved?.parent || parent;
  const childLabel =
    resolved?.child || link.target || link.collection || parent;
  const parentParam = encodeURIComponent(effectiveParent);

  switch (link.mode) {
    case "STRUCTURE": {
      const category = `child:${parentParam}:${encodeURIComponent(link.target || "")}`;
      params.set("category", category);
      break;
    }
    case "FILTER": {
      const category = `child:${parentParam}:${encodeURIComponent(childLabel)}`;
      params.set("category", category);
      if (link.type) params.set("search", link.type);
      break;
    }
    case "VENDOR": {
      const category = `parent:${parentParam}`;
      params.set("category", category);
      if (link.query) params.set("search", link.query);
      break;
    }
    case "TAG": {
      const category = `child:${parentParam}:${encodeURIComponent(childLabel)}`;
      params.set("category", category);
      if (link.tag) params.set("search", link.tag);
      break;
    }
    default:
      break;
  }

  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

function buildNavItems(): NavItem[] {
  return SIDEBAR_CONFIG.map((group) => {
    const children: NavItem["children"] = [];
    group.links.forEach((link) => {
      if (link.subLinks && link.subLinks.length) {
        link.subLinks.forEach((sub) => {
          children.push({
            label: sub.label,
            href: buildHref(sub, group.title),
          });
        });
      } else {
        children.push({
          label: link.label,
          href: buildHref(link, group.title),
        });
      }
    });
    return {
      label: group.title,
      href: `/shop?category=parent:${encodeURIComponent(group.title)}`,
      children,
    };
  });
}

function NavDropdown({
  item,
  useWhiteLogo,
}: {
  item: NavItem;
  useWhiteLogo: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const useGrid = item.children.length >= 10;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  if (!item.children.length) {
    return (
      <Link
        href={item.href || "#"}
        className={cn(
          "text-sm font-medium px-3 py-2 transition-colors",
          useWhiteLogo
            ? "text-white/80 hover:text-white"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          "flex items-center gap-1 text-sm font-medium px-2.5 py-2 whitespace-nowrap transition-colors",
          useWhiteLogo
            ? "text-white/80 hover:text-white"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full pt-2 z-[60]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={cn(
              "bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200",
              useGrid && "min-w-[520px]",
            )}
          >
            {item.href && (
              <Link
                href={item.href}
                className="block px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-[#f5f5f5] border-b border-gray-100 mb-1"
              >
                View All {item.label}
              </Link>
            )}

            <div
              className={cn(
                useGrid ? "grid grid-cols-2 gap-1 px-1 pb-1" : "flex flex-col",
              )}
            >
              {item.children.map((child) => (
                <Link
                  key={child.label}
                  href={child.href}
                  className={cn(
                    "block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f5f5f5] hover:text-gray-900 transition-colors",
                    useGrid && "rounded-lg",
                  )}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function NavigationMenu({
  useWhiteLogo,
  variant = "desktop",
  expandedMobileMenu,
  onToggleMobileMenu,
  onNavigate,
}: NavigationMenuProps) {
  const navItems = useMemo(() => buildNavItems(), []);

  if (variant === "mobile") {
    return (
      <div className="flex flex-col p-4 gap-1">
        {navItems.map((item) => (
          <div key={item.label}>
            {item.children.length ? (
              <>
                <button
                  onClick={() => onToggleMobileMenu?.(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between text-lg font-medium py-3 px-4 rounded-lg transition-colors",
                    useWhiteLogo
                      ? "text-white hover:bg-white/10"
                      : "hover:bg-muted",
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 transition-transform",
                      expandedMobileMenu === item.label && "rotate-180",
                    )}
                  />
                </button>
                {expandedMobileMenu === item.label && (
                  <div className="pl-4 pb-2 space-y-1 animate-in slide-in-from-top-2">
                    {item.href && (
                      <Link
                        href={item.href}
                        className={cn(
                          "block py-2 px-4 rounded-lg text-base font-medium transition-colors",
                          useWhiteLogo
                            ? "text-white/90 hover:bg-white/10"
                            : "text-foreground hover:bg-muted",
                        )}
                        onClick={onNavigate}
                      >
                        View All {item.label}
                      </Link>
                    )}
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className={cn(
                          "block py-2 px-4 rounded-lg text-base transition-colors",
                          useWhiteLogo
                            ? "text-white/70 hover:bg-white/10 hover:text-white"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                        onClick={onNavigate}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href || "#"}
                className={cn(
                  "block text-lg font-medium py-3 px-4 rounded-lg transition-colors",
                  useWhiteLogo
                    ? "text-white hover:bg-white/10"
                    : "hover:bg-muted",
                )}
                onClick={onNavigate}
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-2 flex-nowrap overflow-visible max-w-full px-2 relative z-[60]">
      {navItems.map((item) => (
        <NavDropdown key={item.label} item={item} useWhiteLogo={useWhiteLogo} />
      ))}
    </div>
  );
}
