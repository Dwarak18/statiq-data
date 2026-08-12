import * as React from "react";
import { cn } from "@/utils/cn";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "subtle" | "gold";
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      className,
      orientation = "horizontal",
      variant = "default",
      ...props
    },
    ref
  ) => {
    if (orientation === "vertical") {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={cn(
            "self-stretch w-px bg-[#2A2A2A]",
            variant === "subtle" && "bg-[#2A2A2A]/50",
            variant === "gold" && "bg-[#C8A45D]/40",
            className
          )}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn(
          "w-full border-b border-[#2A2A2A]",
          variant === "subtle" && "border-[#2A2A2A]/50",
          variant === "gold" && "border-[#C8A45D]/40",
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";
