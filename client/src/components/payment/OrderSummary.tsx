import { ShoppingBag, Trash2, Minus, Plus, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "@shared/schema";

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  onRemoveItem: (id: number, variantId?: string) => void;
  onUpdateQuantity: (id: number, quantity: number, variantId?: string) => void;
}

export function OrderSummary({ items, total, onRemoveItem, onUpdateQuantity }: OrderSummaryProps) {
  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="bg-background p-8 rounded-[2rem] border border-border shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Order Summary
        </h2>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.variantId || `${item.id}-${item.selectedColor}`} className="flex gap-4">
                <div className="w-20 h-20 bg-muted/30 rounded-2xl overflow-hidden shrink-0 border border-border/50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                    <button
                      onClick={() => onRemoveItem(item.id, item.variantId)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      data-testid={`button-remove-item-${item.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.selectedColor}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-full h-7">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.variantId)}
                        className="px-2 hover:bg-muted/50 rounded-l-full h-full flex items-center justify-center"
                        data-testid={`button-decrease-${item.id}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.variantId)}
                        className="px-2 hover:bg-muted/50 rounded-r-full h-full flex items-center justify-center"
                        data-testid={`button-increase-${item.id}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-semibold text-sm text-[#0c57ef] dark:text-[#48bfef]">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-8 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${total.toFixed(2)}</span>
          </div>
          {/* <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
          </div> */}
          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-[#0c57ef] dark:text-[#48bfef]">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0c57ef]/5 p-6 rounded-[1.5rem] border border-[#0c57ef]/10">
        <div className="flex items-center gap-2 mb-3 text-[#0c57ef] dark:text-[#48bfef]">
          <ShieldCheck className="w-5 h-5" />
          <span className="font-semibold text-sm">Secure Checkout</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your data is protected by AES-256 encryption. By placing this order, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}
