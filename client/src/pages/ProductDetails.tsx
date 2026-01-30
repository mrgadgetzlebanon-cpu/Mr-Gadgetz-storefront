import { Helmet } from "react-helmet-async";
import { useProductByHandle } from "@/hooks/use-products";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { ProductDetailsSkeleton } from "@/components/ProductDetailsSkeleton";
import { ProductImageSlider } from "@/components/product/ProductImageSlider";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductDescription } from "@/components/product/ProductDescription";
import { RelatedProducts } from "@/components/product/RelatedProducts";

export default function ProductDetails() {
  const [match, params] = useRoute("/product/:handle");
  const [, setLocation] = useLocation();
  const handle = params?.handle || "";
  const { data: product, isLoading, error } = useProductByHandle(handle);

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
  const productTitle = `${product.name} | Mr. Gadgetz`;
  const productDescription = `Buy ${product.name} at Mr. Gadgetz. ${product.brand} - Premium quality electronics with fast shipping.`;

  return (
    <>
      <Helmet>
        <title>{productTitle}</title>
        <meta name="description" content={productDescription} />
        <meta property="og:title" content={productTitle} />
        <meta property="og:description" content={productDescription} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />
        <meta name="twitter:title" content={productTitle} />
        <meta name="twitter:description" content={productDescription} />
        <meta name="twitter:image" content={product.image} />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
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
          <ProductImageSlider images={allImages} productName={product.name} />

          {/* Right - Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Lower Content - Description & Specs */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <ProductDescription
            descriptionHtml={product.descriptionHtml}
            description={product.description}
            specs={product.specs as Record<string, string> | undefined}
          />
        </div>

        {/* Related Products */}
        <RelatedProducts
          currentProductId={product.id}
          category={product.category}
        />
      </div>
    </>
  );
}
