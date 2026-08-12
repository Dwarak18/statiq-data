import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, BarChart2, Menu, X, Command } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SpotlightSearchModal } from '@/components/ui/SpotlightSearchModal';
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
  { label: 'Use Cases', href: 'use-cases', isHash: true },
  { label: 'About', href: 'about', isHash: true },
  { label: 'Pricing', href: '/pricing', isHash: false },
];

export function Header({ currentSection, onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
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
              className="hidden lg:flex items-center gap-6 text-xs font-mono tracking-wider uppercase text-[#77756E]"
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
            {/* Spotlight Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSpotlightOpen(true)}
              aria-label="Open Spotlight Search"
              className="hidden sm:flex items-center gap-3 h-9 px-3.5 rounded-[6px] border border-[#DEDDD7] bg-white text-[#77756E] text-xs hover:border-[#B9684E]/40 transition-all w-56 lg:w-64 justify-between cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9684E]"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-[#77756E] group-hover:text-[#B9684E] transition-colors" />
                <span className="truncate">Spotlight search...</span>
              </div>
              <span className="hidden md:inline-flex items-center gap-1 font-mono text-[10px] bg-[#F7F6F2] px-1.5 py-0.5 rounded border border-[#DEDDD7]">
                <Command className="h-3 w-3" /> K
              </span>
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
                className="text-xs font-bold"
              >
                Request Access
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
          onOpenSpotlight={() => setIsSpotlightOpen(true)}
          onNavClick={handleNavClick}
        />
      </header>

      {/* Spotlight Search Overlay Modal */}
      <SpotlightSearchModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
      />
    </>
  );
}
