import { useEffect, useMemo, useState } from "react";
import { Link, useSearch } from "wouter";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { SIDEBAR_CONFIG, type SidebarLink } from "@/config/navigationMap";
import { categoryStructure } from "@/config/categoryStructure";

interface ShopSidebarProps {
  localPriceRange: number[];
  onPriceRangeChange: (value: number[]) => void;
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

function buildParams(link: SidebarLink, parent: string) {
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

  return params;
}

function buildHref(params: URLSearchParams) {
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

function extractParent(category: string | null) {
  if (!category) return null;
  const decoded = decodeURIComponent(category);
  if (decoded.startsWith("child:")) {
    const [, parent] = decoded.split(":");
    return parent || null;
  }
  if (decoded.startsWith("parent:")) {
    return decoded.substring(7) || null;
  }
  return null;
}

export function ShopSidebar({
  localPriceRange,
  onPriceRangeChange,
}: ShopSidebarProps) {
  const searchString = useSearch();
  const searchParams = useMemo(
    () => new URLSearchParams(searchString),
    [searchString],
  );
  const currentCategory = searchParams.get("category")
    ? decodeURIComponent(searchParams.get("category") as string)
    : "parent:ALL_PRODUCTS";
  const currentSearch = searchParams.get("search") || "";

  const initialParent = useMemo(
    () => extractParent(currentCategory),
    [currentCategory],
  );
  const [openAccordions, setOpenAccordions] = useState<string[]>(
    initialParent ? [initialParent] : [],
  );

  useEffect(() => {
    const parent = extractParent(currentCategory);
    if (parent) {
      setOpenAccordions((prev) =>
        prev.includes(parent) ? prev : [...prev, parent],
      );
    }
  }, [currentCategory]);

  const isActiveParams = (params: URLSearchParams) => {
    const targetCategory = params.get("category")
      ? decodeURIComponent(params.get("category") as string)
      : "";
    const targetSearch = params.get("search") || "";
    return targetCategory === currentCategory && targetSearch === currentSearch;
  };

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        data-testid="button-back-to-shop"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Main Page</span>
      </Link>

      <div>
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
          Categories
        </h3>
        <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
          <Link
            href="/shop?category=parent%3AALL_PRODUCTS"
            className={cn(
              "flex items-center w-full py-2 px-3 rounded-lg text-sm transition-colors hover-elevate text-left",
              currentCategory === "parent:ALL_PRODUCTS"
                ? "bg-primary text-primary-foreground font-medium"
                : "text-foreground hover:bg-muted",
            )}
            data-testid="button-all-products"
          >
            <span>All Products</span>
          </Link>

          <Accordion
            type="multiple"
            value={openAccordions}
            onValueChange={setOpenAccordions}
            className="space-y-1"
          >
            {SIDEBAR_CONFIG.map((group) => {
              const parentParams = new URLSearchParams();
              parentParams.set(
                "category",
                `parent:${encodeURIComponent(group.title)}`,
              );
              const parentHref = buildHref(parentParams);
              const isParentActive = isActiveParams(parentParams);

              return (
                <AccordionItem
                  key={group.title}
                  value={group.title}
                  className="border-0"
                >
                  <div className="flex items-center gap-1">
                    <Link
                      href={parentHref}
                      className={cn(
                        "flex-1 flex items-center py-2 px-3 rounded-lg text-sm transition-colors hover-elevate text-left",
                        isParentActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-foreground hover:bg-muted",
                      )}
                      data-testid={`button-category-${group.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <span>{group.title}</span>
                    </Link>
                    <AccordionTrigger className="p-2 hover:bg-muted rounded-lg [&[data-state=open]>svg]:rotate-180"></AccordionTrigger>
                  </div>
                  <AccordionContent className="pb-0 pt-1">
                    <div className="ml-3 pl-3 border-l border-border/50 space-y-1">
                      {group.links.map((link) => {
                        if (link.subLinks?.length) {
                          return (
                            <div key={link.label} className="space-y-1">
                              <div className="px-3 pt-2 text-[11px] uppercase tracking-wide text-muted-foreground/70">
                                {link.label}
                              </div>
                              {link.subLinks.map((sub) => {
                                const subParams = buildParams(sub, group.title);
                                const subHref = buildHref(subParams);
                                const isActive = isActiveParams(subParams);
                                return (
                                  <Link
                                    key={sub.label}
                                    href={subHref}
                                    className={cn(
                                      "flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm transition-colors hover-elevate text-left",
                                      isActive
                                        ? "bg-primary text-primary-foreground font-medium"
                                        : "text-foreground hover:bg-muted",
                                    )}
                                    data-testid={`button-subcategory-${sub.label.toLowerCase().replace(/\s+/g, "-")}`}
                                  >
                                    <span>{sub.label}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          );
                        }

                        const params = buildParams(link, group.title);
                        const href = buildHref(params);
                        const isActive = isActiveParams(params);

                        return (
                          <Link
                            key={link.label}
                            href={href}
                            className={cn(
                              "flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm transition-colors hover-elevate text-left",
                              isActive
                                ? "bg-primary text-primary-foreground font-medium"
                                : "text-foreground hover:bg-muted",
                            )}
                            data-testid={`button-subcategory-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            <span>{link.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Price Range
        </h3>
        <div className="px-1">
          <Slider
            min={0}
            max={5000}
            step={50}
            value={localPriceRange}
            onValueChange={onPriceRangeChange}
            className="py-4 cursor-pointer"
            data-testid="slider-price-range"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${localPriceRange[0]}</span>
          <span>${localPriceRange[1]}</span>
        </div>
      </div>
    </div>
  );
}
