import * as React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger";
  children?: React.ReactNode;
  className?: string;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-white": variant === "default",
          "border-transparent bg-border/50 text-text-main": variant === "secondary",
          "text-text-main border-border": variant === "outline",
          "border-transparent bg-success/10 text-success": variant === "success",
          "border-transparent bg-warning/10 text-warning": variant === "warning",
          "border-transparent bg-danger/10 text-danger": variant === "danger",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
