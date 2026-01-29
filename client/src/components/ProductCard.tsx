import { Product } from "@shared/schema";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  showNewTag?: boolean;
}

export function ProductCard({ product, showNewTag = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const images = product.images || [];
  const hasSecondImage = Array.isArray(images) && images.length > 1;

  const currentPrice = Number(product.price);
  const comparePrice = product.originalPrice
    ? Number(product.originalPrice)
    : null;
  const discountPercent =
    comparePrice && comparePrice > currentPrice
      ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
      : 0;
  const hasDiscount = discountPercent > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group/card card-container relative flex flex-col bg-white dark:bg-[#1a1a2e] rounded-xl overflow-hidden w-[350px] h-[500px]"
      style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
      data-testid={`card-product-${product.id}`}
    >
      <Link
        href={`/product/${product.handle || product.id}`}
        className="h-full flex flex-col"
      >
        <div
          className="img-wrapper relative overflow-hidden bg-[#f5f5f7] dark:bg-[#252540]"
          style={{ height: "70%" }}
        >
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
            {showNewTag && (
              <Badge
                className="bg-[#0c57ef] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md"
                data-testid={`badge-new-${product.id}`}
              >
                New
              </Badge>
            )}
            {hasDiscount && (
              <Badge
                className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md"
                data-testid={`badge-discount-${product.id}`}
              >
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {product.image ? (
            <div className="relative h-full w-full">
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
                  hasSecondImage
                    ? "translate-x-0 group-hover/card:-translate-x-full"
                    : "group-hover/card:scale-105"
                }`}
              />

              {hasSecondImage && (
                <img
                  src={images[1]}
                  alt={`${product.name} secondary view`}
                  className="absolute inset-0 h-full w-full object-cover translate-x-full group-hover/card:translate-x-0 transition-transform duration-500 ease-out"
                />
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-300 dark:text-gray-600 text-sm">
                No image
              </span>
            </div>
          )}

          <button
            className="
              absolute bottom-6 left-1/2 -translate-x-1/2 z-20
              opacity-0 group-hover/card:opacity-100
              translate-y-8 group-hover/card:translate-y-0
              transition-all duration-300 ease-out
              bg-[#0c57ef] text-white rounded-full px-8 py-3
              flex items-center gap-2 font-medium text-sm
              overflow-hidden
            "
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
            }}
            data-testid={`add-to-cart-${product.id}`}
          >
            {/* Fill layer */}
            <span
              className={`
                absolute inset-0 bg-white transition-all duration-500 ease-out
                ${isHovered ? "fill-in" : "fill-out"}
              `}
            />

            <span
              className={`
                relative z-10 transition-colors duration-300
                ${isHovered ? "text-[#0c57ef]" : "text-white"}
              `}
            >
              Add to Cart
            </span>
          </button>
        </div>

        <div
          className="content-wrapper flex flex-col justify-center items-center text-center px-4 py-3 bg-[#fafafa] dark:bg-[#1e1e32]"
          style={{ height: "30%" }}
        >
          <h3
            className="font-display text-base font-semibold leading-tight text-gray-900 dark:text-white transition-colors"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "2.5rem",
            }}
            title={product.name}
          >
            {product.name}
          </h3>

          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="font-bold text-xl text-[#0c57ef] dark:text-[#48bfef]">
              ${currentPrice.toFixed(2)}
            </span>
            {hasDiscount && comparePrice && (
              <span className="text-sm text-gray-400 line-through">
                ${comparePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
