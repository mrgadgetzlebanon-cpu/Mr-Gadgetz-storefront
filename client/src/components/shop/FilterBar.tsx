import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  filters: string[];
  activeFilters: string[];
  onToggle: (filter: string) => void;
  onClear: () => void;
}

export function FilterBar({
  filters,
  activeFilters,
  onToggle,
  onClear,
}: FilterBarProps) {
  if (!filters || filters.length === 0) return null;

  return (
    <div className="mt-2 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Filter by type or tag
        </span>
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground"
            onClick={onClear}
            data-testid="button-clear-filters"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {filters.map((filter) => {
            const isActive = activeFilters.includes(filter);
            return (
              <Button
                key={filter}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full h-8 px-3",
                  isActive && "bg-primary text-primary-foreground",
                )}
                onClick={() => onToggle(filter)}
                data-testid={`filter-pill-${filter.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              >
                {filter}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
}
