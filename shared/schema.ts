// Shared product and cart types used across the app.
export interface Money {
  amount: string;
  currencyCode?: string;
}

export interface ProductOptionValue {
  name: string;
  value: string;
}

export interface ProductOption {
  id?: string;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  image?: string | null;
  selectedOptions?: ProductOptionValue[];
  price?: string;
  compareAtPrice?: string | null;
  priceV2?: Money;
  compareAtPriceV2?: Money | null;
}

export interface Product {
  id: number;
  handle: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string | null;
  category?: string;
  brand?: string;
  rating?: string;
  reviewCount?: number;
  image: string;
  images?: string[];
  colors?: string[];
  specs?: Record<string, string | number>;
  isNew?: boolean;
  isFeatured?: boolean;
  stock?: number;
  productType?: string;
  descriptionHtml?: string;
  warranty?: string | null;
  tags?: string[];
  options?: ProductOption[];
  variants?: ProductVariant[];
  variantId?: string;
  createdAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  variantId?: string;
}
