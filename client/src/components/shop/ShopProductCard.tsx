import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

interface ShopProductCardProps {
  product: Product;
}

export function ShopProductCard({ product }: ShopProductCardProps) {
  const { addItem } = useCart();
  const hasDiscount = product.originalPrice && Number(product.originalPrice) > Number(product.price);
  const savings = hasDiscount
    ? Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)
    : 0;

  const variantId = (product as any).variantId;
  const isAvailable = !!variantId && product.stock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variantId) return;
    addItem({
      ...product,
      variantId,
    }, 1);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden h-full flex flex-col"
      data-testid={`product-card-${product.id}`}
    >
      {savings > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          -{savings}%
        </div>
      )}

      <Link href={`/product/${product.handle}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted/30 p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant="secondary"
              className="w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm shadow-lg"
              aria-label="Quick view"
              data-testid={`quick-view-${product.id}`}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <Link href={`/product/${product.handle}`}>
          <h3 className="font-medium text-sm leading-tight line-clamp-2 mb-2 group-hover:text-brand-blue transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-brand-blue dark:text-brand-cyan">
              ${Number(product.price).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className="w-full bg-brand-blue hover:bg-brand-azure text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
            data-testid={`add-to-cart-${product.id}`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAvailable ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
