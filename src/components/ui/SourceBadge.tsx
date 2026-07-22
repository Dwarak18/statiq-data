import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, ExternalLink, Award, Clock, RefreshCw } from 'lucide-react';
import { VerifiedSource, DataQualityScore } from '@/services/types';
import { useToast } from '@/context/ToastContext';
import { buildCitation } from '@/services/liveConnectors';

interface SourceBadgeProps {
  title: string;
  source: VerifiedSource;
  qualityScore: DataQualityScore;
  lastUpdated: string;
  updateFrequency?: string;
  className?: string;
}

export function SourceBadge({
  title,
  source,
  qualityScore,
  lastUpdated,
  updateFrequency = 'Daily',
  className = ''
}: SourceBadgeProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopyCitation = () => {
    const citation = buildCitation(title, source, lastUpdated);
    navigator.clipboard.writeText(citation);
    setCopied(true);
    showToast('Source citation copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`rounded-xl border border-border bg-surface/80 p-4 shadow-sm backdrop-blur-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-text-main">{source.name}</span>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-text-muted hover:text-primary transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <span className="text-[10px] font-mono text-emerald-500 font-semibold">{source.verificationStatus}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 px-2 py-1 rounded-md text-xs font-mono font-bold text-primary">
            <Award className="h-3.5 w-3.5" />
            <span>STATIQDATA Score: {qualityScore.score}/100 ({qualityScore.grade})</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono text-text-muted mb-3">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-text-muted shrink-0" />
          <span>Last Updated: {lastUpdated}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5 text-text-muted shrink-0" />
          <span>Update Frequency: {updateFrequency}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
          <span className="truncate">Data Provider: {source.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Confidence: {qualityScore.accuracy}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Quality Rating: {qualityScore.grade}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>License: Research Use</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs">
        <span className="text-[11px] text-text-muted italic truncate">"{title}"</span>
        <button
          onClick={handleCopyCitation}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline shrink-0 cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Citation Copied' : 'Copy Citation'}
        </button>
      </div>
    </div>
  );
}
