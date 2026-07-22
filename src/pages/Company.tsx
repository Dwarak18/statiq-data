import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { ExportDropdown } from '@/components/ui/ExportDropdown';
import { AiExplainerModal } from '@/components/ui/AiExplainerModal';
import { DatasetPreviewMeta, DownloadFormatsPreview, LockedPreview, PremiumBadge, UpgradeCard, VerificationPanel } from '@/components/ui/PremiumExperience';
import { useToast } from '@/context/ToastContext';
import { OFFICIAL_COMPANIES, getCompanyByTickerOrName } from '@/services/dataService';
import { Building2, Globe, Users, TrendingUp, BarChart2, FileText, Download, Hash, ShieldCheck, Sparkles, Award } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export function Company() {
  const [selectedCompanyKey, setSelectedCompanyKey] = useState<string>('Apple Inc.');
  const [activeTab, setActiveTab] = useState<'Overview' | 'Financials' | 'Segments' | 'Business & ESG' | 'Competitors'>('Overview');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const currentCompany = getCompanyByTickerOrName(selectedCompanyKey);

  const previewFinancialHistory = currentCompany.financialHistory.slice(0, 2);
  const lockedFinancialHistory = currentCompany.financialHistory.slice(2);

  const revenueChart = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: previewFinancialHistory.map(f => f.fiscalYear).reverse() },
    yAxis: { type: 'value', axisLabel: { formatter: '${value}B' } },
    series: [
      { name: 'Revenue', type: 'line', smooth: true, data: previewFinancialHistory.map(f => f.revenue).reverse(), itemStyle: { color: '#1E3A8A' }, areaStyle: { color: 'rgba(30,58,138,0.1)' } },
      { name: 'Net Income', type: 'line', smooth: true, data: previewFinancialHistory.map(f => f.netIncome).reverse(), itemStyle: { color: '#0EA5E9' } }
    ]
  };

  const fullRevenueChart = {
    ...revenueChart,
    xAxis: { type: 'category', data: currentCompany.financialHistory.map(f => f.fiscalYear).reverse() },
    series: [
      { name: 'Revenue', type: 'line', smooth: true, data: currentCompany.financialHistory.map(f => f.revenue).reverse(), itemStyle: { color: '#1E3A8A' }, areaStyle: { color: 'rgba(30,58,138,0.1)' } },
      { name: 'Net Income', type: 'line', smooth: true, data: currentCompany.financialHistory.map(f => f.netIncome).reverse(), itemStyle: { color: '#0EA5E9' } }
    ]
  };

  const segmentChart = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { fontSize: 10 } },
    series: [
      {
        name: 'Revenue by Segment',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        data: currentCompany.segmentRevenue.map(s => ({ value: s.revenue, name: `${s.segment} ($${s.revenue}B)` }))
      }
    ]
  };

  const exportColumns = ['Fiscal Year', 'Revenue ($B)', 'Gross Profit ($B)', 'Operating Income ($B)', 'Net Income ($B)', 'EBITDA ($B)', 'Operating Margin (%)', 'Free Cash Flow ($B)', 'EPS ($)'];
  const exportRows = currentCompany.financialHistory.map(f => [
    f.fiscalYear,
    f.revenue,
    f.grossProfit,
    f.operatingIncome,
    f.netIncome,
    f.ebitda,
    `${f.operatingMargin}%`,
    f.freeCashFlow,
    `$${f.eps}`
  ]);

  return (
    <Layout>
      {/* Company Header */}
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20 flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-2xl font-bold font-mono text-primary">{currentCompany.ticker}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-3xl font-bold font-heading text-text-main">{currentCompany.name}</h1>
                  <Badge variant="outline" className="font-mono">{currentCompany.exchange}: {currentCompany.ticker}</Badge>
                  <PremiumBadge>Premium Analysis</PremiumBadge>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Verified Official SEC Filing
                  </Badge>
                </div>
                <p className="text-text-muted max-w-3xl mb-4 leading-relaxed text-sm">
                  {currentCompany.description}
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted font-mono">
                  <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> {currentCompany.headquarters}</span>
                  <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {currentCompany.employees.toLocaleString()} Employees</span>
                  <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> Founded: {currentCompany.founded}</span>
                  <span className="flex items-center gap-1.5 text-primary"><Award className="h-3.5 w-3.5" /> CEO: {currentCompany.ceo}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <ExportDropdown
                title={`${currentCompany.name} Financial Statements`}
                source={currentCompany.source.name}
                lastUpdated={currentCompany.lastUpdated}
                columns={exportColumns}
                rows={exportRows}
              />
              <Button onClick={() => setIsAiModalOpen(true)} variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
                <Sparkles className="h-4 w-4 mr-1.5" /> AI Analyst Insights
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border bg-surface sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {(['Overview', 'Financials', 'Segments', 'Business & ESG', 'Competitors'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab ? 'border-primary text-primary font-bold' : 'border-transparent text-text-muted hover:text-text-main hover:border-border'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {activeTab === 'Overview' && (
              <>
                <DatasetPreviewMeta
                  visibleScope="Latest 2 fiscal years"
                  totalRows={`${currentCompany.financialHistory.length * 4}+ quarterly filings`}
                  totalColumns="9 visible / 36 premium ratios"
                  source="SEC EDGAR audited filings"
                  frequency="Quarterly"
                  formats="PDF, Excel, CSV, JSON, API"
                />
                <section>
                  <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" /> Key Verified Figures (FY2024 SEC 10-K)
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Market Cap', value: `$${currentCompany.marketCap}B` },
                      { label: 'Annual Revenue', value: `$${currentCompany.financialHistory[0].revenue}B` },
                      { label: 'Net Income', value: `$${currentCompany.financialHistory[0].netIncome}B` },
                      { label: 'P/E Ratio', value: currentCompany.peRatio },
                      { label: 'Operating Margin', value: `${currentCompany.financialHistory[0].operatingMargin}%` },
                      { label: 'Free Cash Flow', value: `$${currentCompany.financialHistory[0].freeCashFlow}B` },
                      { label: 'ROE', value: `${currentCompany.roe}%` },
                      { label: 'Active Users (MAU)', value: currentCompany.mau }
                    ].map((stat, i) => (
                      <div key={i} className="p-4 rounded-xl bg-surface border border-border">
                        <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-mono">{stat.label}</div>
                        <div className="font-mono text-lg font-bold text-text-main">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">Revenue & Net Income Trajectory (SEC EDGAR Filings)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ReactECharts option={revenueChart} style={{ height: '280px' }} />
                      <p className="mt-2 text-xs text-text-muted font-mono text-center">
                        Guest preview shows latest 2 years only. Premium unlocks full annual, quarterly, monthly, and filing-level history.
                      </p>
                    </CardContent>
                  </Card>
                  <LockedPreview
                    className="mt-4 min-h-[220px]"
                    title="Unlock Historical Company Comparison"
                    value="Compare unlimited companies across 25 years of audited statements, ratios, SEC filings, valuation models, and forecast scenarios."
                  >
                    <ReactECharts option={fullRevenueChart} style={{ height: '220px' }} />
                  </LockedPreview>
                </section>

                <SourceBadge
                  title={`${currentCompany.name} Audited SEC 10-K Filing Data`}
                  source={currentCompany.source}
                  qualityScore={currentCompany.qualityScore}
                  lastUpdated={currentCompany.lastUpdated}
                />

                <VerificationPanel
                  provider={currentCompany.source.name}
                  source={currentCompany.source.verificationStatus}
                  lastUpdated={currentCompany.lastUpdated}
                  frequency="Quarterly"
                  confidence={`${currentCompany.qualityScore.accuracy}%`}
                  quality={currentCompany.qualityScore.grade}
                  citation={`${currentCompany.name} audited SEC filing dataset`}
                  dataset={`${currentCompany.ticker} company profile and financial statements`}
                  license="SEC Public Filing Research License"
                />
              </>
            )}

            {activeTab === 'Financials' && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold font-heading">Audited Income Statement & Cash Flow (SEC EDGAR)</h2>
                <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                  <table className="w-full text-xs text-left border-collapse font-mono">
                    <thead className="bg-background text-text-muted border-b border-border uppercase">
                      <tr>
                        <th className="p-3">Fiscal Period</th>
                        <th className="p-3 text-right">Revenue ($B)</th>
                        <th className="p-3 text-right">Gross Profit ($B)</th>
                        <th className="p-3 text-right">Operating Income ($B)</th>
                        <th className="p-3 text-right">Net Income ($B)</th>
                        <th className="p-3 text-right">Free Cash Flow ($B)</th>
                        <th className="p-3 text-right">EPS ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {previewFinancialHistory.map((fin, idx) => (
                        <tr key={idx} className="hover:bg-background/60">
                          <td className="p-3 font-bold font-sans text-text-main">{fin.fiscalYear} ({fin.period})</td>
                          <td className="p-3 text-right font-bold text-primary">${fin.revenue}B</td>
                          <td className="p-3 text-right">${fin.grossProfit}B</td>
                          <td className="p-3 text-right">${fin.operatingIncome}B</td>
                          <td className="p-3 text-right font-bold text-emerald-500">${fin.netIncome}B</td>
                          <td className="p-3 text-right">${fin.freeCashFlow}B</td>
                          <td className="p-3 text-right font-bold">${fin.eps}</td>
                        </tr>
                      ))}
                      {lockedFinancialHistory.map((fin, idx) => (
                        <tr key={`locked-${idx}`} className="hover:bg-background/60">
                          <td className="p-3 font-bold font-sans text-text-main blur-[2px] opacity-50">{fin.fiscalYear} ({fin.period})</td>
                          <td className="p-3 text-right font-bold text-primary blur-[2px] opacity-50">${fin.revenue}B</td>
                          <td className="p-3 text-right blur-[2px] opacity-50">${fin.grossProfit}B</td>
                          <td className="p-3 text-right blur-[2px] opacity-50">${fin.operatingIncome}B</td>
                          <td className="p-3 text-right font-bold text-emerald-500 blur-[2px] opacity-50">${fin.netIncome}B</td>
                          <td className="p-3 text-right blur-[2px] opacity-50">${fin.freeCashFlow}B</td>
                          <td className="p-3 text-right font-bold blur-[2px] opacity-50">${fin.eps}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <UpgradeCard
                  title="Unlock Complete Financial Statements"
                  description="Access audited annual and quarterly statements, advanced financial ratios, SEC filing analysis, and valuation models."
                  features={[
                    '25 years of income statement, balance sheet, and cash flow history',
                    'Advanced ratios, forecasting, and competitor benchmarking',
                    'PDF dossier plus CSV, Excel, JSON, and API exports'
                  ]}
                />
                <DownloadFormatsPreview />

                <SourceBadge
                  title={`${currentCompany.name} SEC Financial Statements`}
                  source={currentCompany.source}
                  qualityScore={currentCompany.qualityScore}
                  lastUpdated={currentCompany.lastUpdated}
                />
              </section>
            )}

            {activeTab === 'Segments' && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold font-heading">Revenue Breakdown by Product Segment</h2>
                <Card>
                  <CardContent className="p-6">
                    <ReactECharts option={segmentChart} style={{ height: '320px' }} />
                  </CardContent>
                </Card>
              </section>
            )}

            {activeTab === 'Business & ESG' && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold font-heading">Operational & ESG Performance Indicators</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface border border-border">
                    <div className="text-xs text-text-muted font-mono uppercase mb-1">Patent Portfolio</div>
                    <div className="text-2xl font-bold font-mono text-primary">{currentCompany.patentCount.toLocaleString()} Patents</div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface border border-border">
                    <div className="text-xs text-text-muted font-mono uppercase mb-1">ESG Rating</div>
                    <div className="text-2xl font-bold font-mono text-emerald-500">{currentCompany.esgRating}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface border border-border">
                    <div className="text-xs text-text-muted font-mono uppercase mb-1">Sustainability Score</div>
                    <div className="text-2xl font-bold font-mono text-accent">{currentCompany.sustainabilityScore}/100</div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface border border-border">
                    <div className="text-xs text-text-muted font-mono uppercase mb-1">Carbon Footprint</div>
                    <div className="text-2xl font-bold font-mono text-text-main">{currentCompany.carbonEmissions}</div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'Competitors' && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-heading mb-4">Direct Industry Competitors</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {currentCompany.competitors.map((compName) => (
                    <Card
                      key={compName}
                      onClick={() => { setSelectedCompanyKey(compName); setActiveTab('Overview'); showToast(`Switched profile to ${compName}`, 'info'); }}
                      className="cursor-pointer border border-border hover:border-primary transition-all bg-surface"
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-text-main">{compName}</h4>
                          <p className="text-xs text-text-muted">Direct Competitor</p>
                        </div>
                        <Button size="sm" variant="ghost">Load Profile &rarr;</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-primary border-transparent text-white shadow-md">
              <CardContent className="p-6">
                <h3 className="font-heading font-bold text-lg mb-2">Verified SEC Dossier</h3>
                <p className="text-white/80 text-xs mb-6">
                  Audited 10-K report covering key metrics, financial statements, and SEC filings for {currentCompany.name}.
                </p>
                <ExportDropdown
                  title={`${currentCompany.name} Dossier`}
                  source={currentCompany.source.name}
                  lastUpdated={currentCompany.lastUpdated}
                  columns={exportColumns}
                  rows={exportRows}
                  className="w-full"
                />
              </CardContent>
            </Card>

            <UpgradeCard
              title="AI Deep Financial Insights"
              description="Generate investment-grade company reports with SEC filing context, risk factors, segment analysis, and source citations."
              features={[
                'Full report with blurred premium pages unlocked',
                'Quarterly SEC filing analysis and original citations',
                'Scheduled reports, dashboards, and workspace collaboration'
              ]}
            />

            <div>
              <h3 className="font-heading font-bold text-lg mb-4">Select Enterprise Profile</h3>
              <div className="space-y-2">
                {Object.keys(OFFICIAL_COMPANIES).map((compKey) => (
                  <button
                    key={compKey}
                    onClick={() => { setSelectedCompanyKey(compKey); setActiveTab('Overview'); showToast(`Loaded ${compKey}`, 'info'); }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      compKey === currentCompany.name ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-border bg-surface hover:border-primary/50 text-text-main'
                    }`}
                  >
                    <span>{compKey}</span>
                    <span className="font-mono text-text-muted">{OFFICIAL_COMPANIES[compKey].ticker}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <AiExplainerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        datasetTitle={`${currentCompany.name} Financial & Operational Performance`}
      />
    </Layout>
  );
}
