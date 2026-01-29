import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  SlidersHorizontal,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "@/hooks/use-products";
import { ShopSidebar } from "./ShopSidebar";

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
  isAllProducts: boolean;
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
  isAllProducts,
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
            {!isAllProducts &&
              totalPages &&
              totalPages > 0 &&
              ` / ${totalPages}`}
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
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9 rounded-full bg-muted/50 border-transparent hover:bg-muted focus:bg-background transition-all"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            data-testid="input-search-products"
          />
        </div>

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

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden rounded-full"
              data-testid="button-filters-mobile"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader className="mb-6">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <ShopSidebar
              localPriceRange={localPriceRange}
              onPriceRangeChange={onPriceRangeChange}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
