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
        "flex flex-wrap items-center gap-5 border-b border-border",
        variant === "pills" && "border-b-0 gap-2",
        variant === "segment" && "border-b-0 p-0 bg-transparent rounded-none border-0",
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
              "relative inline-flex items-center gap-2 text-sm transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              size === "sm" && "px-3 py-1.5 text-[11px]",
              size === "md" && "px-4 py-2.5 text-xs",
              size === "lg" && "px-5 py-3 text-sm",
              variant === "underline" && [
                "border-b-2 -mb-px",
                isActive
                  ? "border-accent text-ink font-medium"
                  : "border-transparent text-muted hover:text-ink",
              ],
              variant === "pills" && [
                "border-b-2 -mb-px",
                isActive
                  ? "border-accent text-ink font-medium"
                  : "border-transparent text-muted hover:text-ink",
              ],
              variant === "segment" && [
                "border-b-2 -mb-px",
                isActive
                  ? "border-accent text-ink font-medium"
                  : "border-transparent text-muted hover:text-ink",
              ],
              tab.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-[10px] rounded-sm",
                  isActive
                    ? "bg-accent-soft text-accent"
                    : "bg-surface-muted text-muted border border-border"
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
