import clsx from "clsx";
import { Link } from "wouter";

interface ZentryButtonProps {
  id?: string;
  title: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  containerClass?: string;
  href?: string;
  onClick?: () => void;
  variant?: "light" | "dark";
}

const ZentryButton = ({ id, title, rightIcon, leftIcon, containerClass, href, onClick, variant = "light" }: ZentryButtonProps) => {
  const buttonContent = (
    <>
      {leftIcon}

      <span className="relative inline-flex overflow-hidden font-general text-xs uppercase">
        <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
          {title}
        </div>
        <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
          {title}
        </div>
      </span>

      {rightIcon}
    </>
  );

  const className = clsx(
    "group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full px-7 py-3",
    variant === "dark" ? "bg-zinc-900 text-white" : "bg-violet-50 text-black",
    containerClass
  );

  if (href) {
    return (
      <Link
        href={href}
        id={id}
        data-testid={id ? `button-${id}` : undefined}
        className={className}
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      id={id}
      data-testid={id ? `button-${id}` : undefined}
      className={className}
      onClick={onClick}
    >
      {buttonContent}
    </button>
  );
};

export default ZentryButton;
