import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
}: ShopHeaderProps) {
  const showPagination = hasNextPage || hasPrevPage;
  return (
    <div className="flex flex-col md:flex-row justify-end items-center gap-4 mb-8">
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

      <div className="flex gap-2 w-full md:w-auto items-center md:ml-auto">
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

        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Price</span>
          <div className="w-48">
            <Slider
              min={0}
              max={5000}
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

        {/* Mobile price filter */}
        <div className="flex md:hidden items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <div className="w-full max-w-[200px]">
            <Slider
              min={0}
              max={5000}
              step={50}
              value={localPriceRange}
              onValueChange={onPriceRangeChange}
              className="py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
