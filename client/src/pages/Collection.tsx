import { useSearch } from "wouter";
import { SortOption } from "@/hooks/use-products";
import { ShopCategoryView } from "@/components/shop/ShopCategoryView";
import {
  buildPageTitle,
  buildMetaDescription,
  buildCanonicalUrl,
} from "@/lib/seo";
import { SEO } from "@/components/SEO";

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
  const pageTitle = buildPageTitle(titleText);
  const pageDescription = buildMetaDescription();

  const basePath = `/collections/${handle}`;

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        url={buildCanonicalUrl(`/collections/${handle}`)}
      />
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
