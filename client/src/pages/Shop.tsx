import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { SortOption } from "@/hooks/use-products";
import { ShopCategoryView } from "@/components/shop/ShopCategoryView";

export default function Shop() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const categoryParam = params.get("category");
  const sortParam = params.get("sort") as SortOption | null;
  const pageParam = params.get("page");
  const cursorParam = params.get("cursor");
  const searchParam = params.get("search");
  const effectiveCategory = categoryParam || "parent:ALL_PRODUCTS";

  // Ensure URL reflects the default category to avoid blank render on direct /shop
  useEffect(() => {
    if (!categoryParam) {
      setLocation("/shop?category=parent:ALL_PRODUCTS", { replace: true });
    }
  }, [categoryParam, setLocation]);

  // Generate page title based on current view
  const getPageTitle = () => {
    if (searchParam) {
      return `Search: ${searchParam} | Mr. Gadgetz`;
    }
    const [, categoryName] = effectiveCategory.split(":");
    if (categoryName === "ALL_PRODUCTS") {
      return "All Products | Mr. Gadgetz";
    }
    return `${categoryName} | Mr. Gadgetz`;
    return "Shop | Mr. Gadgetz";
  };

  const getPageDescription = () => {
    if (searchParam) {
      return `Search results for "${searchParam}" at Mr. Gadgetz. Find the best electronics and gadgets.`;
    }
    const [, categoryName] = effectiveCategory.split(":");
    if (categoryName === "ALL_PRODUCTS") {
      return "Browse all products at Mr. Gadgetz. Discover smartphones, laptops, audio, gaming gear, and more.";
    }
    return `Shop ${categoryName} at Mr. Gadgetz. Discover premium electronics and gadgets with fast shipping.`;
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getPageDescription()} />
      </Helmet>
      <ShopCategoryView
        categoryParam={effectiveCategory}
        sortParam={sortParam}
        pageParam={pageParam}
        cursorParam={cursorParam}
        searchParam={searchParam}
      />
    </>
  );
}
