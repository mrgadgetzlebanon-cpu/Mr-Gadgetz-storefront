import { SortOption } from "@/hooks/use-products";

export interface CategorySelection {
  type: "all" | "parent" | "child";
  parent?: string;
  childName?: string;
  handles: string[];
}

export interface ShopState {
  selection: CategorySelection;
  sortKey: SortOption;
  urlPage: number;
  search: string;
  localPriceRange: number[];
  cursorParam: string | null;
}

export interface ShopNavigationOptions {
  category?: string;
  sort?: string;
  page?: number;
  cursor?: string;
  search?: string | null;
}
