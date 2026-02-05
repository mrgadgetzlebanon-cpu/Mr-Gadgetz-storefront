import { useMemo } from "react";
import { Link } from "wouter";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@shared/schema";

interface BestSellersByCategoryProps {
  products: Product[];
}

export function BestSellersByCategory({
  products,
}: BestSellersByCategoryProps) {
  const bestSellersByCategory = useMemo(() => {
    const categories = Array.from(new Set(products.map((p) => p.category)));
    return categories.map((cat) => ({
      name: cat,
      products: products.filter((p) => p.category === cat).slice(0, 4),
    }));
  }, [products]);

  if (bestSellersByCategory.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="container px-4 mx-auto">
        <h2 className="text-[1.2rem] md:text-3xl lg:text-4xl font-display font-bold mb-16 text-center">
          Best Sellers by Category
        </h2>

        <div className="space-y-24">
          {bestSellersByCategory.map((category) => (
            <div key={category.name}>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-2xl font-display font-bold">
                  {category.name}
                </h3>
                <div className="h-[1px] flex-1 bg-border/50" />
                <Link
                  href={`/shop?category=${category.name}`}
                  className="text-sm font-medium hover:text-accent"
                >
                  Browse All
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8 justify-items-center">
                {category.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="grid"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
