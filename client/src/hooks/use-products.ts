import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import {
  shopifyFetch,
  ALL_PRODUCTS_QUERY,
  PRODUCTS_BY_COLLECTION_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  COLLECTIONS_QUERY,
  sanitizeCollectionTitle,
  groupCollectionsByParent,
  CollectionsResponse,
  ShopifyCollection,
  CategoryStructure,
} from "@/lib/shopify";

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  createdAt: string;
  productType?: string;
  tags?: string[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  options?: ProductOption[];
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        image?: { url: string | null } | null;
        priceV2?: { amount: string; currencyCode?: string };
        compareAtPriceV2?: { amount: string; currencyCode?: string } | null;
        selectedOptions?: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  vendor?: string;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  label: string;
  description: string;
  image?: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  image?: string | null;
  selectedOptions?: Array<{ name: string; value: string }>;
  price?: string;
  compareAtPrice?: string | null;
  priceV2?: { amount: string; currencyCode?: string };
  compareAtPriceV2?: { amount: string; currencyCode?: string } | null;
}

export interface ExtendedProduct extends Product {
  createdAt: string;
  descriptionHtml?: string;
  options?: ProductOption[];
  variants?: ProductVariant[];
  productType?: string;
  tags?: string[];
}

export type { Product };

function mapShopifyProduct(
  node: ShopifyProductNode,
  collectionTitle?: string,
): ExtendedProduct & { variantId: string } {
  const variant = node.variants.edges[0]?.node;
  const filteredOptions =
    node.options?.filter(
      (opt) =>
        !(
          opt.name === "Title" &&
          opt.values.length === 1 &&
          opt.values[0] === "Default Title"
        ),
    ) || [];
  const mappedVariants: ProductVariant[] = node.variants.edges.map((e) => ({
    id: e.node.id,
    title: e.node.title,
    availableForSale: e.node.availableForSale,
    image: e.node.image?.url || null,
    selectedOptions: e.node.selectedOptions,
    priceV2: e.node.priceV2,
    compareAtPriceV2: e.node.compareAtPriceV2,
    price: e.node.priceV2?.amount || node.priceRange.minVariantPrice.amount,
    compareAtPrice: e.node.compareAtPriceV2?.amount || null,
  }));
  return {
    id: parseInt(node.id.split("/").pop() || "0"),
    handle: node.handle,
    name: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    price: node.priceRange.minVariantPrice.amount,
    originalPrice: variant?.compareAtPriceV2?.amount || null,
    brand: node.vendor || "MR. GADGETZ",
    category: collectionTitle || "All Products",
    rating: "5.0",
    reviewCount: 0,
    image: node.images.edges[0]?.node.url || "",
    images: node.images.edges.map((e) => e.node.url),
    colors: node.variants.edges
      .map((v) => v.node.title)
      .filter((t) => t !== "Default Title"),
    specs: {},
    isNew: true,
    isFeatured: true,
    stock: variant?.availableForSale ? 100 : 0,
    createdAt: node.createdAt,
    variantId: variant?.id || "",
    productType: node.productType,
    tags: node.tags || [],
    options: filteredOptions,
    variants: mappedVariants,
  };
}

function mapShopifyCollection(node: ShopifyCollection): Collection {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    label: sanitizeCollectionTitle(node.title),
    description: node.description,
    image: node.image?.url,
  };
}

export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const data = await shopifyFetch<CollectionsResponse>({
        query: COLLECTIONS_QUERY,
      });
      return data.collections.edges.map((edge) =>
        mapShopifyCollection(edge.node),
      );
    },
  });
}

export function useGroupedCollections(): {
  data: CategoryStructure;
  isLoading: boolean;
  error: Error | null;
} {
  const { data: collections = [], isLoading, error } = useCollections();

  const categoryStructure = groupCollectionsByParent(
    collections.map((c) => ({ handle: c.handle, title: c.title })),
  );

  return { data: categoryStructure, isLoading, error: error as Error | null };
}

export function useProductsFromHandles(handles: string[]) {
  return useQuery({
    queryKey: ["products", "multi", ...handles.sort()],
    queryFn: async () => {
      if (handles.length === 0) return [];

      const allProducts: Product[] = [];
      const seenIds = new Set<number>();

      for (const handle of handles) {
        const data = await shopifyFetch<{
          collection: {
            title: string;
            products: { edges: Array<{ node: ShopifyProductNode }> };
          } | null;
        }>({
          query: PRODUCTS_BY_COLLECTION_QUERY,
          variables: { handle },
        });

        if (data.collection) {
          const collectionTitle = sanitizeCollectionTitle(
            data.collection.title,
          );
          for (const edge of data.collection.products.edges) {
            const product = mapShopifyProduct(edge.node, collectionTitle);
            if (!seenIds.has(product.id)) {
              seenIds.add(product.id);
              allProducts.push(product);
            }
          }
        }
      }

      return allProducts;
    },
    enabled: handles.length > 0,
  });
}

export function useCollectionProducts(handle: string) {
  return useQuery({
    queryKey: ["collection", handle],
    enabled: !!handle,
    queryFn: async () => {
      const data = await shopifyFetch<{
        collection: {
          title: string;
          products: { edges: Array<{ node: ShopifyProductNode }> };
        } | null;
      }>({
        query: PRODUCTS_BY_COLLECTION_QUERY,
        variables: {
          handle,
          first: 100,
          sortKey: "BEST_SELLING",
          reverse: false,
        },
      });

      const products = data.collection
        ? data.collection.products.edges.map((edge) =>
            mapShopifyProduct(
              edge.node,
              sanitizeCollectionTitle(data.collection!.title),
            ),
          )
        : [];

      return { products };
    },
  });
}

export type SortOption = "best_selling" | "newest" | "price_low" | "price_high";

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface PaginatedProductsResult {
  products: ExtendedProduct[];
  pageInfo: PageInfo;
}

interface PaginatedQueryParams {
  handles?: string[];
  sortKey?: SortOption;
  cursor?: string | null;
  first?: number;
  searchQuery?: string;
}

function getSortVariables(sortKey: SortOption): {
  sortKey: string;
  reverse: boolean;
} {
  switch (sortKey) {
    case "newest":
      return { sortKey: "CREATED_AT", reverse: true };
    case "price_low":
      return { sortKey: "PRICE", reverse: false };
    case "price_high":
      return { sortKey: "PRICE", reverse: true };
    case "best_selling":
    default:
      return { sortKey: "BEST_SELLING", reverse: false };
  }
}

export function usePaginatedProducts({
  handles = [],
  sortKey = "best_selling",
  cursor = null,
  first = 24,
  searchQuery = "",
}: PaginatedQueryParams) {
  return useQuery({
    queryKey: [
      "products",
      "paginated",
      handles.join(","),
      sortKey,
      cursor,
      first,
      searchQuery,
    ],
    queryFn: async (): Promise<PaginatedProductsResult> => {
      const { sortKey: gqlSortKey, reverse } = getSortVariables(sortKey);

      if (handles.length === 0) {
        const data = await shopifyFetch<{
          products: {
            pageInfo: PageInfo;
            edges: Array<{ node: ShopifyProductNode }>;
          };
        }>({
          query: ALL_PRODUCTS_QUERY,
          variables: {
            first,
            after: cursor,
            sortKey: gqlSortKey,
            reverse,
            query: searchQuery || undefined,
          },
        });

        return {
          products: data.products.edges.map((edge) =>
            mapShopifyProduct(edge.node),
          ),
          pageInfo: data.products.pageInfo,
        };
      }

      const allProducts: ExtendedProduct[] = [];
      const seenIds = new Set<number>();

      for (const handle of handles) {
        const data = await shopifyFetch<{
          collection: {
            title: string;
            products: {
              pageInfo: PageInfo;
              edges: Array<{ node: ShopifyProductNode }>;
            };
          } | null;
        }>({
          query: PRODUCTS_BY_COLLECTION_QUERY,
          variables: { handle, first: 250, sortKey: gqlSortKey, reverse },
        });

        if (data.collection) {
          const collectionTitle = sanitizeCollectionTitle(
            data.collection.title,
          );
          for (const edge of data.collection.products.edges) {
            const product = mapShopifyProduct(edge.node, collectionTitle);
            if (!seenIds.has(product.id)) {
              seenIds.add(product.id);
              allProducts.push(product);
            }
          }
        }
      }

      allProducts.sort((a, b) => {
        switch (sortKey) {
          case "newest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "price_low":
            return Number(a.price) - Number(b.price);
          case "price_high":
            return Number(b.price) - Number(a.price);
          case "best_selling":
          default:
            return 0;
        }
      });

      return {
        products: allProducts,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      };
    },
  });
}

export function useProducts(collectionHandle?: string) {
  return useQuery({
    queryKey: ["products", collectionHandle || "all"],
    queryFn: async () => {
      if (collectionHandle) {
        const data = await shopifyFetch<{
          collection: {
            title: string;
            products: {
              pageInfo: PageInfo;
              edges: Array<{ node: ShopifyProductNode }>;
            };
          } | null;
        }>({
          query: PRODUCTS_BY_COLLECTION_QUERY,
          variables: { handle: collectionHandle },
        });
        if (!data.collection) return [];
        const collectionTitle = sanitizeCollectionTitle(data.collection.title);
        return data.collection.products.edges.map((edge) =>
          mapShopifyProduct(edge.node, collectionTitle),
        );
      } else {
        const data = await shopifyFetch<{
          products: {
            pageInfo: PageInfo;
            edges: Array<{ node: ShopifyProductNode }>;
          };
        }>({
          query: ALL_PRODUCTS_QUERY,
        });
        return data.products.edges.map((edge) => mapShopifyProduct(edge.node));
      }
    },
  });
}

export function useProduct(id: number) {
  const { data: products } = useProducts();
  return useQuery({
    queryKey: ["products", "detail", id],
    queryFn: async () => {
      const product = products?.find((p) => p.id === id);
      if (!product) throw new Error("Product not found");
      return product;
    },
    enabled: !!products,
  });
}

export function useProductByHandle(handle: string) {
  return useQuery({
    queryKey: ["products", "handle", handle],
    queryFn: async () => {
      const data = await shopifyFetch<{
        product: ShopifyProductNode | null;
      }>({
        query: PRODUCT_BY_HANDLE_QUERY,
        variables: { handle },
      });

      if (!data.product) throw new Error("Product not found");
      return mapShopifyProduct(data.product);
    },
    enabled: !!handle,
  });
}

export function useFeaturedProducts() {
  const { data: products } = useProducts();
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      return products?.filter((p) => p.isFeatured) || [];
    },
    enabled: !!products,
  });
}
