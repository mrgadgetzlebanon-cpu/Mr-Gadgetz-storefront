import { useMemo, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface ShopSidebarProps {
  localPriceRange: number[];
  onPriceRangeChange: (value: number[]) => void;
}

// Mirrors COLLECTION_MAP keys from utils.ts (lowercase IDs)
const SIDEBAR_TREE: Array<{ id: string; label: string; children?: string[] }> =
  [
    {
      id: "phones",
      label: "Phones",
      children: ["Mobile Phones", "Mobile Accessories"],
    },
    {
      id: "tablets",
      label: "Tablets",
      children: ["Tablets", "Tablet Accessories"],
    },
    {
      id: "pc and laptops",
      label: "Laptops & PCs",
      children: [
        "Laptops",
        "Dell",
        "HP",
        "MacBook",
        "Lenovo",
        "Acer",
        "Asus",
        "Keyboards",
        "Mice",
        "Desktops",
      ],
    },
    {
      id: "accessories",
      label: "Accessories",
      children: [
        "Wearables",
        "Mobile Accessories",
        "Mobile Covers",
        "Mobile Phone Stand",
        "Tablet Accessories",
        "Computer Accessories",
        "Screen Protectors",
        "Power Bank",
        "Touch Pen",
        "Storage",
        "Charger and Cable",
        "Smart Tags",
        "Car Accessories",
        "E-Cigarettes",
      ],
    },
    {
      id: "audio",
      label: "Audio",
      children: [
        "Headphones",
        "Earbuds",
        "Earphones",
        "Speakers",
        "Microphones",
      ],
    },
    {
      id: "watches",
      label: "Watches",
      children: ["Smartwatches", "Wearables"],
    },
    {
      id: "cameras",
      label: "Cameras",
      children: ["Cameras", "Camera Accessories"],
    },
    {
      id: "smart home",
      label: "Smart Home",
      children: ["Smart Home", "Dyson", "Home Appliances"],
    },
    { id: "networking", label: "Networking", children: ["Networking"] },
  ];

function getActiveCategory(searchString: string): string | null {
  const params = new URLSearchParams(searchString);
  const category = params.get("category");
  return category ? decodeURIComponent(category) : null;
}

function isParentActive(activeCategory: string | null, id: string) {
  return activeCategory === `parent:${id}`;
}

function isChildActive(
  activeCategory: string | null,
  parentId: string,
  child: string,
) {
  return activeCategory === `child:${parentId}:${child}`;
}

export function ShopSidebar({
  localPriceRange,
  onPriceRangeChange,
}: ShopSidebarProps) {
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const activeCategory = useMemo(
    () => getActiveCategory(searchString),
    [searchString],
  );

  const initialExpanded = useMemo(() => {
    if (!activeCategory) return [] as string[];
    if (activeCategory.startsWith("child:")) {
      const [, parentId] = activeCategory.split(":");
      return [parentId];
    }
    if (activeCategory.startsWith("parent:")) {
      return [activeCategory.replace("parent:", "")];
    }
    return [] as string[];
  }, [activeCategory]);

  const [expandedParents, setExpandedParents] =
    useState<string[]>(initialExpanded);

  const navigateWithCategory = (category: string) => {
    const params = new URLSearchParams(searchString);
    params.set("category", category);
    params.delete("page");
    params.delete("cursor");
    const qs = params.toString();
    setLocation(qs ? `/shop?${qs}` : "/shop");
  };

  const handleParentClick = (parentId: string) => {
    navigateWithCategory(`parent:${parentId}`);
  };

  const handleChildClick = (parentId: string, child: string) => {
    navigateWithCategory(`child:${parentId}:${child}`);
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
          <button
            onClick={() => handleParentClick("ALL_PRODUCTS")}
            className={cn(
              "flex items-center w-full py-2 px-3 rounded-lg text-sm transition-colors hover-elevate text-left",
              activeCategory === "parent:ALL_PRODUCTS"
                ? "bg-primary text-primary-foreground font-medium"
                : "text-foreground hover:bg-muted",
            )}
            data-testid="button-all-products"
          >
            <span>All Products</span>
          </button>

          <Accordion
            type="multiple"
            value={expandedParents}
            onValueChange={setExpandedParents}
            className="space-y-1"
          >
            {SIDEBAR_TREE.map((group) => {
              const parentActive = isParentActive(activeCategory, group.id);

              return (
                <AccordionItem
                  key={group.id}
                  value={group.id}
                  className="border-0"
                >
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleParentClick(group.id)}
                      className={cn(
                        "flex-1 flex items-center py-2 px-3 rounded-lg text-sm transition-colors hover-elevate text-left",
                        parentActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-foreground hover:bg-muted",
                      )}
                      data-testid={`button-category-${group.id.replace(/\s+/g, "-")}`}
                    >
                      <span>{group.label}</span>
                    </button>
                    {group.children && group.children.length > 0 && (
                      <AccordionTrigger className="p-2 hover:bg-muted rounded-lg [&[data-state=open]>svg]:rotate-180" />
                    )}
                  </div>
                  {group.children && group.children.length > 0 && (
                    <AccordionContent className="pb-0 pt-1">
                      <div className="ml-3 pl-3 border-l border-border/50 space-y-1">
                        {group.children.map((child) => {
                          const childActive = isChildActive(
                            activeCategory,
                            group.id,
                            child,
                          );
                          return (
                            <button
                              key={child}
                              onClick={() => handleChildClick(group.id, child)}
                              className={cn(
                                "flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm transition-colors hover-elevate text-left",
                                childActive
                                  ? "bg-primary text-primary-foreground font-medium"
                                  : "text-foreground hover:bg-muted",
                              )}
                              data-testid={`button-subcategory-${child.replace(/\s+/g, "-")}`}
                            >
                              <span>{child}</span>
                            </button>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  )}
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
