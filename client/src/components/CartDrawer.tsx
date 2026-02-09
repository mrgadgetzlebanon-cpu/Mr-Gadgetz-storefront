import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total } =
    useCart();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();

  const handleCheckout = () => {
    setIsOpen(false);
    setLocation("/payment");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "w-full flex flex-col p-0 bg-background/95 backdrop-blur-xl border-border/50",
          isMobile
            ? "h-[75vh] max-h-[85vh] rounded-t-2xl border-t"
            : "h-full sm:max-w-md border-l",
        )}
      >
        <SheetHeader className="px-6 py-4 border-b border-border/50">
          <SheetTitle className="font-display text-xl">
            Shopping Bag ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
              <ShoppingBagIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Your bag is empty</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="mt-4 rounded-full px-8"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="py-6 space-y-6">
                {items.map((item) => (
                  <div
                    key={item.variantId || `${item.id}-${item.selectedColor}`}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-20 bg-muted/30 rounded-lg overflow-hidden shrink-0 border border-border/50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium line-clamp-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id, item.variantId)}
                          className={cn(
                            "text-muted-foreground hover:text-destructive transition-colors",
                            isMobile
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100",
                          )}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.selectedColor}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border rounded-full h-8">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1,
                                item.variantId,
                              )
                            }
                            className="px-2 hover:bg-muted/50 rounded-l-full h-full flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-8 text-center tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1,
                                item.variantId,
                              )
                            }
                            className="px-2 hover:bg-muted/50 rounded-r-full h-full flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-semibold tabular-nums text-[#0c57ef] dark:text-[#48bfef]">
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border/50 bg-background/50 p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums">${total.toFixed(2)}</span>
                </div>
                {/* <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div> */}
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="tabular-nums text-[#0c57ef] dark:text-[#48bfef]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
              <Button
                className="w-full rounded-full h-12 text-base font-medium bg-[#0c57ef] text-white border-[#0c57ef] shadow-[0_4px_20px_rgba(12,87,239,0.3)] hover:shadow-[0_4px_25px_rgba(72,191,239,0.4)] transition-all"
                size="lg"
                onClick={handleCheckout}
              >
                Checkout <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
