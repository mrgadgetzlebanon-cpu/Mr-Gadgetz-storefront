import React from "react";
import { ChevronRight } from "lucide-react";

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

  const containerClasses = [
    "category-card-container relative",
    isActive ? "category-card-active" : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const renderButton = () => {
    // Show the corner button when either a URL or click handler is provided.
    if (url) {
      return (
        <a
          href={url}
          className="category-card-button"
          aria-label={`Open ${text}`}
        >
          <ChevronRight />
        </a>
      );
    }

    if (onClick) {
      return (
        <button
          type="button"
          className="category-card-button"
          aria-label={`Open ${text}`}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <ChevronRight />
        </button>
      );
    }

    return null;
  };

  return (
    <div
      {...rest}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={onClick ? isActive : undefined}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      className={containerClasses}
      style={style}
    >
      <div className="shape relative overflow-hidden">
        <img
          src={imageSrc}
          alt={text}
          draggable="false"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 pointer-events-none" />

        <div className="category-card-title relative z-10">
          <p>{text}</p>
        </div>
      </div>

      {renderButton()}
    </div>
  );
};

export default CategoryCard;
