import * as React from "react";
import { cn } from "@/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "default" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "default" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  target?: string;
  rel?: string;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      target,
      rel,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Standardize variant mapping for backward compatibility
    const effectiveVariant = variant === "default" ? "primary" : variant;
    const effectiveSize = size === "default" ? "md" : size;

    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

    const variantStyles: Record<ButtonVariant, string> = {
      primary: "bg-accent text-accent-contrast hover:bg-accent-hover font-semibold",
      default: "bg-accent text-accent-contrast hover:bg-accent-hover font-semibold",
      secondary: "bg-ink text-white border border-ink hover:bg-ink-soft",
      outline: "bg-transparent text-ink border border-border hover:bg-surface hover:border-accent/50",
      ghost: "bg-transparent text-ink-soft hover:text-ink",
      link: "bg-transparent text-accent underline-offset-4 hover:underline p-0 h-auto",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "min-h-8 px-3 text-xs rounded-sm gap-1.5",
      md: "min-h-10 px-4 text-sm rounded-md gap-2",
      lg: "min-h-12 px-6 text-base rounded-md gap-2.5 font-semibold",
      default: "min-h-10 px-4 text-sm rounded-md gap-2",
      icon: "h-10 w-10 p-0 rounded-md items-center justify-center",
    };

    const combinedClassName = cn(
      baseStyles,
      variantStyles[effectiveVariant] || variantStyles.primary,
      sizeStyles[effectiveSize] || sizeStyles.md,
      className
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          className={combinedClassName}
          {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        className={combinedClassName}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
