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
      "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9684E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F6F2]";

    const variantStyles: Record<ButtonVariant, string> = {
      primary: "bg-[#B9684E] text-white hover:bg-[#A85B43] font-semibold shadow-sm",
      default: "bg-[#B9684E] text-white hover:bg-[#A85B43] font-semibold shadow-sm",
      secondary: "bg-[#20201E] text-white border border-[#20201E] hover:bg-[#4F4E49]",
      outline: "bg-transparent text-[#20201E] border border-[#DEDDD7] hover:bg-[#F7F6F2] hover:border-[#B9684E]/50",
      ghost: "bg-transparent text-[#4F4E49] hover:bg-[#F7F6F2] hover:text-[#20201E]",
      link: "bg-transparent text-[#B9684E] underline-offset-4 hover:underline p-0 h-auto",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-xs rounded-[6px] gap-1.5",
      md: "h-10 px-4 text-sm rounded-[8px] gap-2",
      lg: "h-12 px-6 text-base rounded-[8px] gap-2.5 font-semibold",
      default: "h-10 px-4 text-sm rounded-[8px] gap-2",
      icon: "h-10 w-10 p-0 rounded-[8px] items-center justify-center",
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
