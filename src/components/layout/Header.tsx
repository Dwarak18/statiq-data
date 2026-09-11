import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, BarChart2, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchModal } from '@/components/ui/SearchModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MobileNav, NavItem } from './MobileNav';

export interface HeaderProps {
  currentSection?: string;
  onNavigate?: (id: string) => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Product', href: 'product', isHash: true },
  { label: 'Capabilities', href: 'capabilities', isHash: true },
  { label: 'Methodology', href: 'methodology', isHash: true },
  { label: 'Pricing', href: '/pricing', isHash: false },
];

export function Header({ currentSection, onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: NavItem) => {
    setIsMobileMenuOpen(false);
    if (item.isHash) {
      if (location.pathname === '/') {
        // Delegate to the centralized scroll helper in Home via the prop,
        // which accounts for the live header height — no hardcoded offsets.
        if (onNavigate) {
          onNavigate(item.href);
        }
      } else {
        navigate(`/#${item.href}`);
      }
    } else {
      navigate(item.href);
    }
  };

  return (
    <>
      {/* data-site-header is the selector used by scrollToSection() to measure header height */}
      <header
        data-site-header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F7F6F2]/95 backdrop-blur-xl border-b border-[#DEDDD7] shadow-[0_1px_2px_rgba(20,20,18,0.06)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Section Nav */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9684E] rounded"
              aria-label="STATIQ ONE Home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#20201E] text-white">
                <BarChart2 className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-tight font-heading text-[#20201E]">
                STATIQ<span className="text-[#B9684E]">ONE</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#77756E]"
              aria-label="Main Section Navigation"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = item.isHash
                  ? currentSection === item.href
                  : location.pathname === item.href;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className={`transition-colors relative py-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9684E] rounded ${
                      isActive
                        ? 'text-[#B9684E] font-semibold'
                        : 'hover:text-[#20201E]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B9684E] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className="hidden sm:flex items-center gap-3 h-9 px-3.5 rounded-[6px] border border-[#DEDDD7] bg-white text-[#77756E] text-xs hover:border-[#B9684E]/40 transition-all w-56 lg:w-64 justify-between cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9684E]"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-[#77756E] group-hover:text-[#B9684E] transition-colors" />
                <span className="truncate">Search companies, filings, and datasets</span>
              </div>
            </button>

            {/* Desktop Action Controls */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="text-xs text-[#77756E] hover:text-[#20201E]"
              >
                Log in
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/signup')}
                className="text-xs font-semibold"
              >
                Talk to our team
              </Button>
            </div>

            {/* Mobile Navigation Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#20201E]"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <MobileNav
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          navItems={NAV_ITEMS}
          onOpenSearch={() => setIsSearchOpen(true)}
          onNavClick={handleNavClick}
        />
      </header>

      {/* Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
