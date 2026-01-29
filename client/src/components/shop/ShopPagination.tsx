import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ShopPaginationProps {
  currentPage: number;
  totalPages?: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isFetching: boolean;
  isAllProducts: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function ShopPagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  isFetching,
  isAllProducts,
  onNextPage,
  onPrevPage,
}: ShopPaginationProps) {
  if (!hasNextPage && !hasPrevPage) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      <Button
        variant="outline"
        onClick={onPrevPage}
        disabled={!hasPrevPage || isFetching}
        className="rounded-full gap-2"
        data-testid="button-prev-page"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>
      
      <span className="text-sm text-muted-foreground px-4">
        Page {currentPage}{!isAllProducts && totalPages && totalPages > 0 && ` of ${totalPages}`}
      </span>
      
      <Button
        variant="outline"
        onClick={onNextPage}
        disabled={!hasNextPage || isFetching}
        className="rounded-full gap-2"
        data-testid="button-next-page"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
