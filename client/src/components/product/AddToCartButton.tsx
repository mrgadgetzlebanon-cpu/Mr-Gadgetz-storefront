import { Minus, Plus } from "lucide-react";

interface AddToCartButtonProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onAdd: () => void;
  isAvailable?: boolean;
}

export function AddToCartButton({
  quantity,
  onIncrease,
  onDecrease,
  onAdd,
  isAvailable = true,
}: AddToCartButtonProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-border/50">
      <div className="flex items-center border border-border rounded-full h-12 w-fit">
        <button
          onClick={onDecrease}
          className="px-4 hover:bg-muted/50 rounded-l-full h-full flex items-center justify-center transition-colors"
          data-testid="button-quantity-minus"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span
          className="text-base w-10 text-center tabular-nums"
          data-testid="text-quantity"
        >
          {quantity}
        </span>
        <button
          onClick={onIncrease}
          className="px-4 hover:bg-muted/50 rounded-r-full h-full flex items-center justify-center transition-colors"
          data-testid="button-quantity-plus"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <button
          className="
            relative overflow-hidden z-10 w-full rounded-full h-12 text-sm font-medium transition-all duration-500 ease-in-out
            bg-[#0c57ef] text-white border-[#0c57ef]
            shadow-[0_4px_15px_rgba(12,87,239,0.3)]
            hover:shadow-[0_4px_20px_rgba(72,191,239,0.4)]
            hover:text-[#0c57ef]

            before:content-[''] before:absolute before:z-[-1] before:block
            before:w-[150%] before:h-0 before:rounded-[50%]
            before:left-1/2 before:top-[100%]
            before:translate-x-[-50%] before:translate-y-[-50%]
            before:bg-white before:transition-all before:duration-500

            hover:before:h-[300%] hover:before:top-1/2
          "
          onClick={onAdd}
          disabled={!isAvailable}
          aria-disabled={!isAvailable}
          data-testid="button-add-to-cart"
        >
          {isAvailable ? "Add to Cart" : "Unavailable"}
        </button>
        {!isAvailable && (
          <p className="text-xs text-muted-foreground">
            Selected variant is currently out of stock.
          </p>
        )}
      </div>
    </div>
  );
}
