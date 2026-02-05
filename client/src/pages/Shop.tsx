import { Helmet } from "react-helmet-async";
import { useSearch } from "wouter";
import { SortOption } from "@/hooks/use-products";
import { ShopCategoryView } from "@/components/shop/ShopCategoryView";

export default function Shop() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const sortParam = params.get("sort") as SortOption | null;
  const pageParam = params.get("page");
  const cursorParam = params.get("cursor");
  const searchParam = params.get("search");

  // Generate page title based on current view
  const getPageTitle = () => {
    if (searchParam) {
      return `Search: ${searchParam} | Mr. Gadgetz`;
    }
    return "Shop | Mr. Gadgetz";
  };

  const getPageDescription = () => {
    if (searchParam) {
      return `Search results for "${searchParam}" at Mr. Gadgetz. Find the best electronics and gadgets.`;
    }
    return "Browse all products at Mr. Gadgetz. Discover smartphones, laptops, audio, gaming gear, and more.";
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
        sortParam={sortParam}
        pageParam={pageParam}
        cursorParam={cursorParam}
        searchParam={searchParam}
      />
    </>
  );
}
