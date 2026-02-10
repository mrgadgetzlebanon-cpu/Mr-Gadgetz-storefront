import { Helmet } from "react-helmet-async";
import {
  buildPageTitle,
  buildMetaDescription,
  buildCanonicalUrl,
} from "@/lib/seo";

const DEFAULT_DESCRIPTION =
  "Shop premium electronics at Mr. Gadgetz — phones, laptops, audio, gaming gear, and accessories with fast delivery and official warranty.";
const DEFAULT_IMAGE = "/social-share.png";

export type ProductStructuredData = {
  title: string;
  image?: string;
  description?: string;
  vendor?: string;
  price?: number | string;
  availability?: boolean;
};

export type SEOProps = {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  productData?: ProductStructuredData;
};

export function SEO({
  title,
  description,
  image,
  url,
  type = "website",
  productData,
}: SEOProps) {
  const resolvedTitle = buildPageTitle(title);
  const resolvedDescription = buildMetaDescription(
    description || DEFAULT_DESCRIPTION,
  );
  const resolvedImage = image || DEFAULT_IMAGE;
  const resolvedUrl =
    url ||
    (typeof window !== "undefined"
      ? window.location.href
      : buildCanonicalUrl("/"));
  const canonicalUrl = resolvedUrl.startsWith("http")
    ? resolvedUrl
    : buildCanonicalUrl(resolvedUrl);

  const productAvailability = productData?.availability ?? true;

  const productJsonLd = productData
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: productData.title,
        description: productData.description || resolvedDescription,
        image: productData.image || resolvedImage,
        brand: {
          "@type": "Brand",
          name: productData.vendor || "Mr. Gadgetz",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: productData.price ?? "0",
          availability: productAvailability
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: resolvedUrl,
        },
      }
    : null;

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:url" content={resolvedUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Mr. Gadgetz" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={resolvedImage} />

      {productJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(productJsonLd)}
        </script>
      )}
    </Helmet>
  );
}
