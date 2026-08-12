import * as React from "react";
import { cn } from "@/utils/cn";

export interface DataPointProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  unit?: string;
  source?: string;
  trend?: string;
}

export const DataPoint = React.forwardRef<HTMLDivElement, DataPointProps>(
  (
    {
      className,
      value,
      label,
      unit,
      source,
      trend,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col p-4 sm:p-6 bg-[#111111] border border-[#2A2A2A] rounded-[12px] transition-colors hover:border-[#C8A45D]/40",
          className
        )}
        {...props}
      >
        {(source || trend) && (
          <div className="flex items-center justify-between gap-2 mb-3">
            {source ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-[#171717] text-[#A1A1AA] border border-[#2A2A2A]">
                {source}
              </span>
            ) : <span />}
            {trend && (
              <span className="text-xs font-mono text-[#C8A45D] font-medium">
                {trend}
              </span>
            )}
          </div>
        )}
        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4F4F5] font-heading">
            {value}
          </span>
          {unit && (
            <span className="text-sm font-mono text-[#A1A1AA]">
              {unit}
            </span>
          )}
        </div>
        <span className="text-xs sm:text-sm text-[#A1A1AA] font-sans mt-1">
          {label}
        </span>
      </div>
    );
  }
);

DataPoint.displayName = "DataPoint";
