import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
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
  onOpenSearch: () => void;
  onNavClick: (item: NavItem) => void;
}

export function MobileNav({
  isOpen,
  onClose,
  navItems,
  onOpenSearch,
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
          onOpenSearch();
        }}
        aria-label="Open search"
        className="w-full h-10 rounded-[8px] border border-[#DEDDD7] bg-white px-3.5 flex items-center justify-between text-xs text-[#77756E] hover:border-[#B9684E]/40 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4 text-[#B9684E]" /> Search
        </span>
      </button>

      {/* Navigation links */}
      <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavClick(item)}
            className="flex items-center justify-between px-3 py-2.5 rounded-[6px] text-sm font-medium text-[#4F4E49] hover:bg-white hover:text-[#20201E] transition-all text-left cursor-pointer"
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
          className="w-full justify-center h-10 text-xs font-semibold"
          onClick={() => {
            onClose();
            navigate('/signup');
          }}
        >
          Talk to our team
        </Button>
      </div>

      {/* Theme toggle */}
      <div className="flex items-center justify-between pt-3 border-t border-[#DEDDD7]">
        <span className="text-xs font-medium text-[#77756E]">
          Appearance
        </span>
        <ThemeToggle />
      </div>
    </div>
  );
}
