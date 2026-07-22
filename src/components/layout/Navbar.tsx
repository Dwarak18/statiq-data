import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, BarChart2, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Statistics', path: '/statistics' },
    { label: 'Industries', path: '/industry' },
    { label: 'Companies', path: '/company' },
    { label: 'Countries', path: '/country' },
    { label: 'Workspace', path: '/workspace' },
    { label: 'Dashboards', path: '/dashboard' }
  ];

  const isActivePath = (path: string) => location.pathname === path;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <BarChart2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight font-heading text-primary">STATIQDATA</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-text-muted">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors ${
                  isActivePath(item.path) ? 'text-primary font-bold' : 'hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="hidden xl:flex relative group">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search statistics, reports..."
              className="h-9 w-56 rounded-md border border-border bg-background px-8 py-2 text-sm outline-none transition-all focus:border-primary focus:w-72"
            />
          </form>
          
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log in</Button>
            <Button size="sm" onClick={() => navigate('/signup')}>Sign up</Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface/95 backdrop-blur-lg px-4 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative mb-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 3.5M+ statistics, reports..."
              className="w-full h-10 rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-text-main outline-none focus:border-primary"
            />
          </form>

          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActivePath(item.path)
                    ? 'text-primary bg-primary/10 font-bold border-l-4 border-primary pl-2'
                    : 'text-text-main hover:bg-background hover:text-primary'
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
              size="md"
              className="w-full justify-center h-10 text-sm font-medium"
              onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
            >
              Log in
            </Button>
            <Button
              size="md"
              className="w-full justify-center h-10 text-sm font-semibold bg-primary hover:bg-primary/90 text-white shadow-sm"
              onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }}
            >
              Sign up
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
