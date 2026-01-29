import type {
  CategoryGroup,
  CategoryStructure,
} from "@/config/categoryStructure";
export type {
  CategoryGroup,
  CategoryStructure,
} from "@/config/categoryStructure";

const SHOP_URL = import.meta.env.VITE_SHOPIFY_SHOP_URL;
const ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN;
const API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION;

export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: any;
}): Promise<T> {
  if (!SHOP_URL) {
    throw new Error(
      "Shopify configuration error: VITE_SHOPIFY_SHOP_URL is not defined",
    );
  }
  if (!ACCESS_TOKEN) {
    throw new Error(
      "Shopify configuration error: VITE_SHOPIFY_ACCESS_TOKEN is not defined",
    );
  }

  const endpoint = `https://${SHOP_URL}/api/${API_VERSION}/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Shopify API error: ${response.status} ${response.statusText} - ${errorBody}`,
    );
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(
      `Shopify GraphQL error: ${result.errors.map((e: any) => e.message).join(", ")}`,
    );
  }

  return result.data;
}

export const COLLECTIONS_QUERY = `
  query getCollections($first: Int = 100) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

export const PRODUCTS_BY_COLLECTION_QUERY = `
  query getProductsByCollection($handle: String!, $first: Int = 24, $after: String, $sortKey: ProductCollectionSortKeys = BEST_SELLING, $reverse: Boolean = false) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            vendor
            productType
            tags
            createdAt
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            vendor
            images(first: 2) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  priceV2 {
                    amount
                    currencyCode
                  }
                  compareAtPriceV2 {
                    amount
                    currencyCode
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

export const ALL_PRODUCTS_QUERY = `
  query getAllProducts($first: Int = 24, $after: String, $sortKey: ProductSortKeys = BEST_SELLING, $reverse: Boolean = false, $query: String) {
    products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, query: $query) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          vendor
          productType
          tags
          createdAt
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          vendor
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
                priceV2 {
                  amount
                  currencyCode
                }
                compareAtPriceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      productType
      tags
      createdAt
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      vendor
      options {
        id
        name
        values
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            priceV2 {
              amount
              currencyCode
            }
            compareAtPriceV2 {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

export function sanitizeCollectionTitle(title: string): string {
  const parts = title.split(">");
  return parts[parts.length - 1].trim();
}

const PREDEFINED_CATEGORIES = [
  "Accessories",
  "iPhones",
  "Phones",
  "Tablets",
  "PC and Laptops",
  "Networking",
  "Gaming",
  "Watches",
  "Smart Home",
  "Audio",
] as const;

const CATEGORY_PRIORITY: Array<{ keywords: string[]; category: string }> = [
  { keywords: ["iphone"], category: "iPhones" },
  {
    keywords: [
      "phone",
      "smartphone",
      "mobile",
      "cellphone",
      "galaxy s",
      "pixel",
      "telephony",
      "smart phones",
    ],
    category: "Phones",
  },
  { keywords: ["tablet", "ipad", "galaxy tab"], category: "Tablets" },
  {
    keywords: [
      "laptop",
      "computer",
      "pc",
      "desktop",
      "macbook",
      "notebook",
      "imac",
      "mac mini",
      "mac pro",
      "chromebook",
    ],
    category: "PC and Laptops",
  },
  {
    keywords: [
      "network",
      "router",
      "wifi",
      "modem",
      "ethernet",
      "mesh",
      "access point",
      "extender",
    ],
    category: "Networking",
  },
  {
    keywords: [
      "gaming",
      "game",
      "playstation",
      "xbox",
      "nintendo",
      "console",
      "controller",
      "joystick",
      "vr headset",
    ],
    category: "Gaming",
  },
  {
    keywords: [
      "watch",
      "smartwatch",
      "wearable",
      "fitness tracker",
      "apple watch",
      "galaxy watch",
    ],
    category: "Watches",
  },
  {
    keywords: [
      "smart home",
      "smarthome",
      "home automation",
      "thermostat",
      "doorbell",
      "security camera",
      "smart plug",
      "smart light",
      "alexa",
      "google home",
      "nest",
      "ring",
      "hue",
    ],
    category: "Smart Home",
  },
  {
    keywords: [
      "audio",
      "speaker",
      "headphone",
      "headphones",
      "earphone",
      "earbuds",
      "airpods",
      "soundbar",
      "subwoofer",
      "amplifier",
      "microphone",
      "beats",
      "bose",
      "sonos",
    ],
    category: "Audio",
  },
  {
    keywords: [
      "accessory",
      "accessories",
      "case",
      "charger",
      "cable",
      "adapter",
      "mount",
      "stand",
      "cover",
      "protector",
      "screen protector",
      "keyboard",
      "mouse",
      "hub",
      "dock",
      "bag",
      "sleeve",
      "strap",
      "band",
    ],
    category: "Accessories",
  },
];

function mapToCategory(title: string): string {
  const lowerTitle = title.toLowerCase();

  for (const { keywords, category } of CATEGORY_PRIORITY) {
    for (const keyword of keywords) {
      if (lowerTitle.includes(keyword)) {
        return category;
      }
    }
  }

  return "Accessories";
}

function extractSubcategoryName(title: string): string {
  const parts = title.split(">").map((p) => p.trim());
  let name = parts[parts.length - 1];

  name = name.replace(/,\s*/g, " ").replace(/\s+/g, " ").trim();

  const words = name.split(" ");
  const uniqueWords: string[] = [];
  const seen = new Set<string>();

  for (const word of words) {
    const lower = word.toLowerCase();
    if (!seen.has(lower) && word.length > 0) {
      seen.add(lower);
      uniqueWords.push(word);
    }
  }

  const result = uniqueWords.join(" ");

  if (result.length > 25) {
    return uniqueWords.slice(0, 3).join(" ");
  }

  return result;
}

export function groupCollectionsByParent(
  collections: Array<{ handle: string; title: string }>,
): CategoryStructure {
  const categoryMap = new Map<string, Map<string, string[]>>();

  for (const cat of PREDEFINED_CATEGORIES) {
    categoryMap.set(cat, new Map());
  }

  for (const collection of collections) {
    const category = mapToCategory(collection.title);
    const subcategoryName = extractSubcategoryName(collection.title);

    const subcategoryMap = categoryMap.get(category)!;
    if (!subcategoryMap.has(subcategoryName)) {
      subcategoryMap.set(subcategoryName, []);
    }
    subcategoryMap.get(subcategoryName)!.push(collection.handle);
  }

  const grouped: CategoryGroup[] = [];

  for (const category of PREDEFINED_CATEGORIES) {
    const subcategoryMap = categoryMap.get(category)!;
    if (subcategoryMap.size === 0) continue;

    const parentHandles: string[] = [];
    const children: CategoryGroup["children"] = [];

    subcategoryMap.forEach((handles, name) => {
      parentHandles.push(...handles);
      children.push({ name, handle: handles[0] || name, handles, filters: [] });
    });

    grouped.push({
      parent: category,
      parentHandles,
      children: children.sort((a, b) => a.name.localeCompare(b.name)),
      filters: [],
    });
  }

  const byHandle: CategoryStructure["byHandle"] = {};
  const byParent: CategoryStructure["byParent"] = {};

  grouped.forEach((group) => {
    byParent[group.parent] = group;
    group.children.forEach((child) => {
      child.handles.forEach((handle) => {
        byHandle[handle] = { ...child, parent: group.parent };
      });
    });
  });

  return { grouped, byHandle, byParent };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: { url: string; altText: string };
}

export interface CollectionsResponse {
  collections: {
    edges: Array<{ node: ShopifyCollection }>;
  };
}

export const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export interface CartLineItem {
  merchandiseId: string;
  quantity: number;
}

export interface CartCreateInput {
  lines: CartLineItem[];
}

export interface CartCreateResponse {
  cartCreate: {
    cart: {
      id: string;
      checkoutUrl: string;
      cost: {
        totalAmount: {
          amount: string;
          currencyCode: string;
        };
      };
    } | null;
    userErrors: Array<{
      code: string;
      field: string[];
      message: string;
    }>;
  };
}

export interface CheckoutLineItem {
  variantId: string;
  quantity: number;
}

export async function createCheckout(
  lineItems: CheckoutLineItem[],
): Promise<string> {
  const cartLines: CartLineItem[] = lineItems.map((item) => ({
    merchandiseId: item.variantId,
    quantity: item.quantity,
  }));

  const data = await shopifyFetch<CartCreateResponse>({
    query: CART_CREATE_MUTATION,
    variables: {
      input: { lines: cartLines },
    },
  });

  if (data.cartCreate.userErrors.length > 0) {
    const errors = data.cartCreate.userErrors.map((e) => e.message).join(", ");
    throw new Error(`Checkout error: ${errors}`);
  }

  if (!data.cartCreate.cart) {
    throw new Error("Failed to create cart");
  }

  return data.cartCreate.cart.checkoutUrl;
}
