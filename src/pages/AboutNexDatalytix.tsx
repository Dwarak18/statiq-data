import React, { useEffect, useState } from 'react';
import { NexDatalytixHeader } from '@/components/about-nexdatalytix/NexDatalytixHeader';
import { NexDatalytixHero } from '@/components/about-nexdatalytix/NexDatalytixHero';
import { WhoWeAre } from '@/components/about-nexdatalytix/WhoWeAre';
import { IntelligenceIntersection } from '@/components/about-nexdatalytix/IntelligenceIntersection';
import { ResearchAndTechnology } from '@/components/about-nexdatalytix/ResearchAndTechnology';
import { PrinciplesList } from '@/components/about-nexdatalytix/PrinciplesList';
import { CapabilityExplorer } from '@/components/about-nexdatalytix/CapabilityExplorer';
import { NexDatalytixCTA } from '@/components/about-nexdatalytix/NexDatalytixCTA';
import { NexDatalytixFooter } from '@/components/about-nexdatalytix/NexDatalytixFooter';

export function AboutNexDatalytix() {
  const [activeSection, setActiveSection] = useState<string>('about');

  useEffect(() => {
    document.title = 'About NexDatalytix Private Limited | Data Research & AI Analytics';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Learn about NexDatalytix Private Limited, a Chennai-based organisation working across data research, AI analytics, technology, and research-driven services.'
      );
    }

    // Scroll spy IntersectionObserver for section navigation
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const handleNavigate = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      const header = document.querySelector('[data-site-header]');
      const headerHeight = header ? header.getBoundingClientRect().height : 70;
      const top = elem.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#20201E] font-sans antialiased selection:bg-[#EAD8D0] selection:text-[#20201E]">
      <NexDatalytixHeader currentSection={activeSection} onNavigate={handleNavigate} />
      <main id="main-content">
        <NexDatalytixHero />
        <WhoWeAre />
        <IntelligenceIntersection />
        <ResearchAndTechnology />
        <PrinciplesList />
        <CapabilityExplorer />
        <NexDatalytixCTA />
      </main>
      <NexDatalytixFooter />
    </div>
  );
}
