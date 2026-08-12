import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Command } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export interface NavItem {
  label: string;
  href: string;
  isHash?: boolean;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  onOpenSpotlight: () => void;
  onNavClick: (item: NavItem) => void;
}

export function MobileNav({
  isOpen,
  onClose,
  navItems,
  onOpenSpotlight,
  onNavClick,
}: MobileNavProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      id="mobile-nav-menu"
      className="md:hidden border-b border-[#DEDDD7] bg-[#F7F6F2]/98 backdrop-blur-xl px-4 py-5 space-y-4 shadow-sm animate-in slide-in-from-top-2 duration-200"
      role="dialog"
      aria-label="Mobile Navigation Menu"
    >
      {/* Search trigger button */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onOpenSpotlight();
        }}
        aria-label="Open Spotlight Search Modal"
        className="w-full h-10 rounded-[8px] border border-[#DEDDD7] bg-white px-3.5 flex items-center justify-between text-xs text-[#77756E] hover:border-[#B9684E]/40 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4 text-[#B9684E]" /> Spotlight Search...
        </span>
        <span className="hidden md:inline-flex items-center font-mono text-[10px] bg-[#F7F6F2] px-1.5 py-0.5 rounded border border-[#DEDDD7]">
          <Command className="inline h-2.5 w-2.5 mr-0.5" /> K
        </span>
      </button>

      {/* Navigation links */}
      <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavClick(item)}
            className="flex items-center justify-between px-3 py-2.5 rounded-[6px] text-xs font-mono tracking-wider uppercase text-[#4F4E49] hover:bg-white hover:text-[#20201E] transition-all text-left cursor-pointer"
          >
            <span>{item.label}</span>
            <span className="text-xs text-[#B9684E] font-mono opacity-80">&rarr;</span>
          </button>
        ))}
      </nav>

      {/* Auth action buttons */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#DEDDD7]">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center h-10 text-xs font-semibold"
          onClick={() => {
            onClose();
            navigate('/login');
          }}
        >
          Log in
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="w-full justify-center h-10 text-xs font-bold"
          onClick={() => {
            onClose();
            navigate('/signup');
          }}
        >
          Request Access
        </Button>
      </div>

      {/* Theme toggle */}
      <div className="flex items-center justify-between pt-3 border-t border-[#DEDDD7]">
        <span className="text-xs font-mono uppercase tracking-wider text-[#77756E]">
          Appearance
        </span>
        <ThemeToggle />
      </div>
    </div>
  );
}
