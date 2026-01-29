import { motion } from "framer-motion";
import { Lock, ShieldCheck, CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiVisa, SiMastercard, SiApplepay, SiGooglepay, SiShopify } from "react-icons/si";
import { useState } from "react";

interface PaymentFormProps {
  total: number;
  onSubmit: () => Promise<void>;
  isLoading?: boolean;
}

export function PaymentForm({ total, onSubmit, isLoading = false }: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = isLoading || isSubmitting;

  return (
    <div className="lg:col-span-7">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background p-8 md:p-10 rounded-[2.5rem] border border-border shadow-xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Secure Checkout</h2>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-600" />
            <span className="text-sm text-muted-foreground">SSL Secured</span>
          </div>
        </div>

        <div className="mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-green-600 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Powered by Shopify Checkout</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                You'll be securely redirected to Shopify's checkout to complete your purchase. 
                Your payment information is protected by industry-leading encryption.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm font-medium text-muted-foreground mb-4">Accepted Payment Methods</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm">Credit/Debit</span>
            </div>
            <SiVisa size={40} className="text-[#1A1F71]" />
            <SiMastercard size={32} className="text-[#EB001B]" />
            <SiApplepay size={40} className="text-foreground" />
            <SiGooglepay size={40} className="text-foreground" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-4 border-t border-border">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-[#0c57ef] dark:text-[#48bfef]">${total.toFixed(2)}</span>
          </div>

          <Button
            onClick={handleClick}
            className="w-full rounded-full h-14 text-lg font-bold bg-[#0c57ef] text-white border-[#0c57ef] shadow-[0_4px_25px_rgba(12,87,239,0.3)] hover:shadow-[0_4px_30px_rgba(72,191,239,0.5)]"
            disabled={disabled}
            data-testid="button-complete-purchase"
          >
            {disabled ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Redirecting to Checkout...
              </>
            ) : (
              <>
                Proceed to Checkout
                <ExternalLink className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 pt-4">
            <SiShopify className="w-5 h-5 text-[#96BF48]" />
            <p className="text-center text-xs text-muted-foreground">
              Secure checkout powered by Shopify
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
