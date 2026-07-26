import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, BarChart2, Menu, X, Command, Bell, User, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SpotlightSearchModal } from '@/components/ui/SpotlightSearchModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Navbar() {
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Statistics', path: '/statistics' },
    { label: 'Industries', path: '/industry' },
    { label: 'Companies', path: '/company' },
    { label: 'Countries', path: '/country' },
    { label: 'Workspace', path: '/workspace' },
    { label: 'Dashboards', path: '/dashboard' },
    { label: 'Pricing', path: '/pricing' }
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group" aria-label="STATIQDATA Home">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-primary/30 text-primary group-hover:border-primary transition-all">
                <BarChart2 className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight font-heading text-text-main flex items-center gap-1.5">
                  STATIQ<span className="text-primary">DATA</span>
                </span>
              </div>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-text-muted" aria-label="Main Navigation">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-colors relative py-1 ${
                    isActivePath(item.path) 
                      ? 'text-primary font-bold' 
                      : 'hover:text-text-main'
                  }`}
                >
                  {item.label}
                  {isActivePath(item.path) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Controls: Spotlight Search Trigger, Notifications & Auth */}
          <div className="flex items-center gap-3">
            {/* Spotlight Search Input Trigger */}
            <button
              onClick={() => setIsSpotlightOpen(true)}
              aria-label="Open Spotlight Search"
              className="hidden sm:flex items-center gap-3 h-9 px-3.5 rounded-lg border border-border bg-surface text-text-muted text-xs hover:border-primary/40 transition-all w-64 lg:w-72 justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-text-muted group-hover:text-primary transition-colors" />
                <span className="truncate">Spotlight search...</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px] bg-card px-1.5 py-0.5 rounded border border-border">
                <Command className="h-3 w-3" /> K
              </div>
            </button>
            
            {/* Workspace & Notification */}
            <div className="hidden md:flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/workspace')} 
                className="text-xs text-text-muted hover:text-text-main"
                aria-label="Open Workspace"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1 text-primary" /> Workspace
              </Button>

              <button
                onClick={() => navigate('/dashboard')}
                aria-label="View Notifications"
                className="relative p-2 rounded-lg border border-border bg-surface text-text-muted hover:text-text-main hover:border-primary/30 transition-all cursor-pointer"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
              </button>

              <ThemeToggle />

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/login')} 
                className="text-xs font-semibold border-border hover:border-primary/50"
              >
                Log in
              </Button>
              <Button 
                size="sm" 
                onClick={() => navigate('/signup')} 
                className="text-xs font-bold bg-primary text-black hover:bg-hover shadow-sm"
              >
                Institutional Access
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle Navigation Menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-surface px-4 py-5 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => { setIsMobileMenuOpen(false); setIsSpotlightOpen(true); }}
              aria-label="Open Spotlight Search Modal"
              className="w-full h-10 rounded-lg border border-border bg-card px-3.5 flex items-center justify-between text-xs text-text-muted"
            >
              <span className="flex items-center gap-2"><Search className="h-4 w-4 text-primary" /> Spotlight Search...</span>
              <span className="font-mono text-[10px] bg-surface px-1.5 py-0.5 rounded border border-border">Cmd + K</span>
            </button>

            <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActivePath(item.path)
                      ? 'text-primary bg-primary/10 font-bold border-l-2 border-primary pl-2'
                      : 'text-text-muted hover:bg-background hover:text-text-main'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-text-muted font-mono opacity-60">&rarr;</span>
                </Link>
              ))}
            </nav>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center h-10 text-xs font-semibold"
                onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
              >
                Log in
              </Button>
              <Button
                size="sm"
                className="w-full justify-center h-10 text-xs font-bold bg-primary text-black hover:bg-hover shadow-sm"
                onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }}
              >
                Get Started
              </Button>
            </div>

            {/* Theme toggle in mobile menu */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Appearance</span>
              <ThemeToggle />
            </div>
          </div>
        )}
      </header>

      {/* Spotlight Search Overlay Modal */}
      <SpotlightSearchModal 
        isOpen={isSpotlightOpen} 
        onClose={() => setIsSpotlightOpen(false)} 
      />
    </>
  );
}
