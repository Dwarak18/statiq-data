import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { ProductSurface } from '@/components/sections/ProductSurface';
import { Capabilities } from '@/components/sections/Capabilities';
import { Methodology } from '@/components/sections/Methodology';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { ProofStrip } from '@/components/sections/ProofStrip';
import { IntelligenceFlow } from '@/components/sections/IntelligenceFlow';
import { UseCases } from '@/components/sections/UseCases';
import { Evidence } from '@/components/sections/Evidence';
import { About } from '@/components/sections/About';

const SECTION_IDS = ['product', 'capabilities', 'methodology', 'intelligence-flow', 'use-cases', 'evidence', 'about'];

/**
 * Centralized scroll helper — measures the live header height at call time,
 * so it remains correct even when the header collapses/expands on scroll.
 */
function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  const header = document.querySelector<HTMLElement>('[data-site-header]');
  const headerHeight = header ? header.getBoundingClientRect().height : 0;

  // Prefer CSS scroll-margin-top (already set in index.css) + native smooth scroll
  // Fall back to manual calculation so the header never covers the target.
  const top =
    element.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
}

export function Home() {
  const [currentSection, setCurrentSection] = useState<string>('');

  // IntersectionObserver — active section state stays in sync with viewport position.
  // rootMargin accounts for the sticky header height (≈64px) + a 55% bottom clip so
  // only the topmost visible section is highlighted.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-80px 0px -55% 0px',
        threshold: 0,
      }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavigate = useCallback((id: string) => {
    scrollToSection(id);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F6F2] font-sans text-[#20201E]">
      <Header currentSection={currentSection} onNavigate={handleNavigate} />

      <main className="flex-1">
        <Hero />
        <ProofStrip />
        <ProductSurface />
        <Capabilities />
        <IntelligenceFlow />
        <UseCases />
        <Methodology />
        <Evidence />
        <About />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
