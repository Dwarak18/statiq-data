import React, { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShareModal } from '@/components/ui/Modal';
import { DownloadFormatsPreview, LockedPreview, PremiumBadge, UpgradeCard, VerificationPanel } from '@/components/ui/PremiumExperience';
import { useToast } from '@/context/ToastContext';
import { Download, Share2, Star, MapPin, Globe, Activity, ArrowUpRight, ArrowDownRight, BarChart2, Hash, FileText, Lock } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { analyticsApi, AnalyticsOverview } from '@/api/client';

export function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;

    analyticsApi.overview()
      .then((result) => {
        if (!cancelled) setAnalytics(result);
      })
      .catch(() => {
        if (!cancelled) setAnalyticsError('Live market summary is temporarily unavailable.');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveToggle = () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    if (nextSaved) {
      showToast('Dashboard saved to your workspace!', 'success');
    } else {
      showToast('Dashboard removed from workspace', 'info');
    }
  };

  const handleDownloadPdf = () => {
    showToast('PDF export preview available. Premium unlocks full report download.', 'info');
  };

  const handleExportExcel = () => {
    showToast('Excel export requires Premium. Preview rows remain available.', 'info');
  };

  const sectorChart = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '12%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: analytics?.sectors.map((sector) => sector.sector) || [],
      axisLabel: { interval: 0, rotate: 30, fontSize: 10 },
    },
    yAxis: { type: 'value', minInterval: 1 },
    series: [{
      name: 'Tracked symbols',
      type: 'bar',
      data: analytics?.sectors.map((sector) => sector.count) || [],
      itemStyle: { color: '#B9684E' },
    }],
  };

  const moversOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '12%', top: '8%', containLabel: true },
    xAxis: { type: 'category', data: analytics?.movers.topGainers.slice(0, 6).map((quote) => quote.symbol) || [] },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: 'Change',
        type: 'bar',
        data: analytics?.movers.topGainers.slice(0, 6).map((quote) => quote.changePercent) || [],
        itemStyle: { color: '#657B6C' },
      },
    ]
  };

  const activityOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '12%', top: '8%', containLabel: true },
    xAxis: { type: 'category', data: analytics?.movers.mostActive.map((quote) => quote.symbol) || [] },
    yAxis: { type: 'value', axisLabel: { formatter: (value: number) => `${(value / 1e6).toFixed(0)}M` } },
    series: [
      {
        name: 'Volume',
        type: 'bar',
        data: analytics?.movers.mostActive.map((quote) => quote.volume) || [],
        itemStyle: { color: '#A3A3A3' },
      },
    ]
  };

  return (
    <Layout>
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-6 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-primary text-white shadow-sm shrink-0">
                <BarChart2 className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <h1 className="font-heading text-xl sm:text-2xl font-bold text-text-main">Global Technology Macro Trends</h1>
                  <Badge variant="outline" className="font-mono text-xs">Dashboard</Badge>
                  <PremiumBadge>Enterprise Ready</PremiumBadge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-text-muted font-mono">
                  <span>Compiled by STATIQONE Research</span>
                  <span className="hidden sm:inline">•</span>
                  <span>14 Datasets</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:items-end gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" onClick={handleSaveToggle} className="h-9 flex-1 sm:flex-none">
                  <Star className={`mr-2 h-4 w-4 ${isSaved ? 'text-amber-500 fill-amber-500' : 'text-text-muted'}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsShareOpen(true)} className="h-9 flex-1 sm:flex-none">
                  <Share2 className="mr-2 h-4 w-4 text-text-muted" /> Share
                </Button>
                <Button size="sm" onClick={handleDownloadPdf} className="h-9 flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white">
                  <Lock className="mr-2 h-4 w-4" /> Export PDF
                </Button>
              </div>
              <div className="font-mono text-xs text-text-muted mt-1 text-left sm:text-right">
                Last updated: {new Date().toISOString().split('T')[0]}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:px-6 bg-background">
        {/* KPI Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {[
            {
              label: 'Tracked symbols',
              value: analytics ? analytics.summary.trackedSymbols.toLocaleString() : '—',
              change: analytics ? `${analytics.summary.sectorCount} sectors` : 'Loading',
              up: true,
            },
            {
              label: 'Market value tracked',
              value: analytics ? `$${(analytics.summary.totalMarketCap / 1e12).toFixed(2)}T` : '—',
              change: analytics ? `${analytics.summary.averageChangePercent >= 0 ? '+' : ''}${analytics.summary.averageChangePercent}% avg` : 'Loading',
              up: analytics ? analytics.summary.averageChangePercent >= 0 : true,
            },
            {
              label: 'Top gainer',
              value: analytics?.movers.topGainers[0]?.symbol || '—',
              change: analytics?.movers.topGainers[0] ? `+${Number(analytics.movers.topGainers[0].changePercent || 0).toFixed(2)}%` : 'Loading',
              up: true,
            },
            {
              label: 'Top loser',
              value: analytics?.movers.topLosers[0]?.symbol || '—',
              change: analytics?.movers.topLosers[0] ? `${Number(analytics.movers.topLosers[0].changePercent || 0).toFixed(2)}%` : 'Loading',
              up: false,
            }
          ].map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="shadow-none rounded-lg hover:border-primary/50 transition-colors cursor-default h-full">
                <CardContent className="p-3 sm:p-4">
                  <div className="text-[10px] sm:text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5 line-clamp-1">{kpi.label}</div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-text-main">{kpi.value}</div>
                  <div className={`mt-1.5 flex items-center text-xs font-medium font-mono ${kpi.up ? 'text-success' : 'text-danger'}`}>
                    {kpi.up ? <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" /> : <ArrowDownRight className="mr-0.5 h-3.5 w-3.5" />}
                    {kpi.change} YoY
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {analyticsError && (
            <div className="lg:col-span-12 border border-border bg-surface px-4 py-3 text-sm text-text-muted" role="status">
              {analyticsError}
            </div>
          )}
          
          {/* Left Column (Main Charts) */}
          <div className="lg:col-span-8 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Tracked symbols by sector</CardTitle>
                  <p className="text-xs text-text-muted mt-1">Current symbol distribution from the market data cache</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer font-mono text-[10px]" onClick={() => showToast('Source verified: Gartner Tech Survey 2024', 'info')}>Source: Gartner</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ReactECharts option={sectorChart} style={{ height: '320px' }} />
                <p className="mt-2 text-xs text-text-muted font-mono text-center">
                  Preview chart only. Premium unlocks daily data, zoom, company comparisons, raw downloads, and chart export.
                </p>
              </CardContent>
            </Card>

            <LockedPreview
              className="min-h-[230px]"
              title="Unlock Advanced Dashboard Interactions"
              value="Enable monthly, quarterly, and daily views, zoom, compare companies, export charts, and download underlying records."
            >
              <ReactECharts option={moversOption} style={{ height: '230px' }} />
            </LockedPreview>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Top gainers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={moversOption} style={{ height: '240px' }} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3 pb-0"><CardTitle className="text-sm">Most active by volume</CardTitle></CardHeader>
                <CardContent className="py-0 mt-4 relative">
                  <ReactECharts option={activityOption} style={{ height: '200px' }} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Most active symbols</CardTitle>
                <Button variant="outline" size="sm" onClick={handleExportExcel} className="h-7 text-[10px]">EXPORT EXCEL</Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-surface text-text-muted border-y border-border font-mono text-[10px] uppercase">
                      <tr>
                        <th className="px-4 py-2">Rank</th>
                        <th className="px-4 py-2">Company</th>
                        <th className="px-4 py-2 text-right">Price</th>
                        <th className="px-4 py-2 text-right">Volume</th>
                        <th className="px-4 py-2 text-right">Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(analytics?.movers.mostActive || []).map((row, index) => (
                        <tr
                          key={row.symbol}
                          onClick={() => navigate('/company')}
                          className="hover:bg-surface/80 cursor-pointer transition-colors"
                        >
                          <td className="px-4 py-2 font-mono text-text-muted">{index + 1}</td>
                          <td className="px-4 py-2 font-medium text-primary hover:underline">{row.symbol}</td>
                          <td className="px-4 py-2 text-right font-mono">{row.price}</td>
                          <td className="px-4 py-2 text-right font-mono">{(Number(row.volume || 0) / 1e6).toFixed(1)}M</td>
                          <td className={`px-4 py-2 text-right font-mono ${Number(row.changePercent || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                            {Number(row.changePercent || 0).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-text-muted">
                  <span className="font-semibold text-primary">Source:</span> cached market quotes with bounded results; detailed company views remain available from each symbol.
                </div>
              </CardContent>
            </Card>

            <VerificationPanel
              provider="STATIQONE Market Intelligence"
              source="Exchange Verified + Institutional Data"
              lastUpdated="2026-07-22"
              frequency="Real-Time Feed / Synced Hourly"
              confidence="98%"
              quality="AAA"
              citation="Global Technology Macro Trends dashboard, STATIQONE Research Team"
              dataset="14 verified dashboard source datasets"
              license="Enterprise Research License"
            />
          </div>

          {/* Right Column (Info, Insights) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-primary flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Market cache status
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                <p className="text-text-main mb-4 leading-relaxed font-sans">
                  {analytics?.marketStatus
                    ? `The dashboard is reading cached market data. The latest sync is ${analytics.marketStatus.cacheAgeSeconds} seconds old and refreshes every ${analytics.marketStatus.refreshIntervalSeconds} seconds.`
                    : 'Loading the latest cached market data.'}
                </p>
                <LockedPreview className="min-h-[120px]" title="AI Deep Financial Insights" value="Unlock full AI analysis, forecast drivers, risk factors, and cited source extracts.">
                  <p className="text-text-main leading-relaxed font-sans p-4">
                    Forecasts are intentionally not calculated in the request path. Scheduled forecasting jobs can consume this bounded dataset in a later worker process.
                  </p>
                </LockedPreview>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Report Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-border bg-background p-3">
                  <div className="text-[10px] font-mono text-text-muted mb-1">Cover Page • Executive Summary • Table of Contents</div>
                  <h4 className="text-sm font-bold text-text-main">Global Technology Macro Trends 2026</h4>
                  <p className="text-xs text-text-muted mt-1">42 pages • 18.4 MB • Updated 2026-07-22 • STATIQONE Research Team</p>
                </div>
                <LockedPreview className="min-h-[150px]" title="Export Professional Research Documents" value="Unlock all report pages, methodology appendix, PDF export, and analyst-authored investment brief.">
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-text-muted/30" />
                    <div className="h-3 w-full rounded bg-text-muted/30" />
                    <div className="h-3 w-5/6 rounded bg-text-muted/30" />
                    <div className="h-24 rounded border border-border bg-surface" />
                  </div>
                </LockedPreview>
              </CardContent>
            </Card>

            <UpgradeCard
              title="Build Custom Dashboards"
              description="Premium dashboards add full historical ranges, scheduled reports, raw-data downloads, and collaboration features."
              features={[
                'Daily, monthly, quarterly, and annual views',
                'Compare unlimited companies and industries',
                'PDF, Excel, Power BI, Tableau, API, and raw data exports'
              ]}
            />

            <DownloadFormatsPreview />

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Included Datasets</CardTitle>
                <Hash className="h-4 w-4 text-text-muted" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'Global Tech Spending Forecast 2024-2028',
                    'Enterprise AI Adoption Survey 2024',
                    'Venture Capital Tech Funding by Region',
                    'Consumer Tech Sentiment Index',
                    'Top 100 Tech Companies R&D Spend'
                  ].map((dataset, i) => (
                    <div
                      key={i}
                      onClick={() => navigate('/dataset')}
                      className="flex items-center gap-2 group cursor-pointer hover:bg-surface p-1 rounded transition-colors"
                    >
                      <BarChart2 className="h-4 w-4 text-text-muted group-hover:text-primary shrink-0" />
                      <span className="text-xs font-medium text-text-main group-hover:text-primary transition-colors line-clamp-1">{dataset}</span>
                    </div>
                  ))}
                </div>
                <Button variant="link" onClick={() => navigate('/search')} className="w-full mt-4 h-auto p-0 text-xs text-primary">Browse all 14 datasets</Button>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Related Reports</CardTitle>
                <FileText className="h-4 w-4 text-text-muted" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: 'Oct 2024', title: 'The State of Generative AI in the Enterprise' },
                    { date: 'Sep 2024', title: 'Global Semiconductor Supply Chain Analysis' },
                    { date: 'Aug 2024', title: 'Cloud Infrastructure Market Share Report' },
                  ].map((report, i) => (
                    <div
                      key={i}
                      onClick={() => navigate('/dataset')}
                      className="group cursor-pointer border border-border rounded-md p-3 hover:border-primary transition-all bg-surface"
                    >
                      <div className="font-mono text-[10px] text-text-muted mb-1">{report.date}</div>
                      <h4 className="text-xs font-medium leading-tight group-hover:text-primary transition-colors">{report.title}</h4>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Share Macro Trends Dashboard"
      />
    </Layout>
  );
}
