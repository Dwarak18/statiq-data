import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LockedPreview, PremiumBadge, UpgradeCard, VerificationPanel } from '@/components/ui/PremiumExperience';
import { ResearchGlyph } from '@/components/ui/ResearchGlyph';
import { useToast } from '@/context/ToastContext';
import { ArrowRight, BarChart2, FileText, Globe, Activity, Shield, Cpu, Zap, ShoppingCart, HeartPulse } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const INDUSTRIES = [
  {
    name: 'Technology & AI',
    icon: Cpu,
    count: '12,450',
    color: 'text-blue-500',
    marketSize: '$390.9B',
    cagr: '37.3%',
    description: 'The AI & technology sector is experiencing unprecedented growth, driven by generative AI, enterprise cloud adoption, and massive R&D expenditure.',
    growthData: [120, 150, 210, 280, 390, 520]
  },
  {
    name: 'Healthcare & Biotech',
    icon: HeartPulse,
    count: '8,230',
    color: 'text-red-500',
    marketSize: '$285.4B',
    cagr: '14.2%',
    description: 'Biotech innovation, AI-driven drug discovery, and digital health platforms are accelerating healthcare investments worldwide.',
    growthData: [95, 110, 140, 185, 235, 285]
  },
  {
    name: 'Finance & Banking',
    icon: Activity,
    count: '15,100',
    color: 'text-green-500',
    marketSize: '$510.0B',
    cagr: '11.8%',
    description: 'Fintech, digital payments, open banking APIs, and algorithmic trading systems are reshaping global financial services.',
    growthData: [210, 250, 310, 380, 440, 510]
  },
  {
    name: 'Cybersecurity',
    icon: Shield,
    count: '3,420',
    color: 'text-purple-500',
    marketSize: '$195.2B',
    cagr: '18.6%',
    description: 'Zero-trust architecture, cloud security, and automated threat detection are driving enterprise security budgets.',
    growthData: [60, 80, 105, 135, 165, 195]
  },
  {
    name: 'Energy & CleanTech',
    icon: Zap,
    count: '6,100',
    color: 'text-yellow-500',
    marketSize: '$420.5B',
    cagr: '22.4%',
    description: 'Solar, wind, battery storage infrastructure, and grid modernization projects are expanding rapidly globally.',
    growthData: [140, 180, 230, 290, 360, 420]
  },
  {
    name: 'E-commerce & Retail',
    icon: ShoppingCart,
    count: '9,840',
    color: 'text-pink-500',
    marketSize: '$640.8B',
    cagr: '15.1%',
    description: 'Omnichannel retail, AI personalization, and cross-border logistics are powering modern e-commerce expansion.',
    growthData: [320, 380, 450, 520, 580, 640]
  },
];

export function Industry() {
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const selectedSector = INDUSTRIES[activeIdx];

  const growthOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: ['2020', '2021', '2022', '2023', '2024', '2025'] },
    yAxis: { type: 'value', axisLabel: { formatter: '${value}B' } },
    series: [
      {
        name: 'Market Size',
        type: 'line',
        smooth: true,
        data: selectedSector.growthData,
        itemStyle: { color: '#0EA5E9' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(14, 165, 233, 0.4)' }, { offset: 1, color: 'rgba(14, 165, 233, 0)' }]
          }
        }
      }
    ]
  };

  const handleSelectSector = (idx: number) => {
    setActiveIdx(idx);
    showToast(`Loaded ${INDUSTRIES[idx].name} market analytics`, 'info');
  };

  return (
    <Layout>
      {/* Directory Header */}
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Industry Research</Badge>
          <div className="mb-4 flex justify-center">
            <PremiumBadge>Institutional Industry Intelligence</PremiumBadge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-text-main mb-4">
            Global Industry Insights
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Discover comprehensive statistics, forecasts, and market research reports across 180+ global industries.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Industry Grid */}
        <h2 className="text-2xl font-bold font-heading mb-6">Browse by Sector</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {INDUSTRIES.map((ind, i) => (
            <motion.div key={i} whileHover={{ y: -4 }}>
              <Card
                onClick={() => handleSelectSector(i)}
                className={`cursor-pointer transition-all shadow-sm h-full ${
                  i === activeIdx ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'hover:border-primary/50'
                }`}
              >
                <CardContent className="p-6 flex items-start gap-4">
                  <ResearchGlyph kind="industry" className="h-12 w-12 shrink-0" />
                  <div>
                    <h3 className="font-bold text-text-main text-lg mb-1">{ind.name}</h3>
                    <p className="text-sm text-text-muted font-mono">{ind.count} statistics</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Deep Dive Section */}
        <div className="pt-12 border-t border-border grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-[10px] uppercase font-mono bg-surface">Featured Sector</Badge>
            </div>
            <h2 className="text-3xl font-bold font-heading mb-4">{selectedSector.name} Market</h2>
            <p className="text-text-muted mb-6 leading-relaxed">
              {selectedSector.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-surface rounded-lg border border-border">
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Global Market Size (2024)</div>
                <div className="text-2xl font-bold font-mono text-primary">{selectedSector.marketSize}</div>
              </div>
              <div className="p-4 bg-surface rounded-lg border border-border">
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Projected CAGR</div>
                <div className="text-2xl font-bold font-mono text-success">{selectedSector.cagr}</div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/search?q=${encodeURIComponent(selectedSector.name)}`)}
              className="flex items-center text-primary font-semibold hover:underline cursor-pointer"
            >
              View {selectedSector.name} Statistics & Reports <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          <div>
            <Card className="shadow-none border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">{selectedSector.name} Growth Trajectory</CardTitle>
              </CardHeader>
              <CardContent>
                <ReactECharts option={growthOption} style={{ height: '300px' }} />
                <p className="mt-2 text-xs text-text-muted font-mono text-center">
                  Guest preview shows category-level trend. Premium unlocks segment drilldowns, company benchmarking, and source-level data.
                </p>
              </CardContent>
            </Card>
            <LockedPreview
              className="mt-4 min-h-[210px]"
              title="Unlock Industry Benchmarking"
              value="Compare sectors, companies, regions, margins, funding, valuation multiples, and historical revisions."
            >
              <ReactECharts
                option={{
                  ...growthOption,
                  legend: { data: ['Market Size', 'Peer Median', 'Premium Forecast'], bottom: 0 },
                  series: [
                    ...(growthOption.series as any[]),
                    { name: 'Peer Median', type: 'line', smooth: true, data: [90, 120, 170, 230, 310, 390], itemStyle: { color: '#10B981' } },
                    { name: 'Premium Forecast', type: 'line', smooth: true, data: [130, 175, 245, 340, 475, 650], itemStyle: { color: '#F59E0B' } }
                  ]
                }}
                style={{ height: '210px' }}
              />
            </LockedPreview>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <VerificationPanel
            provider="STATIQDATA Industry Research"
            source="Institutional Data + Exchange Verified"
            lastUpdated="2026-07-22"
            frequency="Monthly / Synced Hourly"
            confidence="97%"
            quality="AA"
            citation={`${selectedSector.name} industry market intelligence dataset`}
            dataset={`${selectedSector.name} sector statistics and reports`}
            license="Institutional Research License"
          />
          <UpgradeCard
            title="Unlock Complete Industry Reports"
            description="Move beyond the sample sector preview into complete industry datasets, forecasts, company comparisons, and exportable reports."
            features={[
              'Full reports with methodology, source, and update cadence',
              'Historical comparisons, forecasting, and valuation models',
              'CSV, Excel, PDF, JSON, BI connectors, and API access'
            ]}
          />
        </div>

      </div>
    </Layout>
  );
}
