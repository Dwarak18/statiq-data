import React from 'react';
import { NexDatalytixLogo } from './NexDatalytixLogo';
import { SHARED_NAVIGATION } from './navigationData';

export function NexDatalytixFooter() {
  return (
    <footer className="bg-[#F7F6F2] border-t border-[#DEDDD7] pt-18 pb-8 text-sans text-[#77756E]" style={{ paddingBlock: '72px 32px' }}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Footer Main Structure per Spec §22 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="space-y-3">
            {/* Footer Logo - 150px width per Spec §21 */}
            <div className="w-[150px]">
              <NexDatalytixLogo width="150px" />
            </div>
            <p className="text-[0.95rem] text-[#77756E] leading-[1.5] max-w-md font-sans">
              Data research, AI analytics, and software engineering.
            </p>
          </div>

          {/* Shared Footer Navigation per Spec §23 */}
          <div className="flex flex-wrap items-center gap-8 font-sans text-[0.9rem]">
            {SHARED_NAVIGATION.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-[#4F4E49] hover:text-[#20201E] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Footer Meta & Email per Spec §20, §22 */}
        <div className="pt-8 border-t border-[#E9E7E1] flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.82rem] text-[#77756E] font-sans">
          <span>© 2026 NexDatalytix Private Limited</span>
          <a
            href="mailto:contact@statiqone.com"
            className="text-[0.95rem] font-medium text-[#20201E] hover:text-[#B9684E] transition-colors"
          >
            contact@statiqone.com
          </a>
        </div>
      </div>
    </footer>
  );
}
