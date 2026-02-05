import { Helmet } from "react-helmet-async";
import { useSearch } from "wouter";
import { SortOption } from "@/hooks/use-products";
import { ShopCategoryView } from "@/components/shop/ShopCategoryView";

function toTitle(text: string) {
  const cleaned = text.replace(/[-_]+/g, " ").trim();
  if (!cleaned) return "Collection";
  return cleaned
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Collection({ params }: { params: { handle: string } }) {
  const { handle } = params;
  const searchString = useSearch();
  const paramsObj = new URLSearchParams(searchString);
  const sortParam = paramsObj.get("sort") as SortOption | null;
  const pageParam = paramsObj.get("page");
  const cursorParam = paramsObj.get("cursor");
  const searchParam = paramsObj.get("search");

  const titleText = toTitle(handle);
  const pageTitle = `${titleText} | Mr. Gadgetz`;
  const pageDescription = `Browse ${titleText} at Mr. Gadgetz. Discover curated products in this collection.`;

  const basePath = `/collections/${handle}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Helmet>
      <ShopCategoryView
        sortParam={sortParam}
        pageParam={pageParam}
        cursorParam={cursorParam}
        searchParam={searchParam}
        handles={[handle]}
        basePath={basePath}
        pageTitleOverride={titleText}
      />
    </>
  );
}
