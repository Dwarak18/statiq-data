import React, { useState } from 'react';
import { motion } from 'motion/react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PremiumBadge, VerificationPanel, UpgradeCard } from '@/components/ui/PremiumExperience';
import { ExportDropdown } from '@/components/ui/ExportDropdown';
import { ResearchGlyph } from '@/components/ui/ResearchGlyph';
import { useToast } from '@/context/ToastContext';
import {
  OVERALL_MARKET_SUMMARY,
  SECTOR_TYPES_JUNE_2026,
  SEGMENT_BREAKDOWN_JUNE_2026,
  TOP_INSURERS_JUNE_2026,
  FINANCIAL_RATIO_HIGHLIGHTS,
  INDUSTRY_INFRASTRUCTURE,
  InsurerPerformance
} from '@/data/indiaInsuranceData';
import {
  TrendingUp,
  ShieldCheck,
  Building2,
  Award,
  Users,
  PieChart as PieChartIcon,
  BarChart3,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

export function IndiaInsuranceDashboard() {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'segments' | 'insurers' | 'financials' | 'infrastructure'>('segments');
  const { showToast } = useToast();

  // Filter insurers
  const filteredInsurers = TOP_INSURERS_JUNE_2026.filter((ins) => {
    const matchesType = selectedType === 'All' || ins.type === selectedType;
    const matchesSearch =
      ins.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.shortName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // ECharts Option 1: Segment Breakdown (Pie Chart)
  const segmentPieOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: <b>₹{c} Cr</b> ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '2%',
      top: 'center',
      textStyle: { color: '#A3A3A3', fontSize: 11 }
    },
    series: [
      {
        name: 'Market Segment',
        type: 'pie',
        radius: ['42%', '70%'],
        center: ['38%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#171717',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold',
            color: '#F5F5F5'
          }
        },
        data: SEGMENT_BREAKDOWN_JUNE_2026.map((s) => ({
          name: s.segment,
          value: s.premiumJune2026
        }))
      }
    ]
  };

  // ECharts Option 2: Sector Market Share (Bar + YoY Growth)
  const sectorBarOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '12%', containLabel: true },
    xAxis: {
      type: 'category',
      data: SECTOR_TYPES_JUNE_2026.map((s) => s.sector.replace(' Insurers', '')),
      axisLabel: { color: '#A3A3A3', fontSize: 10, rotate: 10 }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Premium (₹ Cr)',
        axisLabel: { color: '#A3A3A3', formatter: '₹{value}' },
        splitLine: { lineStyle: { color: '#2A2A2A' } }
      },
      {
        type: 'value',
        name: 'YoY Growth (%)',
        axisLabel: { color: '#C8A45D', formatter: '{value}%' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'Premium (₹ Cr)',
        type: 'bar',
        barWidth: '35%',
        data: SECTOR_TYPES_JUNE_2026.map((s) => s.premiumJune2026),
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: '#C8A45D' }, { offset: 1, color: '#8A6D30' }]
          },
          borderRadius: [4, 4, 0, 0]
        }
      },
      {
        name: 'YoY Growth (%)',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: SECTOR_TYPES_JUNE_2026.map((s) => s.growthRate),
        itemStyle: { color: '#10B981' },
        lineStyle: { width: 3 }
      }
    ]
  };

  // ECharts Option 3: Top 10 Insurers Market Share Comparison
  const topInsurersBarOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '5%', bottom: '3%', top: '5%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { color: '#A3A3A3', formatter: '₹{value}Cr' }, splitLine: { lineStyle: { color: '#2A2A2A' } } },
    yAxis: {
      type: 'category',
      inverse: true,
      data: TOP_INSURERS_JUNE_2026.slice(0, 8).map((i) => i.shortName),
      axisLabel: { color: '#F5F5F5', fontSize: 11 }
    },
    series: [
      {
        name: 'June 2026 Premium (₹ Cr)',
        type: 'bar',
        data: TOP_INSURERS_JUNE_2026.slice(0, 8).map((i) => i.premiumJune2026),
        itemStyle: {
          color: '#3B82F6',
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          color: '#F5F5F5',
          fontSize: 10,
          formatter: '₹{c} Cr'
        }
      }
    ]
  };

  // Prepare export dataset for ExportDropdown
  const exportColumns = ['Rank', 'Insurer Name', 'Type', 'June 2026 Premium (Rs Cr)', 'June 2025 Premium (Rs Cr)', 'YoY Growth %', 'Market Share %', 'Net Accretion (Rs Cr)', 'Key Strength'];
  const exportRows = TOP_INSURERS_JUNE_2026.map((ins) => [
    ins.rank,
    ins.name,
    ins.type,
    ins.premiumJune2026,
    ins.premiumJune2025,
    `${ins.growthRate}%`,
    `${ins.marketShare}%`,
    ins.accretion,
    ins.keyStrength
  ]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-2xl border border-primary/30 bg-surface p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-primary/20 text-primary border-primary/40 text-xs px-2.5 py-0.5">
                Official IRDAI & GI Council Audit
              </Badge>
              <Badge variant="outline" className="font-mono text-xs text-text-muted">
                Updated Upto June 2026 (FY 2026-27 Q1)
              </Badge>
              <PremiumBadge>Institutional Flash Report</PremiumBadge>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-bold font-heading text-text-main tracking-tight">
              Insurance Industry in India: Market Intelligence & Flash Dashboard
            </h1>
            
            <p className="text-sm text-text-muted leading-relaxed">
              Comprehensive statistical analysis of India&apos;s Non-Life & General Insurance Sector. Incorporating official IRDAI Q1 FY 2026-27 provisional flash figures, segment breakdowns across Health, Motor, Fire & Marine, insurer market share rankings, and GI Council financial ratios.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <ExportDropdown
              title="Insurance Industry in India - IRDAI June 2026 Flash Report"
              source="IRDAI Official Flash Figures & GI Council Annual Report"
              lastUpdated="2026-07-26"
              columns={exportColumns}
              rows={exportRows}
            />
          </div>
        </div>

        {/* Highlight KPI Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-border/60">
          <div className="p-3.5 rounded-xl bg-background/60 border border-border/50">
            <div className="text-[11px] text-text-muted font-mono uppercase tracking-wider mb-1">Total Premium (Q1)</div>
            <div className="text-xl font-bold font-mono text-primary">₹87,917.6 Cr</div>
            <div className="text-[10px] text-success font-mono mt-0.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +10.91% YoY Growth
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-background/60 border border-border/50">
            <div className="text-[11px] text-text-muted font-mono uppercase tracking-wider mb-1">Health Portfolio Share</div>
            <div className="text-xl font-bold font-mono text-text-main">44.14%</div>
            <div className="text-[10px] text-primary font-mono mt-0.5">₹38,804 Cr (+19.9% YoY)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-background/60 border border-border/50">
            <div className="text-[11px] text-text-muted font-mono uppercase tracking-wider mb-1">Motor Portfolio Share</div>
            <div className="text-xl font-bold font-mono text-text-main">30.06%</div>
            <div className="text-[10px] text-primary font-mono mt-0.5">₹26,426 Cr (+13.9% YoY)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-background/60 border border-border/50">
            <div className="text-[11px] text-text-muted font-mono uppercase tracking-wider mb-1">SAHI Insurer Growth</div>
            <div className="text-xl font-bold font-mono text-success">+32.89%</div>
            <div className="text-[10px] text-text-muted font-mono mt-0.5">₹12,161 Cr Total</div>
          </div>

          <div className="p-3.5 rounded-xl bg-background/60 border border-border/50">
            <div className="text-[11px] text-text-muted font-mono uppercase tracking-wider mb-1">Avg Solvency Ratio</div>
            <div className="text-xl font-bold font-mono text-primary">2.10x</div>
            <div className="text-[10px] text-text-muted font-mono mt-0.5">IRDAI Min: 1.50x</div>
          </div>

          <div className="p-3.5 rounded-xl bg-background/60 border border-border/50">
            <div className="text-[11px] text-text-muted font-mono uppercase tracking-wider mb-1">Est. Active Policies</div>
            <div className="text-xl font-bold font-mono text-text-main">290M+</div>
            <div className="text-[10px] text-text-muted font-mono mt-0.5">Across India</div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex rounded-xl bg-surface p-1 border border-border overflow-x-auto">
        {[
          { id: 'segments', label: 'Segment Breakdown (Health, Motor, Fire)', icon: PieChartIcon },
          { id: 'insurers', label: 'Insurer Rankings & Market Share (20+ Companies)', icon: BarChart3 },
          { id: 'financials', label: 'Financial Highlights & Ratios', icon: ShieldCheck },
          { id: 'infrastructure', label: 'Workforce & Distribution Infrastructure', icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-muted hover:text-text-main hover:bg-background/40'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Segments */}
      {activeTab === 'segments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Pie Chart */}
            <Card className="lg:col-span-6 bg-surface border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-primary" />
                  Q1 FY 2026-27 Non-Life Premium Segment Share
                </CardTitle>
                <p className="text-xs text-text-muted font-mono">
                  Gross direct premium underwritten by segment (IRDAI June 2026)
                </p>
              </CardHeader>
              <CardContent>
                <ReactECharts option={segmentPieOption} style={{ height: '340px' }} />
              </CardContent>
            </Card>

            {/* Sector Bar Chart */}
            <Card className="lg:col-span-6 bg-surface border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Market Share & Growth by Insurer Type
                </CardTitle>
                <p className="text-xs text-text-muted font-mono">
                  Private Insurers vs Public Sector (PSUs) vs SAHI vs Specialized
                </p>
              </CardHeader>
              <CardContent>
                <ReactECharts option={sectorBarOption} style={{ height: '340px' }} />
              </CardContent>
            </Card>
          </div>

          {/* Segment Details Table */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Comprehensive Segment Performance Table (Rs. in Crs.)</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-[11px] font-mono text-text-muted uppercase">
                    <th className="py-3 px-4">Segment Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">June 2026 Premium</th>
                    <th className="py-3 px-4 text-right">June 2025 Premium</th>
                    <th className="py-3 px-4 text-right">YoY Growth %</th>
                    <th className="py-3 px-4 text-right">Market Share %</th>
                    <th className="py-3 px-4 text-right">Net Accretion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {SEGMENT_BREAKDOWN_JUNE_2026.map((s, idx) => (
                    <tr key={idx} className="hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4 font-semibold text-text-main flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        {s.segment}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px]">
                          {s.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-text-main">
                        ₹{s.premiumJune2026.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Cr
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-text-muted">
                        ₹{s.premiumJune2025.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Cr
                      </td>
                      <td className={`py-3 px-4 text-right font-mono font-semibold ${s.growthRate >= 0 ? 'text-success' : 'text-danger'}`}>
                        {s.growthRate >= 0 ? `+${s.growthRate}%` : `${s.growthRate}%`}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-primary font-bold">
                        {s.marketShare}%
                      </td>
                      <td className={`py-3 px-4 text-right font-mono ${s.accretion >= 0 ? 'text-success' : 'text-danger'}`}>
                        {s.accretion >= 0 ? `+₹${s.accretion} Cr` : `-₹${Math.abs(s.accretion)} Cr`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Insurers Rankings & Filterable Table */}
      {activeTab === 'insurers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Bar Chart Top 8 */}
            <Card className="lg:col-span-5 bg-surface border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Top Insurers Premium Leaders (Q1 June 2026)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReactECharts option={topInsurersBarOption} style={{ height: '360px' }} />
              </CardContent>
            </Card>

            {/* Filter & Search Table */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search insurance company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-4 text-xs text-text-main outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto bg-surface p-1 rounded-lg border border-border">
                  {['All', 'Public', 'Private', 'SAHI'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        selectedType === type ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <Card className="bg-surface border-border overflow-hidden">
                <div className="max-h-[420px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-surface border-b border-border text-[10px] font-mono text-text-muted uppercase z-10">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Insurer Name</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3 text-right">June 2026 (Cr)</th>
                        <th className="py-2.5 px-3 text-right">YoY %</th>
                        <th className="py-2.5 px-3 text-right">Share %</th>
                        <th className="py-2.5 px-3">Key Strategic Strength</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredInsurers.map((ins) => (
                        <tr key={ins.rank} className="hover:bg-primary/5 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-text-muted">{ins.rank}</td>
                          <td className="py-2.5 px-3 font-bold text-text-main">{ins.shortName}</td>
                          <td className="py-2.5 px-3">
                            <Badge
                              variant="outline"
                              className={`text-[9px] ${
                                ins.type === 'Public'
                                  ? 'border-emerald-500/30 text-emerald-400'
                                  : ins.type === 'SAHI'
                                  ? 'border-amber-500/30 text-amber-400'
                                  : 'border-blue-500/30 text-blue-400'
                              }`}
                            >
                              {ins.type}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-text-main">
                            ₹{ins.premiumJune2026.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className={`py-2.5 px-3 text-right font-mono font-semibold ${ins.growthRate >= 0 ? 'text-success' : 'text-danger'}`}>
                            {ins.growthRate >= 0 ? `+${ins.growthRate}%` : `${ins.growthRate}%`}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-primary font-semibold">
                            {ins.marketShare}%
                          </td>
                          <td className="py-2.5 px-3 text-text-muted text-[11px] truncate max-w-[180px]">
                            {ins.keyStrength}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Financial Highlights */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FINANCIAL_RATIO_HIGHLIGHTS.map((f, i) => (
              <Card key={i} className="bg-surface border-border">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-primary uppercase font-bold">{f.category}</span>
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-text-muted">Net Retention Ratio:</span>
                      <span className="font-bold text-text-main">{f.netRetentionRatio}%</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-text-muted">Incurred Claims Ratio:</span>
                      <span className={`font-bold ${f.incurredClaimsRatio > 85 ? 'text-danger' : 'text-success'}`}>
                        {f.incurredClaimsRatio}%
                      </span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-text-muted">Expense Ratio:</span>
                      <span className="font-bold text-text-main">{f.expenseRatio}%</span>
                    </div>
                    <div className="flex justify-between font-mono pt-2 border-t border-border/50">
                      <span className="text-text-muted">Operating Profit:</span>
                      <span className={`font-bold ${f.operatingProfitCr >= 0 ? 'text-success' : 'text-danger'}`}>
                        ₹{f.operatingProfitCr} Cr
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-surface border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Analyst Intelligence Summary: Financial Dynamics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs leading-relaxed text-text-muted">
              <p>
                <strong className="text-text-main">1. Standalone Health Surge:</strong> SAHI insurers registered the highest YoY premium expansion of <span className="text-success font-semibold">+32.89%</span> in Q1 FY 2026-27, reaching ₹12,161 Cr driven by retail health awareness, customized wellness apps, and tax deduction incentives under Section 80D.
              </p>
              <p>
                <strong className="text-text-main">2. Private Sector Consolidation:</strong> Private general insurers expanded their overall market share to <span className="text-primary font-semibold">56.25%</span>, outperforming PSU rivals with faster digital claim processing, automated underwriting algorithms, and bank channel integration.
              </p>
              <p>
                <strong className="text-text-main">3. Claims & Retention Solvency:</strong> Across the sector, average solvency ratios remain robust at <span className="text-primary font-semibold">2.10x</span> (against IRDAI mandatory 1.50x), reflecting strong statutory reserves and capital injections exceeding ₹12,000 Cr in Foreign Direct Investment (FDI).
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 4: Infrastructure */}
      {activeTab === 'infrastructure' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text-main text-base">Workforce & Agents</h3>
                  <p className="text-xs text-text-muted font-mono">Pan-India Sales Network</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-text-muted">Direct Employees:</span>
                  <span className="font-bold text-text-main">{INDUSTRY_INFRASTRUCTURE.totalEmployees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">POSP Personnel:</span>
                  <span className="font-bold text-primary">{INDUSTRY_INFRASTRUCTURE.pospPersonnel}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text-main text-base">Physical Branch Network</h3>
                  <p className="text-xs text-text-muted font-mono">Tier 1 to Tier 4 Access</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Branch Offices:</span>
                  <span className="font-bold text-text-main">{INDUSTRY_INFRASTRUCTURE.totalBranchOffices}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Active Policies Issued:</span>
                  <span className="font-bold text-success">{INDUSTRY_INFRASTRUCTURE.totalPoliciesIssued}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text-main text-base">Capital & Solvency Reserves</h3>
                  <p className="text-xs text-text-muted font-mono">Statutory Capital Audit</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-text-muted">FDI Investments:</span>
                  <span className="font-bold text-text-main">₹{INDUSTRY_INFRASTRUCTURE.foreignDirectInvestmentCr.toLocaleString()} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Capital & Free Reserves:</span>
                  <span className="font-bold text-primary">₹{INDUSTRY_INFRASTRUCTURE.industryCapitalReservesCr.toLocaleString()} Cr</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Verification & Audit Footnote */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        <VerificationPanel
          provider="IRDAI & GI Council India Research"
          source="Official IRDAI Q1 Flash Figures (Upto June 2026)"
          lastUpdated="2026-07-26"
          frequency="Provisional Flash / Monthly Synced"
          confidence="99.4%"
          quality="AAA"
          citation="IRDAI Non-Life Insurance Premium Flash Figures Upto June 2026, GI Council Audit"
          dataset="Gross Direct Premium Income Underwritten by Non-Life Insurers within India"
          license="Institutional Research License"
        />
        <UpgradeCard
          title="Unlock Direct Insurance Data API & BI Connectors"
          description="Access raw IRDAI feeds, insurer-level monthly time-series, segment-wise historical loss ratios, and custom Excel model templates."
          features={[
            'Real-time API sync for IRDAI monthly flash reports',
            'Granular segment drilldowns (Group vs Retail Health, OD vs TP Motor)',
            'Direct export to Excel, PowerBI, Tableau, and PDF institutional digests'
          ]}
        />
      </div>
    </div>
  );
}
