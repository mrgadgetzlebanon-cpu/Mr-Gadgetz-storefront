import { useSearch } from "wouter";
import { SortOption } from "@/hooks/use-products";
import { ShopCategoryView } from "@/components/shop/ShopCategoryView";
import { buildCanonicalUrl } from "@/lib/seo";
import { SEO } from "@/components/SEO";

export default function Shop() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const sortParam = params.get("sort") as SortOption | null;
  const pageParam = params.get("page");
  const cursorParam = params.get("cursor");
  const searchParam = params.get("search");

  const pageTitle = searchParam ? `Search: ${searchParam}` : "Shop";

  const getPageDescription = () => {
    if (searchParam) {
      return `Search results for "${searchParam}" at Mr. Gadgetz. Find the best electronics and gadgets.`;
    }
    return "Browse all products at Mr. Gadgetz. Discover smartphones, laptops, audio, gaming gear, and more.";
  };

  return (
    <>
      <SEO
        title={pageTitle}
        description={getPageDescription()}
        url={buildCanonicalUrl("/shop")}
      />
      <ShopCategoryView
        sortParam={sortParam}
        pageParam={pageParam}
        cursorParam={cursorParam}
        searchParam={searchParam}
      />
    </>
  );
}
