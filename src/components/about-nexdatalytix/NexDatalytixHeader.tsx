import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NexDatalytixLogo } from './NexDatalytixLogo';
import { SHARED_NAVIGATION } from './navigationData';

export interface NexDatalytixHeaderProps {
  currentSection?: string;
  onNavigate?: (id: string) => void;
}

export function NexDatalytixHeader({ currentSection, onNavigate }: NexDatalytixHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      const header = document.querySelector('[data-site-header]');
      const headerHeight = header ? header.getBoundingClientRect().height : 80;
      const top = elem.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <header
      data-site-header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-[#F7F6F2]/95 backdrop-blur-md border-b border-[#DEDDD7] shadow-[0_1px_2px_rgba(20,20,18,0.04)]'
          : 'bg-[#F7F6F2] border-b border-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto flex h-18 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - 145px desktop / 125px mobile per Spec §24 */}
        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            handleScrollTo('about');
          }}
          className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9684E] rounded"
          aria-label="NexDatalytix Home"
        >
          <div className="hidden sm:block">
            <NexDatalytixLogo width="145px" />
          </div>
          <div className="sm:hidden">
            <NexDatalytixLogo width="125px" />
          </div>
        </a>

        {/* Desktop Main Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-sans text-[#4F4E49]" aria-label="Main Navigation">
          {SHARED_NAVIGATION.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleScrollTo(item.id)}
                className={`py-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9684E] rounded ${
                  isActive ? 'text-[#20201E] font-semibold' : 'hover:text-[#20201E]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Header Right Action - Links directly to #contact per Spec §25 */}
        <div className="flex items-center gap-4">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo('contact');
            }}
            className="hidden sm:inline-flex items-center text-xs font-sans font-medium px-4 py-2 rounded.md rounded-[6px] bg-[#20201E] text-white hover:bg-[#B9684E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9684E] cursor-pointer"
          >
            Contact us
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded text-[#20201E] hover:bg-[#FBFAF7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9684E]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#DEDDD7] bg-[#FBFAF7] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 font-sans text-sm">
            {SHARED_NAVIGATION.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleScrollTo(item.id)}
                className="text-left py-1 text-[#20201E] hover:text-[#B9684E] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="pt-4 border-t border-[#E9E7E1]">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo('contact');
              }}
              className="inline-block text-xs font-medium py-2.5 px-5 bg-[#20201E] text-white rounded-[6px]"
            >
              Contact us
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
