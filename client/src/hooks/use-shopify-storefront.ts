import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { shopifyFetch, sanitizeCollectionTitle } from "@/lib/shopify";

interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  createdAt: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  warranty?: { value?: string | null } | null;
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
        compareAtPrice: {
          amount: string;
        } | null;
      };
    }>;
  };
}

export interface ExtendedProduct extends Product {
  createdAt: string;
  descriptionHtml?: string;
  variantId: string;
  warranty?: string | null;
}

function mapShopifyProduct(
  node: ShopifyProductNode,
  collectionTitle?: string,
): ExtendedProduct {
  const variant = node.variants.edges[0]?.node;
  return {
    id: parseInt(node.id.split("/").pop() || "0"),
    handle: node.handle,
    name: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    price: node.priceRange.minVariantPrice.amount,
    originalPrice: variant?.compareAtPrice?.amount || null,
    brand: "MR.GADGET",
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
    warranty: node.warranty?.value || null,
  };
}

const PRODUCTS_BY_TAG_QUERY = `
  query ProductsByTag($tag: String!, $first: Int!) {
    products(first: $first, query: $tag, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          createdAt
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                compareAtPrice {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCTS_BY_COLLECTION_HANDLE_QUERY = `
  query ProductsByCollectionHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      title
      products(first: $first, sortKey: BEST_SELLING) {
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            createdAt
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  compareAtPrice {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const NEWEST_PRODUCTS_QUERY = `
  query NewestProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          createdAt
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                compareAtPrice {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
`;

const BEST_SELLING_PRODUCTS_QUERY = `
  query BestSellingProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          createdAt
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                compareAtPrice {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
`;

export function useProductsByTag(tag: string, first: number = 15) {
  return useQuery({
    queryKey: ["products", "tag", tag, first],
    queryFn: async () => {
      const data = await shopifyFetch<{
        products: { edges: Array<{ node: ShopifyProductNode }> };
      }>({
        query: PRODUCTS_BY_TAG_QUERY,
        variables: { tag: `tag:${tag}`, first },
      });
      return data.products.edges.map((edge) => mapShopifyProduct(edge.node));
    },
    enabled: !!tag,
  });
}

export function useProductsByCollection(handle: string, first: number = 15) {
  return useQuery({
    queryKey: ["products", "collection", handle, first],
    queryFn: async () => {
      const data = await shopifyFetch<{
        collection: {
          title: string;
          products: { edges: Array<{ node: ShopifyProductNode }> };
        } | null;
      }>({
        query: PRODUCTS_BY_COLLECTION_HANDLE_QUERY,
        variables: { handle, first },
      });
      if (!data.collection) return [];
      const collectionTitle = sanitizeCollectionTitle(data.collection.title);
      return data.collection.products.edges.map((edge) =>
        mapShopifyProduct(edge.node, collectionTitle),
      );
    },
    enabled: !!handle,
  });
}

export function useNewArrivals(first: number = 15) {
  return useQuery({
    queryKey: ["products", "new-arrivals", first],
    queryFn: async () => {
      const data = await shopifyFetch<{
        products: { edges: Array<{ node: ShopifyProductNode }> };
      }>({
        query: NEWEST_PRODUCTS_QUERY,
        variables: { first },
      });
      return data.products.edges.map((edge) => mapShopifyProduct(edge.node));
    },
  });
}

export function useBestSellers(first: number = 15) {
  return useQuery({
    queryKey: ["products", "best-sellers", first],
    queryFn: async () => {
      const data = await shopifyFetch<{
        products: { edges: Array<{ node: ShopifyProductNode }> };
      }>({
        query: BEST_SELLING_PRODUCTS_QUERY,
        variables: { first },
      });
      return data.products.edges.map((edge) => mapShopifyProduct(edge.node));
    },
  });
}
