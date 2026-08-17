import React from 'react';
import { NewsRegion } from './types';
import { Globe, MapPin } from 'lucide-react';

interface RegionTabsProps {
  activeRegion: NewsRegion;
  onSelectRegion: (region: NewsRegion) => void;
  counts?: {
    all?: number;
    USA?: number;
    Europe?: number;
    Asia?: number;
    Global?: number;
  };
}

const REGION_OPTIONS: { id: NewsRegion; label: string; flag: string }[] = [
  { id: 'All', label: 'All Regions', flag: '🌐' },
  { id: 'USA', label: 'USA', flag: '🇺🇸' },
  { id: 'Europe', label: 'Europe', flag: '🇪🇺' },
  { id: 'Asia', label: 'Asia-Pacific', flag: '🌏' },
  { id: 'Global', label: 'Global Reinsurance', flag: '🌍' },
];

export function RegionTabs({ activeRegion, onSelectRegion, counts = {} }: RegionTabsProps) {
  const getCount = (regionId: NewsRegion): number => {
    if (regionId === 'All') return counts.all ?? 0;
    if (regionId === 'USA') return counts.USA ?? 0;
    if (regionId === 'Europe') return counts.Europe ?? 0;
    if (regionId === 'Asia') return counts.Asia ?? 0;
    if (regionId === 'Global') return counts.Global ?? 0;
    return 0;
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-1">
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-surface border border-border inline-flex min-w-full sm:min-w-0" role="tablist" aria-label="Insurance News Regions">
        {REGION_OPTIONS.map((tab) => {
          const isActive = activeRegion.toLowerCase() === tab.id.toLowerCase();
          const count = getCount(tab.id);

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectRegion(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-background shadow-md font-bold'
                  : 'text-text-muted hover:text-text-main hover:bg-card/60'
              }`}
            >
              <span className="text-sm leading-none">{tab.flag}</span>
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-background/20 text-background font-bold'
                      : 'bg-card text-text-muted border border-border/60'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
