import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { OrderSummary, PaymentForm } from "@/components/payment";
import { createCheckout } from "@/lib/shopify";
import { SEO } from "@/components/SEO";

export default function Payment() {
  const { toast } = useToast();
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !isRedirecting) {
      setLocation("/");
      toast({
        title: "Cart Empty",
        description:
          "Please add items to your cart before proceeding to checkout.",
        variant: "destructive",
      });
    }
  }, [items, setLocation, toast, isRedirecting]);

  const handlePaymentSubmit = async () => {
    try {
      setIsRedirecting(true);

      const lineItems = items
        .filter((item) => item.variantId)
        .map((item) => ({
          variantId: item.variantId!,
          quantity: item.quantity,
        }));

      if (lineItems.length === 0) {
        toast({
          title: "Checkout Error",
          description:
            "Unable to process checkout. Please try adding items again.",
          variant: "destructive",
        });
        setIsRedirecting(false);
        return;
      }

      const checkoutUrl = await createCheckout(lineItems);

      clearCart();
      window.location.href = checkoutUrl;
    } catch (error) {
      toast({
        title: "Checkout Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create checkout. Please try again.",
        variant: "destructive",
      });
      setIsRedirecting(false);
    }
  };

  if (items.length === 0 && !isRedirecting) return null;

  return (
    <>
      <SEO
        title="Checkout"
        description="Secure checkout for your Mr. Gadgetz order. Review your cart and complete your purchase with fast delivery and official warranty."
        url={"/payment"}
      />

      <div className="min-h-screen py-24 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h1 className="text-4xl font-display font-bold mb-2 text-center">
                Checkout
              </h1>
              <p className="text-muted-foreground text-center">
                Review your order and complete payment.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <OrderSummary
                items={items}
                total={total}
                onRemoveItem={removeItem}
                onUpdateQuantity={updateQuantity}
              />
              <PaymentForm
                total={total}
                onSubmit={handlePaymentSubmit}
                isLoading={isRedirecting}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
