import React from 'react';
import { FileText, Download, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ReportHistoryItem } from '@/api/client';

interface ReportHistoryTableProps {
  history: ReportHistoryItem[];
  onReDownload?: (reportType: string) => void;
  isLoading?: boolean;
}

export function ReportHistoryTable({
  history,
  onReDownload,
  isLoading = false,
}: ReportHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 animate-pulse space-y-3">
        <div className="h-4 w-48 bg-card rounded" />
        <div className="h-24 w-full bg-card rounded" />
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-2">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-text-muted">
          <FileText className="h-5 w-5" />
        </div>
        <h4 className="text-xs font-bold text-text-main font-heading uppercase">
          No Reports Generated Yet
        </h4>
        <p className="text-xs text-text-muted max-w-sm mx-auto">
          Generated PDF reports will appear in this audit log with instant re-download access.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
      <div className="px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-main font-heading">
            Recent Generated Reports Audit Log
          </h3>
        </div>
        <span className="text-[11px] font-mono text-text-muted">
          {history.length} report{history.length === 1 ? '' : 's'} on record
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface/50 text-[10px] font-bold uppercase tracking-wider text-text-muted">
              <th className="py-3 px-4">Report Title</th>
              <th className="py-3 px-4">Focus</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Latency</th>
              <th className="py-3 px-4">Generated At</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {history.map((item) => {
              const formattedDate = new Date(item.generated_at).toLocaleString();
              const sizeKb = (item.file_size_bytes / 1024).toFixed(1);
              return (
                <tr key={item.id} className="hover:bg-surface/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                        <FileText className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-text-main">{item.report_title}</div>
                        <div className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5 text-primary" /> Gemini AI Synthesized
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-text-muted uppercase">
                    {item.report_type.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-text-muted">{sizeKb} KB</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-text-muted">
                    {item.generation_ms}ms
                  </td>
                  <td className="py-3 px-4 text-text-muted text-[11px]">{formattedDate}</td>
                  <td className="py-3 px-4 text-right">
                    {onReDownload && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onReDownload(item.report_type)}
                        className="h-7 px-2.5 text-xs text-primary hover:text-text-main"
                      >
                        <Download className="h-3 w-3 mr-1" /> Re-Download
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
