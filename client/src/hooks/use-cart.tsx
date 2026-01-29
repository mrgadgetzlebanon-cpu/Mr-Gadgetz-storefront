import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product & { variantId?: string }, quantity?: number, color?: string) => void;
  removeItem: (productId: number, variantId?: string) => void;
  updateQuantity: (productId: number, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Load cart from local storage on mount and migrate legacy items
  useEffect(() => {
    const savedCart = localStorage.getItem("cart-items");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart) as CartItem[];
        // Filter out legacy items without variantId (incompatible with new checkout)
        const validItems = parsed.filter(item => item.variantId);
        const removedCount = parsed.length - validItems.length;
        if (removedCount > 0) {
          console.warn(`Removed ${removedCount} legacy cart items without variant IDs`);
          localStorage.setItem("cart-items", JSON.stringify(validItems));
          // Notify user about cart update
          setTimeout(() => {
            toast({
              title: "Cart Updated",
              description: `${removedCount} item${removedCount > 1 ? 's were' : ' was'} removed from your cart. Please re-add items to continue shopping.`,
            });
          }, 100);
        }
        setItems(validItems);
      } catch (e) {
        console.error("Failed to parse cart items", e);
        localStorage.removeItem("cart-items");
      }
    }
  }, [toast]);

  // Save to local storage whenever items change
  useEffect(() => {
    localStorage.setItem("cart-items", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product & { variantId?: string }, quantity = 1, color?: string) => {
    if (!product.variantId) {
      toast({
        title: "Cannot add to cart",
        description: "This product is unavailable for purchase.",
        variant: "destructive",
      });
      return;
    }
    
    setItems((prev) => {
      // Key by variantId for proper multi-variant support
      const existing = prev.find((item) => item.variantId === product.variantId);
      if (existing) {
        return prev.map((item) =>
          item.variantId === product.variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { 
        ...product, 
        quantity, 
        selectedColor: color || product.colors?.[0],
        variantId: product.variantId,
      }];
    });
    setIsOpen(true);
    toast({
      title: "Added to cart",
      description: `${product.name} is now in your cart.`,
    });
  };

  const removeItem = (productId: number, variantId?: string) => {
    setItems((prev) => prev.filter((item) => {
      // If variantId provided, match by variant; otherwise match by product ID for backward compat
      if (variantId) {
        return item.variantId !== variantId;
      }
      return item.id !== productId;
    }));
  };

  const updateQuantity = (productId: number, quantity: number, variantId?: string) => {
    if (quantity < 1) {
      removeItem(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (variantId) {
          return item.variantId === variantId ? { ...item, quantity } : item;
        }
        return item.id === productId ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
