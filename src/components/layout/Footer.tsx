import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Twitter, Linkedin, Github } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export function Footer() {
  const { showToast } = useToast();

  const handleSocialClick = (platform: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    showToast(`Redirecting to STATIQDATA official ${platform} page...`, 'info');
  };

  return (
    <footer className="border-t border-border bg-surface px-4 py-12 md:px-6">
      <div className="container mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <BarChart2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight font-heading text-primary">STATIQDATA</span>
          </Link>
          <p className="text-sm text-text-muted max-w-sm mb-6">
            Global Data Intelligence & Research Platform for modern enterprise. Uncovering trends, analyzing markets, and delivering real-time actionable insights.
          </p>
          <div className="flex gap-4">
            <a href="#twitter" onClick={handleSocialClick('Twitter')} className="text-text-muted hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#linkedin" onClick={handleSocialClick('LinkedIn')} className="text-text-muted hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#github" onClick={handleSocialClick('GitHub')} className="text-text-muted hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-text-main font-heading">Products</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><Link to="/search" className="hover:text-primary transition-colors">Statistics Explorer</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary transition-colors">Market Dashboards</Link></li>
            <li><Link to="/industry" className="hover:text-primary transition-colors">Industry Reports</Link></li>
            <li><Link to="/company" className="hover:text-primary transition-colors">Company Insights</Link></li>
            <li><Link to="/workspace" className="hover:text-primary transition-colors">API Access</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-text-main font-heading">Company</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><Link to="/company" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/workspace" className="hover:text-primary transition-colors">Careers</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary transition-colors">Press</Link></li>
            <li><Link to="/search" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-text-main font-heading">Resources</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><Link to="/dataset" className="hover:text-primary transition-colors">Documentation</Link></li>
            <li><Link to="/search" className="hover:text-primary transition-colors">Support Center</Link></li>
            <li><Link to="/dataset" className="hover:text-primary transition-colors">Methodology</Link></li>
            <li><Link to="/dataset" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/dataset" className="hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto mt-12 flex flex-col md:flex-row items-center justify-between border-t border-border pt-8 text-xs text-text-muted">
        <p>© 2027 STATIQDATA Intelligence. All rights reserved.</p>
        <p className="mt-4 md:mt-0">Real-time enterprise data platform.</p>
      </div>
    </footer>
  );
}
