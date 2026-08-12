import * as React from "react";
import { cn } from "@/utils/cn";

export interface SectionLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  number?: string;
  text?: string;
  children?: React.ReactNode;
  showDot?: boolean;
  showLine?: boolean;
}

export const SectionLabel = React.forwardRef<HTMLDivElement, SectionLabelProps>(
  (
    {
      className,
      number,
      text,
      children,
      showDot = true,
      showLine = false,
      ...props
    },
    ref
  ) => {
    let content = children;
    if (!content) {
      if (number && text) {
        content = `${number} — ${text}`;
      } else {
        content = number || text || "";
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-[#C8A45D]",
          className
        )}
        {...props}
      >
        {showDot && (
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-[#C8A45D] shrink-0"
            aria-hidden="true"
          />
        )}
        <span>{content}</span>
        {showLine && (
          <span
            className="inline-block w-8 h-px bg-[#C8A45D]/40 ml-1 shrink-0"
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
);

SectionLabel.displayName = "SectionLabel";
