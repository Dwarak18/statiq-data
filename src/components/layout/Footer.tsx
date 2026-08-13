import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, ShieldCheck, Terminal } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export function Footer() {
  return (
    <footer className="border-t border-[#DEDDD7] bg-[#F7F6F2] px-4 py-12 md:px-6 text-xs text-[#77756E]">
      <Container>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Block (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2" aria-label="STATIQ ONE Home">
              <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#20201E] text-white">
                <BarChart2 className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-tight font-heading text-[#20201E]">
                STATIQ<span className="text-[#B9684E]">ONE</span>
              </span>
            </Link>

            <p className="text-xs text-[#77756E] max-w-sm leading-relaxed">
              Enterprise Financial Research &amp; Market Intelligence Platform for institutional investors, hedge funds, private equity, and quantitative research analysts worldwide.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[#77756E]">
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#B9684E]" /> SEC EDGAR Audited
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Terminal className="h-3.5 w-3.5 text-[#B9684E]" /> API v4 Sync
              </span>
            </div>
          </div>

          {/* Institutional Navigation (1 col) */}
          <div>
            <h4 className="font-bold uppercase font-mono tracking-wider mb-4 text-[#20201E] text-[11px]">
              Institutional
            </h4>
            <ul className="space-y-2.5 text-xs text-[#77756E]">
              <li>
                <Link to="/statistics" className="hover:text-[#B9684E] transition-colors">
                  Statistics Explorer
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#B9684E] transition-colors">
                  Market Dashboards
                </Link>
              </li>
              <li>
                <Link to="/industry" className="hover:text-[#B9684E] transition-colors">
                  Industry Intelligence
                </Link>
              </li>
              <li>
                <Link to="/company" className="hover:text-[#B9684E] transition-colors">
                  Equity Fundamentals
                </Link>
              </li>
              <li>
                <Link to="/workspace" className="hover:text-[#B9684E] transition-colors">
                  Institutional API
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links (1 col) */}
          <div>
            <h4 className="font-bold uppercase font-mono tracking-wider mb-4 text-[#20201E] text-[11px]">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-[#77756E]">
              <li>
                <Link to="/nexdatalytix" className="hover:text-[#B9684E] font-medium text-[#20201E] transition-colors">
                  About NexDatalytix
                </Link>
              </li>
              <li>
                <Link to="/workspace" className="hover:text-[#B9684E] transition-colors">
                  Data Feed Status
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#B9684E] transition-colors">
                  Methodology &amp; Audit
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#B9684E] transition-colors">
                  Institutional Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Legal (1 col) */}
          <div>
            <h4 className="font-bold uppercase font-mono tracking-wider mb-4 text-[#20201E] text-[11px]">
              Governance
            </h4>
            <ul className="space-y-2.5 text-xs text-[#77756E]">
              <li>
                <Link to="/dataset" className="hover:text-[#B9684E] transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-[#B9684E] transition-colors">
                  Compliance &amp; Security
                </Link>
              </li>
              <li>
                <Link to="/dataset" className="hover:text-[#B9684E] transition-colors">
                  Audit Disclosures
                </Link>
              </li>
              <li>
                <Link to="/dataset" className="hover:text-[#B9684E] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Live Status & Copyright Bar */}
        <div className="mt-12 pt-6 border-t border-[#DEDDD7] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#9A9890]">
          <p>© 2027 STATIQDATA Intelligence Inc. All rights reserved. SEC EDGAR Audited Lineage.</p>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#657B6C] animate-pulse" />
            <span className="text-[#4F4E49]">3,542,109 Series Syncing</span>
            <span className="text-[#9A9890]">// API v4 Operational</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
