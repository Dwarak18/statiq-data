import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, Code, FileCode, Printer, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { useToast } from '@/context/ToastContext';

interface ExportDropdownProps {
  title: string;
  source: string;
  lastUpdated: string;
  columns: string[];
  rows: (string | number)[][];
  className?: string;
}

export function ExportDropdown({
  title,
  source,
  lastUpdated,
  columns,
  rows,
  className = ''
}: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format: string) => {
    setIsOpen(false);
    showToast(`${format.toUpperCase()} export is available with Premium. Preview data remains visible on this page.`, 'info');
  };

  const premiumLabel = <span className="text-[9px] font-mono text-primary">Premium Required</span>;

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary hover:bg-primary/90 text-white font-medium shadow-sm flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto h-10"
      >
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Download Dataset</span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 opacity-80" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 w-full sm:w-64 max-h-[75vh] overflow-y-auto rounded-xl bg-surface border border-border shadow-xl z-50 py-2 text-xs font-medium backdrop-blur-md animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] uppercase font-mono text-text-muted border-b border-border mb-1">
            STATIQDATA Export Formats
          </div>
          <button
            onClick={() => handleExport('csv')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-text-main hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-left"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
            <div>
              <div className="font-semibold">CSV Format (.csv)</div>
              <div className="text-[10px] text-text-muted">Standard data table • {premiumLabel}</div>
            </div>
          </button>

          <button
            onClick={() => handleExport('excel')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-text-main hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-left"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <div>
              <div className="font-semibold">Excel Workbook (.xls)</div>
              <div className="text-[10px] text-text-muted">Microsoft Excel compatible • {premiumLabel}</div>
            </div>
          </button>

          <button
            onClick={() => handleExport('json')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-text-main hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-left"
          >
            <Code className="h-4 w-4 text-sky-500" />
            <div>
              <div className="font-semibold">JSON Schema (.json)</div>
              <div className="text-[10px] text-text-muted">Structured API response • {premiumLabel}</div>
            </div>
          </button>

          <button
            onClick={() => handleExport('xml')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-text-main hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-left"
          >
            <FileCode className="h-4 w-4 text-amber-500" />
            <div>
              <div className="font-semibold">XML Document (.xml)</div>
              <div className="text-[10px] text-text-muted">Enterprise XML payload • {premiumLabel}</div>
            </div>
          </button>

          <div className="border-t border-border my-1" />

          <button
            onClick={() => handleExport('pdf')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-text-main hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-left"
          >
            <Printer className="h-4 w-4 text-rose-500" />
            <div>
              <div className="font-semibold">PDF Summary Report</div>
              <div className="text-[10px] text-text-muted">Printable document view • {premiumLabel}</div>
            </div>
          </button>

          <button
            onClick={() => handleExport('power bi')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-text-main hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-left"
          >
            <FileSpreadsheet className="h-4 w-4 text-primary" />
            <div>
              <div className="font-semibold">Power BI Connector</div>
              <div className="text-[10px] text-text-muted">BI-ready dataset • {premiumLabel}</div>
            </div>
          </button>

          <button
            onClick={() => handleExport('tableau')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-text-main hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-left"
          >
            <FileText className="h-4 w-4 text-sky-500" />
            <div>
              <div className="font-semibold">Tableau Extract</div>
              <div className="text-[10px] text-text-muted">Workbook-ready extract • {premiumLabel}</div>
            </div>
          </button>

          <button
            onClick={() => handleExport('api')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-text-main hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-left"
          >
            <Code className="h-4 w-4 text-amber-500" />
            <div>
              <div className="font-semibold">API Access</div>
              <div className="text-[10px] text-text-muted">Machine-readable feed • {premiumLabel}</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
