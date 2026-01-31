import React from "react";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  text: string;
  imageSrc: string;
  url?: string;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  "data-testid"?: string;
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  text,
  imageSrc,
  url,
  onClick,
  isActive = false,
  className,
  style,
  ...rest
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      {...rest}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group flex flex-col items-center gap-3 cursor-pointer outline-none select-none w-[250px] h-[250px]",
        className,
      )}
      style={style}
    >
      {/* 1. The White Icon Box */}
      <div
        className={cn(
          "relative w-[200px] h-[200px] bg-white rounded-[2rem] flex items-center justify-center p-6 overflow-hidden transition-all duration-300 ease-out",
          "border border-border/60 shadow-[0_2px_8px_rgba(99,99,99,0.2)] group-hover:shadow-md group-hover:scale-[1.02]",
          isActive
            ? "ring-2 ring-[#0c57ef] shadow-[0_0_20px_rgba(12,87,239,0.25)] scale-[1.02]"
            : "",
        )}
      >
        <img
          src={imageSrc}
          alt={text}
          draggable="false"
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* 2. The Label (Below the card) */}
      <span
        className={cn(
          "text-sm font-semibold text-center tracking-wide transition-colors duration-300",
          isActive ? "text-[#0c57ef]" : "text-gray-700 dark:text-gray-300",
        )}
      >
        {text}
      </span>
    </div>
  );
};

export default CategoryCard;
