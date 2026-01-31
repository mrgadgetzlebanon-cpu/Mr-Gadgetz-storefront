import { useCallback, useEffect, useMemo, useState } from "react";

export interface MoneyV2 {
  amount: string;
  currencyCode?: string;
}

export interface VariantSelectedOption {
  name: string;
  value: string;
}

export interface ProductOptionNode {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariantNode {
  id: string;
  title: string;
  availableForSale: boolean;
  image?: string | null;
  priceV2?: MoneyV2;
  compareAtPriceV2?: MoneyV2 | null;
  price?: string | MoneyV2;
  compareAtPrice?: string | MoneyV2 | null;
  selectedOptions?: VariantSelectedOption[];
}

export interface ProductWithVariants {
  id: string | number;
  title?: string;
  name?: string;
  handle?: string | null;
  price?: string;
  originalPrice?: string | null;
  options?: ProductOptionNode[];
  variants?: ProductVariantNode[];
  variantId?: string;
}

interface NormalizedVariant extends ProductVariantNode {
  resolvedPrice: MoneyV2;
  resolvedCompareAtPrice: MoneyV2 | null;
}

const REQUIRED_OPTIONS = ["Color", "Sim", "Storage"];

const normalizeName = (value: string) => value.trim().toLowerCase();

function normalizeMoney(
  value: string | MoneyV2 | null | undefined,
  fallbackAmount?: string,
  fallbackCurrency?: string,
): MoneyV2 | null {
  if (typeof value === "object" && value?.amount) {
    return {
      amount: value.amount,
      currencyCode: value.currencyCode || fallbackCurrency || "USD",
    };
  }

  if (typeof value === "string" && value !== "") {
    return {
      amount: value,
      currencyCode: fallbackCurrency || "USD",
    };
  }

  if (fallbackAmount) {
    return {
      amount: fallbackAmount,
      currencyCode: fallbackCurrency || "USD",
    };
  }

  return null;
}

function buildInitialOptions(
  product: ProductWithVariants,
): Record<string, string> {
  const initial: Record<string, string> = {};
  const firstVariant = product.variants?.[0];

  if (firstVariant?.selectedOptions?.length) {
    firstVariant.selectedOptions.forEach((opt) => {
      initial[opt.name] = opt.value;
    });
  } else {
    product.options?.forEach((option) => {
      if (option.values.length > 0) {
        initial[option.name] = option.values[0];
      }
    });
  }

  return initial;
}

const normalizeValue = (val: string) =>
  val.trim().toLowerCase().replace(/\s+/g, " ");

export function useProductVariant(product: ProductWithVariants) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => buildInitialOptions(product));

  useEffect(() => {
    setSelectedOptions(buildInitialOptions(product));
  }, [product.id, product.handle]);

  const normalizedVariants = useMemo<NormalizedVariant[]>(() => {
    return (product.variants || []).map((variant) => {
      const resolvedPrice =
        normalizeMoney(variant.priceV2 ?? variant.price, product.price) ||
        ({ amount: product.price || "0", currencyCode: "USD" } as MoneyV2);

      const resolvedCompareAtPrice = normalizeMoney(
        variant.compareAtPriceV2 ?? variant.compareAtPrice,
        product.originalPrice || undefined,
        resolvedPrice.currencyCode,
      );

      return {
        ...variant,
        resolvedPrice,
        resolvedCompareAtPrice,
      };
    });
  }, [product.originalPrice, product.price, product.variants]);

  const activeVariant = useMemo(() => {
    if (!normalizedVariants.length) return null;

    return (
      normalizedVariants.find((variant) => {
        // Dynamically match against ALL options defined for this product
        return product.options?.every((option) => {
          const selectedValue = selectedOptions[option.name];
          const variantOption = variant.selectedOptions?.find(
            (opt) => normalizeValue(opt.name) === normalizeValue(option.name),
          );

          // Fuzzy match to handle "1SIM/ 1 E-SIM" vs "1SIM/1 E-SIM"
          return (
            variantOption &&
            normalizeValue(variantOption.value) ===
              normalizeValue(selectedValue || "")
          );
        });
      }) || normalizedVariants[0]
    );
  }, [normalizedVariants, selectedOptions, product.options]);

  const handleOptionSelect = useCallback(
    (optionName: string, value: string) => {
      setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
    },
    [],
  );

  const displayPrice =
    activeVariant?.resolvedPrice.amount || product.price || "0";
  const displayCompareAt =
    activeVariant?.resolvedCompareAtPrice?.amount ||
    product.originalPrice ||
    null;
  const currencyCode = activeVariant?.resolvedPrice.currencyCode || "USD";
  const hasComparePrice =
    !!displayCompareAt && Number(displayCompareAt) > Number(displayPrice);

  const selectedOptionsText = useMemo(() => {
    if (!Object.keys(selectedOptions).length) return "";
    return Object.entries(selectedOptions)
      .map(([name, value]) => `${name}: ${value}`)
      .join(", ");
  }, [selectedOptions]);

  return {
    activeVariant,
    selectedOptions,
    handleOptionSelect,
    displayPrice,
    displayCompareAt,
    currencyCode,
    hasComparePrice,
    resolvedVariantId: activeVariant?.id || product.variantId || "",
    selectedOptionsText,
  } as const;
}
