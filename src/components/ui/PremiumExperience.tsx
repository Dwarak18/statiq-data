import React from 'react';
import { Badge } from './Badge';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import {
  Award,
  CheckCircle2,
  Database,
  Download,
  FileArchive,
  FileCode,
  FileJson,
  FileSpreadsheet,
  FileText,
  KeyRound,
  Lock,
  ShieldCheck,
  Sparkles,
  TableProperties,
  TimerReset
} from 'lucide-react';

interface VerificationPanelProps {
  provider: string;
  source: string;
  lastUpdated: string;
  frequency: string;
  confidence: string;
  quality: string;
  citation: string;
  dataset: string;
  license: string;
  className?: string;
}

export function PremiumBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge className="bg-primary/10 text-primary border-primary/20 font-mono">
      <ShieldCheck className="h-3 w-3 mr-1" />
      {children}
    </Badge>
  );
}

export function VerificationPanel({
  provider,
  source,
  lastUpdated,
  frequency,
  confidence,
  quality,
  citation,
  dataset,
  license,
  className = ''
}: VerificationPanelProps) {
  const items = [
    ['Verified Source', source],
    ['Data Provider', provider],
    ['Last Updated', lastUpdated],
    ['Update Frequency', frequency],
    ['Confidence Score', confidence],
    ['Data Quality Rating', quality],
    ['Verification Badge', 'Institutional Grade'],
    ['Citation', citation],
    ['Original Dataset', dataset],
    ['Data License', license]
  ];

  return (
    <Card className={`shadow-sm border-border ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-text-main">Enterprise Verification</h3>
            <p className="text-[11px] text-text-muted">Complete provenance for every visible statistic.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {items.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-border bg-background/60 p-2">
              <div className="text-[9px] uppercase tracking-wider font-mono text-text-muted">{label}</div>
              <div className="text-[11px] font-semibold text-text-main truncate">{value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface DatasetPreviewMetaProps {
  totalRows: string;
  totalColumns: string;
  visibleScope: string;
  source: string;
  frequency: string;
  formats: string;
}

export function DatasetPreviewMeta({
  totalRows,
  totalColumns,
  visibleScope,
  source,
  frequency,
  formats
}: DatasetPreviewMetaProps) {
  const items = [
    { icon: TableProperties, label: 'Preview Scope', value: visibleScope },
    { icon: Database, label: 'Total Records', value: totalRows },
    { icon: FileArchive, label: 'Columns', value: totalColumns },
    { icon: ShieldCheck, label: 'Source', value: source },
    { icon: TimerReset, label: 'Refresh', value: frequency },
    { icon: Download, label: 'Formats', value: formats }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="rounded-xl border border-border bg-surface p-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-mono text-text-muted mb-1">
            <Icon className="h-3.5 w-3.5" />
            {label}
          </div>
          <div className="text-xs font-bold text-text-main">{value}</div>
        </div>
      ))}
    </div>
  );
}

interface LockedPreviewProps {
  title: string;
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function LockedPreview({ title, value, children, className = '' }: LockedPreviewProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-border bg-surface ${className}`}>
      <div className="pointer-events-none blur-[2px] opacity-55 select-none">{children}</div>
      <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-surface/50 to-surface/95" />
      <div className="absolute inset-x-4 bottom-4 rounded-xl border border-primary/20 bg-surface/95 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <Lock className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-heading text-sm font-bold text-text-main">{title}</h3>
            <p className="text-xs text-text-muted leading-relaxed mt-1">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UpgradeCardProps {
  title: string;
  description: string;
  features: string[];
  action?: string;
  className?: string;
}

export function UpgradeCard({
  title,
  description,
  features,
  action = 'View Premium Plans',
  className = ''
}: UpgradeCardProps) {
  return (
    <Card className={`bg-primary/5 border-primary/20 ${className}`}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-heading font-bold text-sm text-primary">{title}</h3>
        </div>
        <p className="text-xs text-text-muted leading-relaxed mb-4">{description}</p>
        <div className="space-y-2 mb-4">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-xs text-text-main">
              <Award className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 text-xs">
          <KeyRound className="h-3.5 w-3.5 mr-1.5" />
          {action}
        </Button>
      </CardContent>
    </Card>
  );
}

export function DownloadFormatsPreview() {
  const formats = [
    { label: 'PDF', icon: FileText },
    { label: 'Excel', icon: FileSpreadsheet },
    { label: 'CSV', icon: FileSpreadsheet },
    { label: 'JSON', icon: FileJson },
    { label: 'XML', icon: FileCode },
    { label: 'Power BI', icon: Database },
    { label: 'Tableau', icon: TableProperties },
    { label: 'API', icon: KeyRound }
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {formats.map(({ label, icon: Icon }) => (
        <div key={label} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background/70 p-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-main">
            <Icon className="h-3.5 w-3.5 text-primary" />
            {label}
          </div>
          <Badge variant="outline" className="text-[9px] font-mono bg-surface">Premium Required</Badge>
        </div>
      ))}
    </div>
  );
}
