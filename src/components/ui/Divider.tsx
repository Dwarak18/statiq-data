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
            "self-stretch w-px bg-[#DEDDD7]",
            variant === "subtle" && "bg-[#DEDDD7]/60",
            variant === "gold" && "bg-[#B9684E]/40",
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
          "w-full border-b border-[#DEDDD7]",
          variant === "subtle" && "border-[#DEDDD7]/60",
          variant === "gold" && "border-[#B9684E]/40",
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";
