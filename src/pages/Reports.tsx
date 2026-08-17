import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Download,
  Layers,
  Shield,
  TrendingUp,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  api,
  ReportQuotaResponse,
  ReportHistoryItem,
  GenerateReportOptions,
  downloadReportFile,
  downloadSampleReportFile,
} from '@/api/client';
import {
  QuotaIndicator,
  ReportConfigModal,
  ReportCard,
  ReportTemplate,
  GatedState,
  ReportHistoryTable,
} from '@/components/reports';

export function Reports() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [quota, setQuota] = useState<ReportQuotaResponse | null>(null);
  const [history, setHistory] = useState<ReportHistoryItem[]>([]);
  const [isLoadingQuota, setIsLoadingQuota] = useState(true);
  const [downloadingTemplate, setDownloadingTemplate] = useState<string | null>(null);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [activeConfigType, setActiveConfigType] = useState<'full_market' | 'insurance_focus' | 'stock_focus'>('full_market');

  const fetchQuota = useCallback(async () => {
    try {
      setIsLoadingQuota(true);
      const data = await api.getReportQuota();
      setQuota(data);
    } catch (err: any) {
      console.warn('Failed to load quota:', err.message);
      // Fallback state
      setQuota({
        tier: user?.subscriptionTier || (user?.role === 'admin' ? 'annual' : 'free'),
        monthlyQuota: user?.subscriptionTier === 'monthly' ? 5 : user?.role === 'admin' || user?.subscriptionTier === 'annual' ? -1 : 0,
        usedThisMonth: user?.monthlyPdfCount || 0,
        remaining: user?.role === 'admin' || user?.subscriptionTier === 'annual' ? 'Unlimited' : user?.subscriptionTier === 'monthly' ? Math.max(0, 5 - (user?.monthlyPdfCount || 0)) : 0,
        isUnlimited: user?.role === 'admin' || user?.subscriptionTier === 'annual',
        canGenerate: (user?.role === 'admin' || user?.subscriptionTier === 'annual' || user?.subscriptionTier === 'monthly'),
      });
    } finally {
      setIsLoadingQuota(false);
    }
  }, [user]);

  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.getReportHistory();
      if (res && res.history) {
        setHistory(res.history);
      }
    } catch {
      // Non-fatal
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchQuota();
    fetchHistory();
  }, [fetchQuota, fetchHistory]);

  const triggerBlobDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleGenerateAndDownload = async (options: GenerateReportOptions) => {
    const templateId = options.reportType || 'full_market';
    setDownloadingTemplate(templateId);

    try {
      showToast('Compiling institutional vector PDF and Gemini AI synthesis...', 'info');
      const { blob, filename, documentId } = await downloadReportFile(options);

      triggerBlobDownload(blob, filename);
      showToast(`Report downloaded successfully (${filename})`, 'success');

      // Refresh quota and history after successful generation
      await fetchQuota();
      await fetchHistory();
    } catch (err: any) {
      if (err.status === 403) {
        showToast(err.message || 'Report generation requires a Monthly or Annual subscription.', 'error');
        navigate('/pricing');
      } else if (err.status === 401) {
        showToast('Please log in to generate and download reports.', 'error');
        navigate('/login');
      } else {
        showToast(err.message || 'Failed to generate PDF report.', 'error');
      }
    } finally {
      setDownloadingTemplate(null);
    }
  };

  const handleDownloadSample = async () => {
    try {
      setIsLoadingSample(true);
      showToast('Loading watermarked sample report...', 'info');
      const { blob, filename } = await downloadSampleReportFile();
      triggerBlobDownload(blob, filename);
      showToast('Sample report downloaded successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to load sample report.', 'error');
    } finally {
      setIsLoadingSample(false);
    }
  };

  const openConfigModal = (type: 'full_market' | 'insurance_focus' | 'stock_focus') => {
    setActiveConfigType(type);
    setIsConfigModalOpen(true);
  };

  const templates: ReportTemplate[] = [
    {
      id: 'full_market',
      title: 'Global Market & IRDAI Synthesis',
      subtitle: 'Complete Institutional Executive Brief',
      description:
        'The definitive 4-page cross-asset research dossier. Covers NASDAQ top movers, NSE India bluechips, audited IRDAI Q1 disclosures, and Gemini AI macro synthesis.',
      category: 'Cross-Asset',
      pageCount: 4,
      icon: Layers,
      recommended: true,
      features: [
        'Google Gemini AI Market Reasoning & Sentiment Score',
        'NASDAQ 100 & NSE Nifty 50 Screener Valuation Matrix',
        'IRDAI Gross Premium Accretion & Solvency League Table',
        'Underwriting Ratios & Audited Regulatory Disclosures',
      ],
    },
    {
      id: 'insurance_focus',
      title: 'Indian Non-Life & Health Intelligence',
      subtitle: 'IRDAI & GI Council Deep-Dive',
      description:
        'Focused intelligence report on the Indian insurance sector. Features Standalone Health Insurer (SAHI) growth curves, market shares, claims ratios, and solvency buffers.',
      category: 'Insurance',
      pageCount: 4,
      icon: Shield,
      features: [
        '₹87,917 Cr Gross Direct Premium Segment Accretion',
        'Top 10 Insurers League Table (New India, ICICI, Tata AIG)',
        'SAHI +32.89% Growth Analysis vs PSU Performance',
        'Net Retention, Claims, Commission & Expense Breakdown',
      ],
    },
    {
      id: 'stock_focus',
      title: 'Cross-Border Equity Screener Snapshot',
      subtitle: 'NASDAQ & NSE Valuation Benchmarks',
      description:
        'Multi-market valuation comparison. Highlights semiconductor & tech multiples against Indian conglomerates with 52-week position bands and P/E ratios.',
      category: 'Equities',
      pageCount: 4,
      icon: TrendingUp,
      features: [
        'Cross-Asset Valuation Multiple Dislocation Analysis',
        'Top Gainers, Losers, and Volume Breadth Indicators',
        'Tech (32.4x) vs Financials (18.2x) Benchmark Matrices',
        'Intraday Volatility & 52-Week Range Positioning',
      ],
    },
  ];

  const isFreeTier = !isAuthenticated || (quota && quota.tier === 'free');

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-8 space-y-8 max-w-7xl">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-border">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/30">
                <FileText className="h-5 w-5" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main font-heading">
                AI-Analysed PDF Market Intelligence
              </h1>
            </div>
            <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
              Institutional-grade server-side vector PDF generation powered by Google Gemini AI,
              live NASDAQ & NSE feeds, and official IRDAI regulatory disclosures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchQuota}
              disabled={isLoadingQuota}
              className="text-xs text-text-muted hover:text-text-main border-border"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoadingQuota ? 'animate-spin' : ''}`} />
              Refresh Quota
            </Button>
            <Button
              size="sm"
              onClick={() => openConfigModal('full_market')}
              className="bg-primary text-black font-bold text-xs hover:bg-hover shadow-sm flex items-center gap-1.5"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Configure Custom Report
            </Button>
          </div>
        </div>

        {/* Quota Indicator Meter */}
        <QuotaIndicator quota={quota} isLoading={isLoadingQuota} />

        {/* Main Content Area */}
        {isFreeTier ? (
          <GatedState onPreviewSample={handleDownloadSample} isLoadingSample={isLoadingSample} />
        ) : (
          <div className="space-y-8">
            {/* Preset Report Templates */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-text-main font-heading tracking-tight">
                  Institutional Report Templates
                </h2>
                <span className="text-xs text-text-muted font-mono">
                  All templates compiled in Vector PDF (A4)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((tpl) => (
                  <ReportCard
                    key={tpl.id}
                    template={tpl}
                    onDownload={(type) => handleGenerateAndDownload({ reportType: type })}
                    onCustomize={(type) => openConfigModal(type)}
                    isDownloading={downloadingTemplate === tpl.id}
                    canGenerate={quota?.canGenerate ?? false}
                  />
                ))}
              </div>
            </div>

            {/* Generated Reports History */}
            <ReportHistoryTable
              history={history}
              onReDownload={(type) => handleGenerateAndDownload({ reportType: type as any })}
              isLoading={isLoadingQuota}
            />
          </div>
        )}

        {/* Report Configuration Modal */}
        <ReportConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          onGenerate={handleGenerateAndDownload}
          quota={quota}
          initialReportType={activeConfigType}
        />
      </div>
    </Layout>
  );
}

export default Reports;
