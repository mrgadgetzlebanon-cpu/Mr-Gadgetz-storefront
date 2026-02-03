import { useState } from "react";
import { Package, CheckCircle } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import type { ExtendedProduct } from "@/hooks/use-products";
import type {
  ProductWithVariants,
  ProductVariantNode,
} from "@/hooks/use-product-variant";
import { ProductPrice } from "./ProductPrice";
import { OptionSelector } from "./OptionSelector";
import { AddToCartButton } from "./AddToCartButton";
import { ProductAIChat } from "@/components/ProductAIChat";

type ProductInfoProduct = (ExtendedProduct & ProductWithVariants) & {
  variantId?: string;
};

interface ProductInfoProps {
  product: ProductInfoProduct;
  activeVariant: ProductVariantNode | null;
  selectedOptions: Record<string, string>;
  onSelectOption: (optionName: string, value: string) => void;
  displayPrice: string;
  displayCompareAt?: string | null;
  currencyCode?: string;
  hasComparePrice: boolean;
  resolvedVariantId: string;
  selectedOptionsText: string;
}

export function ProductInfo({
  product,
  activeVariant,
  selectedOptions,
  onSelectOption,
  displayPrice,
  displayCompareAt,
  currencyCode,
  hasComparePrice,
  resolvedVariantId,
  selectedOptionsText,
}: ProductInfoProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem(
      { ...product, variantId: resolvedVariantId },
      quantity,
      selectedOptionsText || undefined,
    );
  };

  return (
    <div className="space-y-6">
      <ProductHeader
        product={product}
        price={displayPrice}
        compareAt={displayCompareAt}
        currencyCode={currencyCode}
        hasComparePrice={hasComparePrice}
      />

      <OptionSelector
        options={product.options}
        selectedOptions={selectedOptions}
        onSelect={onSelectOption}
      />

      <AddToCartButton
        quantity={quantity}
        onIncrease={() => setQuantity((prev) => prev + 1)}
        onDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
        onAdd={handleAddToCart}
        isAvailable={activeVariant?.availableForSale ?? true}
      />

      <ProductAIChat product={product} />

      <InfoTiles isAvailable={activeVariant?.availableForSale ?? true} />
    </div>
  );
}

function ProductHeader({
  product,
  price,
  compareAt,
  currencyCode,
  hasComparePrice,
}: {
  product: ProductInfoProduct;
  price: string;
  compareAt?: string | null;
  currencyCode?: string;
  hasComparePrice: boolean;
}) {
  const isUsed = product.productType === "Used";
  const displayType = isUsed
    ? product.tags?.[0] || product.productType || "Used"
    : product.productType;
  return (
    <div>
      {(product.isNew || isUsed) && (
        <div className="flex items-center gap-2 mb-3">
          {product.isNew && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full"
              data-testid={`badge-new-${product.id}`}
            >
              New
            </span>
          )}
          {isUsed && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full"
              data-testid={`badge-used-${product.id}`}
            >
              Used
            </span>
          )}
        </div>
      )}
      <h1 className="text-2xl md:text-3xl font-display font-bold mb-4 leading-tight">
        {product.name}
      </h1>

      {product.brand && (
        <p className="text-sm text-muted-foreground mb-2">
          Vendor: {product.brand}
        </p>
      )}
      {displayType && (
        <p className="text-sm text-muted-foreground mb-2">
          Type: {displayType}
        </p>
      )}
      <ProductPrice
        price={price}
        compareAt={compareAt}
        currencyCode={currencyCode}
        hasComparePrice={hasComparePrice}
      />
    </div>
  );
}
function InfoTiles({ isAvailable }: { isAvailable: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 pt-4">
      <div className="bg-muted/30 p-4 rounded-xl flex items-start gap-3">
        <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
        <div>
          <h4 className="font-medium text-sm">Excluded VAT</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Price excludes taxes
          </p>
        </div>
      </div>
      <div className="bg-muted/30 p-4 rounded-xl flex items-start gap-3">
        <CheckCircle
          className={`w-5 h-5 ${isAvailable ? "text-green-500" : "text-muted-foreground"} mt-0.5`}
        />
        <div>
          <h4 className="font-medium text-sm">Availability</h4>
          <p className="text-xs mt-1 font-medium">
            {isAvailable ? (
              <span className="text-green-600 dark:text-green-400">
                In Stock
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400">
                Selected variant is unavailable
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
