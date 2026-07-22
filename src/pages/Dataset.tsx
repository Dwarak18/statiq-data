import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShareModal } from '@/components/ui/Modal';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { ExportDropdown } from '@/components/ui/ExportDropdown';
import { AiExplainerModal } from '@/components/ui/AiExplainerModal';
import { DatasetPreviewMeta, DownloadFormatsPreview, LockedPreview, PremiumBadge, UpgradeCard, VerificationPanel } from '@/components/ui/PremiumExperience';
import { useToast } from '@/context/ToastContext';
import { VERIFIED_SOURCES, DEFAULT_QUALITY_SCORE } from '@/services/liveConnectors';
import { Download, Share2, Bookmark, Info, Table as TableIcon, FileText, ChevronRight, BarChart2, Sparkles, Check, ShieldCheck } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const TABLE_COLUMNS = ['Region', '2020', '2021', '2022', '2023', '2024', '2025*'];
const TABLE_ROWS = [
  ['North America', '$45.0B', '$52.0B', '$68.0B', '$85.0B', '$105.0B', '$130.0B*'],
  ['Europe', '$30.0B', '$35.0B', '$45.0B', '$55.0B', '$70.0B', '$85.0B*'],
  ['Asia-Pacific', '$25.0B', '$32.0B', '$48.0B', '$70.0B', '$95.0B', '$125.0B*'],
  ['Rest of World', '$10.0B', '$12.0B', '$15.0B', '$20.0B', '$25.0B', '$32.0B*'],
  ['Enterprise Software', '$18.2B', '$24.8B', '$36.5B', '$51.0B', '$72.4B', '$98.0B*']
];

const LOCKED_ROWS = [
  ['Healthcare AI', '$6.8B', '$9.7B', '$14.9B', '$23.4B', '$34.2B', '$49.6B*'],
  ['Financial Services AI', '$8.4B', '$11.5B', '$19.1B', '$31.8B', '$46.0B', '$64.5B*'],
  ['Industrial Automation', '$7.1B', '$10.3B', '$15.6B', '$24.0B', '$35.5B', '$52.1B*']
];

export function Dataset() {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const datasetTitle = "Global Artificial Intelligence (AI) Market Size by Region 2020-2025";

  const handleBookmarkToggle = () => {
    const nextBookmarked = !isBookmarked;
    setIsBookmarked(nextBookmarked);
    if (nextBookmarked) {
      showToast('Dataset added to workspace bookmarks!', 'success');
    } else {
      showToast('Dataset removed from bookmarks', 'info');
    }
  };

  const chartOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0, data: ['North America', 'Europe', 'Asia-Pacific', 'Rest of World'] },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023', '2024', '2025*'] },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}B' } },
    series: [
      { name: 'North America', type: 'bar', stack: 'total', data: [45, 52, 68, 85, 105, 130], itemStyle: { color: '#1E3A8A' } },
      { name: 'Europe', type: 'bar', stack: 'total', data: [30, 35, 45, 55, 70, 85], itemStyle: { color: '#2563EB' } },
      { name: 'Asia-Pacific', type: 'bar', stack: 'total', data: [25, 32, 48, 70, 95, 125], itemStyle: { color: '#0EA5E9' } },
      { name: 'Rest of World', type: 'bar', stack: 'total', data: [10, 12, 15, 20, 25, 32], itemStyle: { color: '#9CA3AF' } }
    ]
  };

  return (
    <Layout>
      <div className="bg-surface border-b border-border pt-8 pb-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-text-muted font-mono uppercase tracking-wider mb-4">
            <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/')}>Home</span> <ChevronRight className="h-3 w-3" />
            <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/industry')}>Technology</span> <ChevronRight className="h-3 w-3" />
            <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/search?q=Artificial Intelligence')}>Artificial Intelligence</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">Statistic</Badge>
                <PremiumBadge>Premium Dataset</PremiumBadge>
                <PremiumBadge>Institutional Grade</PremiumBadge>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono">
                  <ShieldCheck className="h-3 w-3 mr-1" /> Verified Source (Score 99/100)
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-heading text-text-main leading-tight mb-4">
                {datasetTitle}
              </h1>
              <p className="text-lg text-text-muted leading-relaxed">
                Market size of artificial intelligence (AI) globally from 2020 to 2024, with a forecast for 2025, broken down by major geographic regions (in billion U.S. dollars).
              </p>
            </div>
            
            <div className="flex flex-col gap-2 shrink-0">
              <ExportDropdown
                title={datasetTitle}
                source="Global Intelligence Insights & SEC Filings"
                lastUpdated="2026-07-22"
                columns={TABLE_COLUMNS}
                rows={TABLE_ROWS}
              />
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={handleBookmarkToggle}
                  className={`flex-1 bg-surface shadow-sm ${isBookmarked ? 'text-amber-500 border-amber-500' : ''}`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsShareOpen(true)}
                  className="flex-1 bg-surface shadow-sm"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAiModalOpen(true)}
                  className="flex-1 bg-surface shadow-sm text-primary"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <DatasetPreviewMeta
              visibleScope="First 5 rows, latest 2 years"
              totalRows="248,000 historical records"
              totalColumns={`${TABLE_COLUMNS.length} visible / 42 premium`}
              source="OECD, SEC, exchange feeds"
              frequency="Synced hourly"
              formats="PDF, Excel, CSV, JSON, XML, API"
            />

            <Card className="shadow-sm border-border overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
                <div className="flex gap-1 bg-surface p-1 rounded-md border border-border">
                  <Button
                    variant={viewMode === 'chart' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('chart')}
                    className="h-8 text-xs font-medium"
                  >
                    <BarChart2 className="mr-1.5 h-3.5 w-3.5" /> Chart
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="h-8 text-xs font-medium"
                  >
                    <TableIcon className="mr-1.5 h-3.5 w-3.5" /> Table
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAiModalOpen(true)}
                  className="h-8 text-xs text-primary font-medium"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" /> AI Analysis
                </Button>
              </div>
              <CardContent className="p-6">
                {viewMode === 'chart' ? (
                  <div>
                    <ReactECharts option={chartOption} style={{ height: '400px', width: '100%' }} />
                    <div className="mt-4 text-xs text-text-muted font-mono text-center">
                      Preview chart: latest 2 years and summary trend visible. Premium unlocks 25-year history, zoom, quarterly/monthly views, company comparisons, exports, and raw data.
                    </div>
                    <LockedPreview
                      className="mt-4 min-h-[190px]"
                      title="Unlock 25 Years of Financial History"
                      value="Access complete historical chart points, advanced interactions, forecasting overlays, and raw source observations."
                    >
                      <ReactECharts
                        option={{
                          ...chartOption,
                          xAxis: { type: 'category', data: ['2000', '2005', '2010', '2015', '2020', '2025*'] },
                          series: chartOption.series.map((series) => ({
                            ...series,
                            data: [8, 18, 42, 76, 120, 180]
                          }))
                        }}
                        style={{ height: '190px', width: '100%' }}
                      />
                    </LockedPreview>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-surface text-text-muted border-b border-border font-mono text-xs uppercase">
                        <tr>
                          {TABLE_COLUMNS.map((col, idx) => (
                            <th key={idx} className={`p-3 ${idx > 0 ? 'text-right' : ''}`}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border font-mono text-xs">
                        {TABLE_ROWS.map((row, i) => (
                          <tr key={i} className="hover:bg-surface/50">
                            <td className="p-3 font-sans font-semibold text-text-main">{row[0]}</td>
                            <td className="p-3 text-right text-text-muted">{row[1]}</td>
                            <td className="p-3 text-right text-text-muted">{row[2]}</td>
                            <td className="p-3 text-right text-text-muted">{row[3]}</td>
                            <td className="p-3 text-right text-text-muted">{row[4]}</td>
                            <td className="p-3 text-right font-bold text-primary">{row[5]}</td>
                            <td className="p-3 text-right font-bold text-accent">{row[6]}</td>
                          </tr>
                        ))}
                        {LOCKED_ROWS.map((row, i) => (
                          <tr key={`locked-${i}`} className="relative">
                            {row.map((cell, idx) => (
                              <td key={idx} className={`p-3 ${idx > 0 ? 'text-right' : 'font-sans font-semibold'} blur-[2px] opacity-50`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-text-muted">
                      <span className="font-semibold text-primary">Unlock Complete Dataset:</span> remaining rows, historical comparisons, advanced ratios, valuation models, bulk downloads, and machine-readable API access.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="font-heading font-bold text-base text-text-main">Dataset Methodology & Coverage</h3>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    Representative sample combines audited company filings, verified government datasets, and exchange-validated market feeds. Premium users can inspect methodology notes, source joins, revision history, and complete column definitions.
                  </p>
                </div>
                <DownloadFormatsPreview />
              </CardContent>
            </Card>

            <SourceBadge
              title={datasetTitle}
              source={VERIFIED_SOURCES.OECD}
              qualityScore={DEFAULT_QUALITY_SCORE}
              lastUpdated="2026-07-22"
            />

            <VerificationPanel
              provider="STATIQDATA Research Cloud"
              source="Verified Official Source"
              lastUpdated="2026-07-22"
              frequency="Synced Hourly"
              confidence="99%"
              quality="AAA"
              citation="OECD AI market indicators, retrieved 2026-07-22"
              dataset="Global AI Market Size by Region"
              license="Institutional Research License"
            />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-heading font-bold text-base text-primary mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 mr-2" /> Ask STATIQDATA AI
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  North America leads global AI spending with $130B projected for 2025, while Asia-Pacific exhibits the highest growth velocity (CAGR 37.8%).
                </p>
                <Button onClick={() => setIsAiModalOpen(true)} className="w-full bg-primary text-white text-xs">
                  Generate Custom AI Report
                </Button>
              </CardContent>
            </Card>

            <UpgradeCard
              title="Unlock Complete Dataset"
              description="Move from representative preview data to institutional-grade research coverage without interrupting exploration."
              features={[
                'All rows, 42 premium columns, and 25-year history',
                'CSV, Excel, PDF, JSON, XML, Tableau, Power BI, and API exports',
                'SEC filing analysis, methodology, citations, and revision history'
              ]}
            />
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Share AI Market Dataset"
      />

      <AiExplainerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        datasetTitle={datasetTitle}
      />
    </Layout>
  );
}
