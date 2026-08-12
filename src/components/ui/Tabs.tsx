import * as React from "react";
import { cn } from "@/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "underline" | "pills" | "segment";
  ariaLabel?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className,
  size = "md",
  variant = "underline",
  ariaLabel = "Tab selector",
}: TabsProps) {
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    const enabledIndices = tabs
      .map((t, i) => (t.disabled ? -1 : i))
      .filter((i) => i !== -1);

    if (enabledIndices.length === 0) return;

    const currentPos = enabledIndices.indexOf(currentIndex);
    let nextIndex = currentIndex;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextPos = (currentPos + 1) % enabledIndices.length;
      nextIndex = enabledIndices[nextPos];
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevPos = (currentPos - 1 + enabledIndices.length) % enabledIndices.length;
      nextIndex = enabledIndices[prevPos];
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = enabledIndices[0];
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = enabledIndices[enabledIndices.length - 1];
    }

    if (nextIndex !== currentIndex && tabs[nextIndex]) {
      onChange(tabs[nextIndex].id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "flex flex-wrap items-center gap-1 border-b border-[#2A2A2A]",
        variant === "pills" && "border-b-0 gap-2",
        variant === "segment" && "border-b-0 p-1 bg-[#111111] rounded-[12px] border border-[#2A2A2A]",
        className
      )}
    >
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              "relative inline-flex items-center gap-2 font-mono text-xs tracking-wide uppercase transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A45D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]",
              size === "sm" && "px-3 py-1.5 text-[11px]",
              size === "md" && "px-4 py-2.5 text-xs",
              size === "lg" && "px-5 py-3 text-sm",
              variant === "underline" && [
                "border-b-2 -mb-px",
                isActive
                  ? "border-[#C8A45D] text-[#C8A45D] font-semibold"
                  : "border-transparent text-[#A1A1AA] hover:text-[#F4F4F5] hover:border-[#2A2A2A]",
              ],
              variant === "pills" && [
                "rounded-[6px] border",
                isActive
                  ? "bg-[#C8A45D] text-[#000000] border-[#C8A45D] font-semibold shadow-sm"
                  : "bg-[#111111] text-[#A1A1AA] border-[#2A2A2A] hover:text-[#F4F4F5] hover:border-[#A1A1AA]/30",
              ],
              variant === "segment" && [
                "rounded-[6px]",
                isActive
                  ? "bg-[#C8A45D] text-[#000000] font-semibold shadow-sm"
                  : "text-[#A1A1AA] hover:text-[#F4F4F5]",
              ],
              tab.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-[10px] rounded-full font-mono",
                  isActive
                    ? "bg-[#000000]/20 text-[#000000]"
                    : "bg-[#171717] text-[#A1A1AA] border border-[#2A2A2A]"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
