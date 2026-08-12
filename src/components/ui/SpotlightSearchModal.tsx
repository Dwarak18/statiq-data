import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Command, ArrowRight, CornerDownLeft, X, Database, Building2, Globe, FileText, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface SpotlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_SUGGESTIONS = [
  { label: 'Global Generative AI Revenue Forecast 2026-2030', category: 'Technology', type: 'Dataset', path: '/dataset' },
  { label: 'NVIDIA Corp Financial Analysis & Margin Growth', category: 'Company', type: 'Equities', path: '/company' },
  { label: 'US Federal Reserve Interest Rate Outlook 2026-2027', category: 'Economy', type: 'Macro', path: '/country' },
  { label: 'Global Semiconductor Supply Chain Bottlenecks', category: 'Industry', type: 'Report', path: '/industry' },
  { label: 'India GDP Growth vs Emerging Market Peers', category: 'Country', type: 'Macro', path: '/country' }
];

export function SpotlightSearchModal({ isOpen, onClose }: SpotlightSearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open signal
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/50 transition-all border-primary/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleFormSubmit} className="flex items-center border-b border-border px-4 py-3.5 bg-surface">
          <Search className="h-5 w-5 text-primary shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a query or search statistics, tickers, macro data (e.g. 'US Inflation 2026')..."
            className="w-full bg-transparent text-text-main text-base outline-none placeholder:text-text-muted font-medium"
          />
          {query && (
            <button 
              type="button" 
              onClick={() => setQuery('')}
              className="p-1 text-text-muted hover:text-text-main transition-colors mr-2"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Badge variant="outline" className="hidden md:flex items-center gap-1 font-mono text-[10px] text-text-muted border-border">
            <Command className="h-3 w-3" /> K
          </Badge>
        </form>

        {/* AI Synthesis Assistant Teaser if query typed */}
        {query && (
          <div className="px-4 py-3 bg-primary/5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-primary font-medium">
              <Sparkles className="h-4 w-4 animate-pulse shrink-0" />
              <span>AI Search: Analyzing 3.5M+ financial series for "{query}"</span>
            </div>
            <button 
              onClick={handleFormSubmit}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Run AI Analysis <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-text-muted">
            {query ? 'Search Suggestions' : 'Trending Institutional Queries'}
          </div>

          {QUICK_SUGGESTIONS.filter(item => !query || item.label.toLowerCase().includes(query.toLowerCase())).map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item.path)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                selectedIndex === idx ? 'bg-surface border border-primary/30 text-text-main' : 'hover:bg-surface/50 text-text-muted hover:text-text-main'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.type === 'Dataset' && <Database className="h-4 w-4 text-primary shrink-0" />}
                {item.type === 'Equities' && <Building2 className="h-4 w-4 text-primary shrink-0" />}
                {item.type === 'Macro' && <Globe className="h-4 w-4 text-primary shrink-0" />}
                {item.type === 'Report' && <FileText className="h-4 w-4 text-primary shrink-0" />}
                <span className="text-sm font-medium truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="text-[10px] font-mono border-border">{item.category}</Badge>
                <CornerDownLeft className="h-3.5 w-3.5 text-text-muted opacity-50" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-surface text-[11px] text-text-muted">
          <div className="hidden md:flex items-center gap-4">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono text-[10px]">↑↓</kbd> navigate</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono text-[10px]">↵</kbd> select</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono text-[10px]">esc</kbd> close</span>
          </div>
          <span className="font-mono text-primary font-semibold">STATIQONE Intelligence</span>
        </div>
      </div>
    </div>
  );
}
