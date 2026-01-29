interface ProductPriceProps {
  price: string;
  compareAt?: string | null;
  currencyCode?: string;
  hasComparePrice?: boolean;
}

const formatCurrency = (amount: string, currencyCode = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(Number(amount));

export function ProductPrice({
  price,
  compareAt,
  currencyCode,
  hasComparePrice,
}: ProductPriceProps) {
  const shouldShowCompare = Boolean(hasComparePrice && compareAt);
  const savings = shouldShowCompare ? Number(compareAt) - Number(price) : null;

  return (
    <div className="flex items-baseline gap-3 mb-4 flex-wrap">
      {shouldShowCompare && compareAt && (
        <span className="text-lg text-zinc-400 line-through tabular-nums">
          {formatCurrency(compareAt, currencyCode)}
        </span>
      )}
      <span className="text-2xl font-bold tabular-nums text-[#0c57ef] dark:text-[#48bfef]">
        {formatCurrency(price, currencyCode)}
      </span>
      {/*shouldShowCompare && savings !== null && (
        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
          Save {formatCurrency(savings.toString(), currencyCode)}
        </span>
      )*/}
    </div>
  );
}
