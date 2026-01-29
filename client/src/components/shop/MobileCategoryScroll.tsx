import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CategoryStructure } from "@/lib/shopify";
import { CategorySelection } from "./types";
import { cn } from "@/lib/utils";

interface MobileCategoryScrollProps {
  categoryStructure: CategoryStructure;
  selection: CategorySelection;
  onSelectAll: () => void;
  onSelectParent: (parent: string, handles: string[]) => void;
}

export function MobileCategoryScroll({
  categoryStructure,
  selection,
  onSelectAll,
  onSelectParent,
}: MobileCategoryScrollProps) {
  const categories = categoryStructure?.grouped || [];

  return (
    <div className="md:hidden -mx-4 px-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-3">
          <Button
            variant={selection.type === "all" ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-full shrink-0 h-8",
              selection.type === "all" && "bg-primary text-primary-foreground"
            )}
            onClick={onSelectAll}
            data-testid="button-mobile-category-all"
          >
            All
          </Button>
          {categories.map((category) => {
            const isSelected = selection.type === "parent" && selection.parent === category.parent;
            return (
              <Button
                key={category.parent}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full shrink-0 h-8",
                  isSelected && "bg-primary text-primary-foreground"
                )}
                onClick={() => onSelectParent(category.parent, category.parentHandles)}
                data-testid={`button-mobile-category-${category.parent.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category.parent}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
}
