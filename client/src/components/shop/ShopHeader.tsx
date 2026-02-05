import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "@/hooks/use-products";
import { Slider } from "@/components/ui/slider";

interface ShopHeaderProps {
  pageTitle: string;
  productCount: number;
  isFetching: boolean;
  isLoading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  sortKey: SortOption;
  onSortChange: (value: string) => void;
  localPriceRange: number[];
  onPriceRangeChange: (value: number[]) => void;
  maxPrice: number;
  currentPage: number;
  totalPages?: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function ShopHeader({
  pageTitle,
  productCount,
  isFetching,
  isLoading,
  search,
  onSearchChange,
  sortKey,
  onSortChange,
  localPriceRange,
  onPriceRangeChange,
  maxPrice,
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
}: ShopHeaderProps) {
  const showPagination = hasNextPage || hasPrevPage;
  return (
    <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-end">
      {showPagination && (
        <div className="flex items-center gap-2 md:mr-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevPage}
            disabled={!hasPrevPage || isFetching}
            className="rounded-full h-9 w-9"
            data-testid="button-header-prev-page"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[80px] text-center">
            Page {currentPage}
            {totalPages && totalPages > 0 && ` / ${totalPages}`}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={onNextPage}
            disabled={!hasNextPage || isFetching}
            className="rounded-full h-9 w-9"
            data-testid="button-header-next-page"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
      <div className="hidden md:flex gap-2 items-center md:ml-auto">
        <Select value={sortKey} onValueChange={onSortChange}>
          <SelectTrigger
            className="w-[140px] rounded-full"
            data-testid="select-sort"
          >
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="best_selling">Top Selling</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_low">Price: Low</SelectItem>
            <SelectItem value="price_high">Price: High</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Price</span>
          <div className="w-48">
            <Slider
              min={0}
              max={maxPrice}
              step={50}
              value={localPriceRange}
              onValueChange={onPriceRangeChange}
              className="py-2"
              data-testid="slider-price-range-inline"
            />
          </div>
          <span className="text-xs text-muted-foreground w-28 text-right">
            ${localPriceRange[0]} - ${localPriceRange[1]}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 md:hidden">
        <Select value={sortKey} onValueChange={onSortChange}>
          <SelectTrigger
            className="w-full rounded-full"
            data-testid="select-sort-mobile"
          >
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="best_selling">Top Selling</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_low">Price: Low</SelectItem>
            <SelectItem value="price_high">Price: High</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex flex-col gap-1">
          <Slider
            min={0}
            max={maxPrice}
            step={50}
            value={localPriceRange}
            onValueChange={onPriceRangeChange}
            className="py-2"
            data-testid="slider-price-range-mobile"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>${localPriceRange[0]}</span>
            <span>${localPriceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
