import { CategorySelection, ShopNavigationOptions } from "./types";
import { CategoryStructure } from "@/lib/shopify";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function serializeSelection(selection: CategorySelection): string {
  if (selection.type === "all") return "";
  if (selection.type === "parent") return `parent:${selection.parent}`;
  if (selection.type === "child")
    return `child:${selection.parent}:${selection.childName}`;
  return "";
}

export function deserializeSelection(
  param: string | null,
  categoryStructure: CategoryStructure,
): CategorySelection {
  if (!param) return { type: "all", handles: [] };

  const decodedParam = decodeURIComponent(param);

  if (decodedParam.startsWith("parent:")) {
    const parent = decodedParam.substring(7);
    const parentSlug = slugify(parent);
    const category = categoryStructure.grouped.find(
      (g) => g.parent === parent || slugify(g.parent) === parentSlug,
    );
    if (category) {
      return {
        type: "parent",
        parent: category.parent,
        handles: category.parentHandles,
      };
    }
  }

  if (decodedParam.startsWith("child:")) {
    const parts = decodedParam.substring(6).split(":");
    if (parts.length >= 2) {
      const parent = parts[0];
      const childName = parts.slice(1).join(":");
      const parentSlug = slugify(parent);
      const childSlug = slugify(childName);
      const category = categoryStructure.grouped.find(
        (g) => g.parent === parent || slugify(g.parent) === parentSlug,
      );
      const child = category?.children.find(
        (c) => c.name === childName || slugify(c.name) === childSlug,
      );
      if (child) {
        return {
          type: "child",
          parent: category?.parent || parent,
          childName: child.name,
          handles: child.handles,
        };
      }
    }
  }

  return { type: "all", handles: [] };
}

export function buildShopUrl(params: ShopNavigationOptions): string {
  const searchParams = new URLSearchParams();
  if (params.category) searchParams.set("category", params.category);
  if (params.sort && params.sort !== "best_selling")
    searchParams.set("sort", params.sort);
  if (params.page && params.page > 1)
    searchParams.set("page", String(params.page));
  if (params.cursor) searchParams.set("cursor", params.cursor);
  if (params.search && params.search.trim())
    searchParams.set("search", params.search.trim());
  const qs = searchParams.toString();
  return qs ? `/shop?${qs}` : "/shop";
}
