import { lazy, Suspense } from "react";
import { useProductByHandle } from "@/hooks/use-products";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { ProductDetailsSkeleton } from "@/components/ProductDetailsSkeleton";
import { ProductInfo } from "@/components/product/ProductInfo";
import { useProductVariant } from "@/hooks/use-product-variant";
import { buildMetaDescription, buildCanonicalUrl } from "@/lib/seo";
import { SEO } from "@/components/SEO";

const ProductImageSlider = lazy(() =>
  import("@/components/product/ProductImageSlider").then((m) => ({
    default: m.ProductImageSlider,
  })),
);

const ProductDescription = lazy(() =>
  import("@/components/product/ProductDescription").then((m) => ({
    default: m.ProductDescription,
  })),
);

const RelatedProducts = lazy(() =>
  import("@/components/product/RelatedProducts").then((m) => ({
    default: m.RelatedProducts,
  })),
);

export default function ProductDetails() {
  const [match, params] = useRoute("/product/:handle");
  const [, setLocation] = useLocation();
  const handle = params?.handle || "";
  const { data: product, isLoading, error } = useProductByHandle(handle);

  const fallbackProduct =
    product ||
    ({
      id: "placeholder",
      handle: "",
      name: "",
      price: "0",
      originalPrice: null,
      options: [],
      variants: [],
      images: [],
      image: "",
    } as any);

  const {
    activeVariant,
    selectedOptions,
    handleOptionSelect,
    displayPrice,
    displayCompareAt,
    currencyCode,
    hasComparePrice,
    resolvedVariantId,
    selectedOptionsText,
  } = useProductVariant(fallbackProduct);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/shop");
    }
  };

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg">Product not found</p>
        <Link href="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const allImages = [product.image, ...(product.images || [])];
  const variantImage = activeVariant?.image || null;
  const imagesWithVariant = variantImage
    ? [variantImage, ...allImages.filter((img) => img !== variantImage)]
    : allImages;
  const seoDescription = buildMetaDescription(
    product.description || product.descriptionHtml,
  );
  const seoUrl = buildCanonicalUrl(`/product/${product.handle}`);
  const seoImage = variantImage || product.image;
  const productPrice = Number(product.price) || 0;
  const isAvailable = (product as any)?.availableForSale ?? true;

  const renderMediaFallback = () => (
    <div className="aspect-square w-full rounded-2xl bg-muted animate-pulse" />
  );

  const renderContentFallback = () => (
    <div className="rounded-2xl bg-muted animate-pulse h-64" />
  );

  return (
    <>
      <SEO
        title={product.name}
        description={seoDescription}
        image={seoImage}
        url={seoUrl}
        type="product"
        productData={{
          title: product.name,
          image: seoImage,
          description: product.description,
          vendor: product.brand || "Mr. Gadgetz",
          price: productPrice,
          availability: isAvailable,
        }}
      />
      <div className="container mx-auto px-4 py-8 bg-white">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>

        {/* Upper Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Image Slider */}
          <Suspense fallback={renderMediaFallback()}>
            <ProductImageSlider
              images={imagesWithVariant}
              productName={product.name}
              activeVariant={activeVariant}
            />
          </Suspense>

          {/* Right - Product Info */}
          <ProductInfo
            product={product}
            activeVariant={activeVariant}
            selectedOptions={selectedOptions}
            onSelectOption={handleOptionSelect}
            displayPrice={displayPrice}
            displayCompareAt={displayCompareAt}
            currencyCode={currencyCode}
            hasComparePrice={hasComparePrice}
            resolvedVariantId={resolvedVariantId}
            selectedOptionsText={selectedOptionsText}
          />
        </div>

        {/* Lower Content - Description & Specs */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <Suspense fallback={renderContentFallback()}>
            <ProductDescription
              descriptionHtml={product.descriptionHtml}
              description={product.description}
              specs={product.specs as Record<string, string> | undefined}
              warranty={product.warranty}
            />
          </Suspense>
        </div>

        {/* Related Products */}
        <Suspense fallback={renderContentFallback()}>
          <RelatedProducts
            currentProductId={product.id}
            productType={product.productType}
            vendor={product.brand}
          />
        </Suspense>
      </div>
    </>
  );
}
