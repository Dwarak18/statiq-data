import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '@/context/ThemeContext';

const options: { value: Theme; label: string; Icon: React.ElementType }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'dark', label: 'Dark', Icon: Moon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = options.find((o) => o.value === theme) ?? options[1];
  const { Icon: CurrentIcon } = current;

  return (
    <div ref={ref} className="relative">
      <button
        id="theme-toggle-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle theme"
        title={`Theme: ${current.label}`}
        className="relative p-2 rounded-lg border border-border bg-surface text-text-muted hover:text-text-main hover:border-primary/40 transition-all cursor-pointer flex items-center justify-center"
      >
        <CurrentIcon className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl border border-border bg-card shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {options.map(({ value, label, Icon }) => (
            <button
              key={value}
              id={`theme-option-${value}`}
              onClick={() => { setTheme(value); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                theme === value
                  ? 'text-primary bg-primary/10'
                  : 'text-text-muted hover:text-text-main hover:bg-surface'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              {theme === value && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
