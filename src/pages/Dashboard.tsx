import React, { useState } from 'react';
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

export function Dashboard() {
  const [isSaved, setIsSaved] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

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

  // Global tech adoption chart
  const adoptionChart = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023', '2024', '2025(E)'], boundaryGap: false },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: 'Enterprise AI',
        type: 'line',
        data: [15, 22, 34, 52, 71, 85],
        smooth: true,
        itemStyle: { color: '#0EA5E9' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(14, 165, 233, 0.4)' }, { offset: 1, color: 'rgba(14, 165, 233, 0.0)' }]
          }
        }
      },
      {
        name: 'Cloud Computing',
        type: 'line',
        data: [65, 72, 81, 89, 94, 96],
        smooth: true,
        itemStyle: { color: '#1E3A8A' },
        lineStyle: { width: 3, type: 'dashed' }
      }
    ]
  };

  const investmentOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['North America', 'Asia Pacific', 'Europe'], bottom: 0, textStyle: { fontSize: 10 } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: ['2021', '2022', '2023', '2024', '2025'] },
    yAxis: { type: 'value', axisLabel: { formatter: '${value}B' } },
    series: [
      { name: 'North America', type: 'bar', stack: 'total', data: [85, 92, 105, 125, 145], itemStyle: { color: '#1E3A8A' } },
      { name: 'Asia Pacific', type: 'bar', stack: 'total', data: [45, 55, 68, 85, 110], itemStyle: { color: '#0EA5E9' } },
      { name: 'Europe', type: 'bar', stack: 'total', data: [35, 42, 50, 60, 75], itemStyle: { color: '#10B981' } }
    ]
  };

  const sentimentOption = {
    tooltip: { trigger: 'item' },
    legend: { show: false },
    series: [
      {
        name: 'Consumer Sentiment',
        type: 'pie',
        radius: ['45%', '75%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, position: 'inside', formatter: '{c}%', fontSize: 10, color: '#fff' },
        data: [
          { value: 55, name: 'Positive', itemStyle: { color: '#10B981' } },
          { value: 25, name: 'Neutral', itemStyle: { color: '#9CA3AF' } },
          { value: 20, name: 'Negative', itemStyle: { color: '#EF4444' } }
        ]
      }
    ]
  };

  return (
    <Layout>
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-6 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <BarChart2 className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-heading text-2xl font-bold text-text-main">Global Technology Macro Trends</h1>
                  <Badge variant="outline" className="font-mono">Dashboard</Badge>
                  <PremiumBadge>Enterprise Ready</PremiumBadge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted">
                  <span className="flex items-center gap-1">Compiled by STATIQDATA Research Team</span>
                  <span>|</span>
                  <span className="flex items-center gap-1 font-mono">14 Datasets</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveToggle} className="h-8">
                  <Star className={`mr-2 h-4 w-4 ${isSaved ? 'text-amber-500 fill-amber-500' : 'text-text-muted'}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsShareOpen(true)} className="h-8">
                  <Share2 className="mr-2 h-4 w-4 text-text-muted" /> Share
                </Button>
                <Button size="sm" onClick={handleDownloadPdf} className="h-8 bg-primary hover:bg-primary/90 text-white">
                  <Lock className="mr-2 h-4 w-4" /> Export PDF
                </Button>
              </div>
              <div className="font-mono text-xs text-text-muted mt-2">
                Last updated: {new Date().toISOString().split('T')[0]}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:px-6 bg-background">
        {/* KPI Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-4">
          {[
            { label: 'Global IT Spending 2025', value: '$5.2T', change: '+8.0%', up: true },
            { label: 'AI Market Size 2025', value: '$420B', change: '+37.3%', up: true },
            { label: 'Cloud Infrastructure', value: '$180B', change: '+18.5%', up: true },
            { label: 'Hardware Sales', value: '$950B', change: '-1.2%', up: false }
          ].map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="shadow-none rounded-lg hover:border-primary/50 transition-colors cursor-default h-full">
                <CardContent className="p-4">
                  <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2 line-clamp-1">{kpi.label}</div>
                  <div className="font-mono text-2xl font-bold text-text-main">{kpi.value}</div>
                  <div className={`mt-2 flex items-center text-xs font-medium font-mono ${kpi.up ? 'text-success' : 'text-danger'}`}>
                    {kpi.up ? <ArrowUpRight className="mr-0.5 h-4 w-4" /> : <ArrowDownRight className="mr-0.5 h-4 w-4" />}
                    {kpi.change} YoY Forecast
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          
          {/* Left Column (Main Charts) */}
          <div className="lg:col-span-8 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Enterprise Tech Adoption Rates</CardTitle>
                  <p className="text-xs text-text-muted mt-1">% of global enterprises utilizing technology in production</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer font-mono text-[10px]" onClick={() => showToast('Source verified: Gartner Tech Survey 2024', 'info')}>Source: Gartner</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ReactECharts option={adoptionChart} style={{ height: '320px' }} />
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
              <ReactECharts option={investmentOption} style={{ height: '230px' }} />
            </LockedPreview>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Venture Capital Investment by Region</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReactECharts option={investmentOption} style={{ height: '240px' }} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3 pb-0"><CardTitle className="text-sm">Global Consumer Sentiment</CardTitle></CardHeader>
                <CardContent className="py-0 mt-4 relative">
                  <ReactECharts option={sentimentOption} style={{ height: '200px' }} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Top Tech Companies by R&D Expenditure (2024)</CardTitle>
                <Button variant="outline" size="sm" onClick={handleExportExcel} className="h-7 text-[10px]">EXPORT EXCEL</Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-surface text-text-muted border-y border-border font-mono text-[10px] uppercase">
                      <tr>
                        <th className="px-4 py-2">Rank</th>
                        <th className="px-4 py-2">Company</th>
                        <th className="px-4 py-2 text-right">R&D Spend (USD)</th>
                        <th className="px-4 py-2 text-right">% of Revenue</th>
                        <th className="px-4 py-2 text-right">YoY Growth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { rank: 1, name: 'Amazon', spend: '$85.2B', revPct: '14.8%', growth: '+16.2%' },
                        { rank: 2, name: 'Alphabet', spend: '$45.4B', revPct: '15.2%', growth: '+14.5%' },
                        { rank: 3, name: 'Meta Platforms', spend: '$38.5B', revPct: '28.5%', growth: '+8.7%' },
                        { rank: 4, name: 'Apple', spend: '$29.9B', revPct: '7.6%', growth: '+13.8%' },
                        { rank: 5, name: 'Microsoft', spend: '$27.2B', revPct: '12.8%', growth: '+11.2%' },
                      ].map((row) => (
                        <tr
                          key={row.rank}
                          onClick={() => navigate('/company')}
                          className="hover:bg-surface/80 cursor-pointer transition-colors"
                        >
                          <td className="px-4 py-2 font-mono text-text-muted">{row.rank}</td>
                          <td className="px-4 py-2 font-medium text-primary hover:underline">{row.name}</td>
                          <td className="px-4 py-2 text-right font-mono">{row.spend}</td>
                          <td className="px-4 py-2 text-right font-mono">{row.revPct}</td>
                          <td className="px-4 py-2 text-right font-mono text-success">{row.growth}</td>
                        </tr>
                      ))}
                      {[
                        { rank: 6, name: 'NVIDIA', spend: '$12.9B', revPct: '18.1%', growth: '+31.0%' },
                        { rank: 7, name: 'Samsung', spend: '$22.6B', revPct: '9.9%', growth: '+7.5%' }
                      ].map((row) => (
                        <tr key={row.rank} className="hover:bg-surface/80 transition-colors">
                          <td className="px-4 py-2 font-mono text-text-muted blur-[2px] opacity-50">{row.rank}</td>
                          <td className="px-4 py-2 font-medium text-primary blur-[2px] opacity-50">{row.name}</td>
                          <td className="px-4 py-2 text-right font-mono blur-[2px] opacity-50">{row.spend}</td>
                          <td className="px-4 py-2 text-right font-mono blur-[2px] opacity-50">{row.revPct}</td>
                          <td className="px-4 py-2 text-right font-mono text-success blur-[2px] opacity-50">{row.growth}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-text-muted">
                  <span className="font-semibold text-primary">Premium unlocks:</span> top 500 companies, competitor benchmarking, valuation models, bulk downloads, and scheduled dashboard exports.
                </div>
              </CardContent>
            </Card>

            <VerificationPanel
              provider="STATIQDATA Market Intelligence"
              source="Exchange Verified + Institutional Data"
              lastUpdated="2026-07-22"
              frequency="Real-Time Feed / Synced Hourly"
              confidence="98%"
              quality="AAA"
              citation="Global Technology Macro Trends dashboard, STATIQDATA Research Team"
              dataset="14 verified dashboard source datasets"
              license="Enterprise Research License"
            />
          </div>

          {/* Right Column (Info, Insights) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-primary flex items-center gap-2">
                  <Activity className="h-4 w-4" /> AI Analyst Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                <p className="text-text-main mb-4 leading-relaxed font-sans">
                  The technology sector is exhibiting strong capital concentration in AI infrastructure. While software revenue growth remains stable, capital expenditure (CapEx) for cloud providers is forecast to grow by 28% in 2025, diverging from historical norms.
                </p>
                <LockedPreview className="min-h-[120px]" title="AI Deep Financial Insights" value="Unlock full AI analysis, forecast drivers, risk factors, and cited source extracts.">
                  <p className="text-text-main leading-relaxed font-sans p-4">
                    Consumer sentiment, CAPEX sensitivity, public-company exposure, and regional scenario analysis with confidence intervals.
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
                  <p className="text-xs text-text-muted mt-1">42 pages • 18.4 MB • Updated 2026-07-22 • STATIQDATA Research Team</p>
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
