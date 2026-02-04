import fs from "fs";
import dotenv from "dotenv";
import fetch from "node-fetch"; // Ensure you have this installed or use Node 18+

dotenv.config();

const SHOPIFY_DOMAIN = process.env.VITE_SHOPIFY_SHOP_URL;
const SHOPIFY_ACCESS_TOKEN = process.env.VITE_SHOPIFY_ACCESS_TOKEN;
const API_VERSION = process.env.VITE_SHOPIFY_API_VERSION || "2026-01";
const SITE_URL = "https://mrgadgetz.net";

// Basic XML escaping for text/URL fields to keep the sitemap well-formed
const escapeXml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// Basic env validation to fail fast with clear guidance
if (!SHOPIFY_DOMAIN || !SHOPIFY_ACCESS_TOKEN) {
  console.error(
    "Missing Shopify config. Please set VITE_SHOPIFY_SHOP_URL and VITE_SHOPIFY_ACCESS_TOKEN in your .env (domain should be your-shop.myshopify.com, token must be a Storefront access token).",
  );
  process.exit(1);
}

// Optional: log safe diagnostics without leaking secrets
console.log(
  "Using domain:",
  SHOPIFY_DOMAIN,
  "| token present:",
  Boolean(SHOPIFY_ACCESS_TOKEN),
);

async function shopifyFetch(query, variables = {}) {
  const response = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  const json = await response.json();
  if (json.errors) {
    // Surface first error to aid debugging
    const first = Array.isArray(json.errors) ? json.errors[0] : json.errors;
    console.error("Shopify API Error:", json.errors);
    throw new Error(
      `Failed to fetch data from Shopify: ${first?.message || "unknown error"} (${first?.extensions?.code || "no code"})`,
    );
  }
  return json.data;
}

// 1. Fetch All Products (Looping)
async function getAllProducts() {
  let allProducts = [];
  let hasNextPage = true;
  let cursor = null;

  console.log("Starting Product Fetch...");

  const productQuery = `
    query getProducts($cursor: String) {
      products(first: 250, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            handle
            updatedAt
            title
            featuredImage {
              url
              altText
            }
          }
        }
      }
    }
  `;

  while (hasNextPage) {
    const data = await shopifyFetch(productQuery, { cursor });
    const { products } = data;

    allProducts = [...allProducts, ...products.edges];

    // Update loop variables
    cursor = products.pageInfo.endCursor;
    hasNextPage = products.pageInfo.hasNextPage;

    console.log(
      `Fetched ${products.edges.length} products. Total: ${allProducts.length}`,
    );
  }

  return allProducts;
}

// 2. Fetch Collections (Simple Fetch, assume < 250 for now)
async function getCollections() {
  console.log("Fetching Collections...");
  const collectionQuery = `
    query getCollections {
      collections(first: 250) {
        edges {
          node {
            handle
            updatedAt
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(collectionQuery);
  return data.collections.edges;
}

// XML Generators
function generateProductXML(products) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  products.forEach(({ node }) => {
    const url = `${SITE_URL}/product/${node.handle}`;
    const date = node.updatedAt.split("T")[0];
    const image = node.featuredImage;

    xml += `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    ${
      image
        ? `<image:image>
      <image:loc>${escapeXml(image.url)}</image:loc>
      <image:title>${escapeXml(image.altText || node.title)}</image:title>
    </image:image>`
        : ""
    }
  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

function generateCollectionXML(collections) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  collections.forEach(({ node }) => {
    // Matches your filter logic: /shop?category=handle
    const url = `${SITE_URL}/shop?category=${node.handle}`;
    const date = node.updatedAt.split("T")[0];

    xml += `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

async function run() {
  try {
    const products = await getAllProducts();
    const collections = await getCollections();

    // Ensure directory exists
    if (!fs.existsSync("./client/public")) {
      fs.mkdirSync("./client/public", { recursive: true });
    }

    // Write Files
    fs.writeFileSync(
      "./client/public/sitemap-products.xml",
      generateProductXML(products),
    );
    fs.writeFileSync(
      "./client/public/sitemap-collections.xml",
      generateCollectionXML(collections),
    );

    console.log("Sitemaps generated successfully!");
  } catch (error) {
    console.error("Error generating sitemap:", error);
    process.exit(1);
  }
}
run();
