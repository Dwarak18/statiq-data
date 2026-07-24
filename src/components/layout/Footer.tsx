import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, ShieldCheck, Terminal, Globe2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export function Footer() {
  const { showToast } = useToast();

  const handleSocialClick = (platform: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    showToast(`Redirecting to STATIQDATA official ${platform} portal...`, 'info');
  };

  return (
    <footer className="border-t border-border bg-background px-4 py-12 md:px-6 text-xs">
      <div className="container mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-primary/30 text-primary">
              <BarChart2 className="h-4 w-4" />
            </div>
            <span className="text-base font-bold tracking-tight font-heading text-text-main">
              STATIQ<span className="text-primary">DATA</span>
            </span>
          </Link>
          <p className="text-xs text-text-muted max-w-sm mb-6 leading-relaxed">
            Enterprise Financial Research & Market Intelligence Platform for institutional investors, hedge funds, private equity, and research analysts worldwide.
          </p>
          <div className="flex items-center gap-4 text-text-muted">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> SEC EDGAR Audited
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Terminal className="h-3.5 w-3.5 text-primary" /> API v4 Sync
            </span>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold uppercase font-mono tracking-wider mb-4 text-primary text-[11px]">Institutional</h4>
          <ul className="space-y-2.5 text-xs text-text-muted">
            <li><Link to="/search" className="hover:text-primary transition-colors">Statistics Explorer</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary transition-colors">Market Dashboards</Link></li>
            <li><Link to="/industry" className="hover:text-primary transition-colors">Industry Intelligence</Link></li>
            <li><Link to="/company" className="hover:text-primary transition-colors">Equity Fundamentals</Link></li>
            <li><Link to="/workspace" className="hover:text-primary transition-colors">Institutional API</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold uppercase font-mono tracking-wider mb-4 text-primary text-[11px]">Platform</h4>
          <ul className="space-y-2.5 text-xs text-text-muted">
            <li><Link to="/company" className="hover:text-primary transition-colors">About STATIQDATA</Link></li>
            <li><Link to="/workspace" className="hover:text-primary transition-colors">Data Feed Status</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary transition-colors">Methodology & Audit</Link></li>
            <li><Link to="/search" className="hover:text-primary transition-colors">Institutional Sales</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold uppercase font-mono tracking-wider mb-4 text-primary text-[11px]">Governance</h4>
          <ul className="space-y-2.5 text-xs text-text-muted">
            <li><Link to="/dataset" className="hover:text-primary transition-colors">API Documentation</Link></li>
            <li><Link to="/search" className="hover:text-primary transition-colors">Compliance & Security</Link></li>
            <li><Link to="/dataset" className="hover:text-primary transition-colors">Audit Disclosures</Link></li>
            <li><Link to="/dataset" className="hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto mt-12 flex flex-col md:flex-row items-center justify-between border-t border-border pt-6 text-[11px] text-text-muted font-mono">
        <p>© 2027 STATIQDATA Intelligence Inc. All rights reserved. Confidential & Proprietary.</p>
      </div>
    </footer>
  );
}
