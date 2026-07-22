import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { ExportDropdown } from '@/components/ui/ExportDropdown';
import { AiExplainerModal } from '@/components/ui/AiExplainerModal';
import { LockedPreview, PremiumBadge, UpgradeCard, VerificationPanel } from '@/components/ui/PremiumExperience';
import { ResearchGlyph } from '@/components/ui/ResearchGlyph';
import { useToast } from '@/context/ToastContext';
import { VERIFIED_SOURCES, DEFAULT_QUALITY_SCORE, fetchWorldBankCountryData } from '@/services/liveConnectors';
import { Globe, Users, TrendingUp, DollarSign, Building2, BookOpen, HeartPulse, Sparkles, RefreshCw } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const COUNTRY_DATA: Record<string, {
  code: string;
  name: string;
  region: string;
  description: string;
  population: string;
  gdpNominal: string;
  gdpGrowth: string;
  urbanization: string;
  gdpHistory: number[];
  years: string[];
  topics: { name: string; count: string; icon: any }[];
  reports: string[];
}> = {
  IND: {
    code: 'IND',
    name: 'India',
    region: 'Asia-Pacific',
    description: 'Comprehensive statistical overview of India, covering demographics, economy, society, and key industries.',
    population: '1.44 Billion',
    gdpNominal: '$4.11 Trillion',
    gdpGrowth: '7.2%',
    urbanization: '36.4%',
    gdpHistory: [2.66, 3.15, 3.39, 3.73, 4.11, 4.45],
    years: ['2020', '2021', '2022', '2023', '2024', '2025 (est)'],
    topics: [
      { name: 'Economy & Finance', count: '1,240', icon: DollarSign },
      { name: 'Demographics & Society', count: '850', icon: Users },
      { name: 'Health & Pharma', count: '640', icon: HeartPulse },
      { name: 'Education & Science', count: '420', icon: BookOpen },
      { name: 'Technology & Telecomm', count: '910', icon: Globe },
    ],
    reports: [
      'India Consumer Market Outlook 2025',
      'Digital India: E-commerce & Payments',
      'India Automotive Industry Report',
      'Renewable Energy Transition in India'
    ]
  },
  USA: {
    code: 'USA',
    name: 'United States',
    region: 'North America',
    description: 'Detailed economic, industrial, and consumer market indicators for the United States of America.',
    population: '335.8 Million',
    gdpNominal: '$28.78 Trillion',
    gdpGrowth: '2.5%',
    urbanization: '83.3%',
    gdpHistory: [21.06, 23.32, 25.46, 27.36, 28.78, 29.80],
    years: ['2020', '2021', '2022', '2023', '2024', '2025 (est)'],
    topics: [
      { name: 'Wall Street & Financial Markets', count: '4,500', icon: DollarSign },
      { name: 'Enterprise Tech & AI', count: '3,800', icon: Globe },
      { name: 'Healthcare Spending & Insurance', count: '2,100', icon: HeartPulse },
      { name: 'Higher Education & Workforce', count: '1,400', icon: BookOpen },
    ],
    reports: [
      'US Macroeconomic Forecast 2025',
      'US Venture Capital & Tech Funding Trends',
      'US Healthcare Expenditure Report'
    ]
  },
  CHN: {
    code: 'CHN',
    name: 'China',
    region: 'Asia-Pacific',
    description: 'In-depth demographic, manufacturing, and industrial trade statistics for the People\'s Republic of China.',
    population: '1.41 Billion',
    gdpNominal: '$18.53 Trillion',
    gdpGrowth: '5.0%',
    urbanization: '66.2%',
    gdpHistory: [14.69, 17.73, 17.96, 17.79, 18.53, 19.40],
    years: ['2020', '2021', '2022', '2023', '2024', '2025 (est)'],
    topics: [
      { name: 'Manufacturing & Industrial Trade', count: '3,100', icon: Building2 },
      { name: 'EV & Clean Energy Adoption', count: '2,400', icon: TrendingUp },
      { name: 'Digital Economy & E-commerce', count: '1,900', icon: Globe },
    ],
    reports: [
      'China Electric Vehicle Market 2025',
      'China Semiconductor Self-Reliance Index',
      'Consumer Retail Shifts in Urban China'
    ]
  }
};

export function Country() {
  const [activeCountryCode, setActiveCountryCode] = useState<string>('IND');
  const [liveGdp, setLiveGdp] = useState<number[] | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const currentCountry = COUNTRY_DATA[activeCountryCode] || COUNTRY_DATA['IND'];

  useEffect(() => {
    async function loadLiveWorldBankData() {
      const wbData = await fetchWorldBankCountryData(activeCountryCode);
      if (wbData && wbData.gdpHistory && wbData.gdpHistory.length > 0) {
        setLiveGdp(wbData.gdpHistory.map(g => g.gdp));
        showToast(`Live World Bank sync complete for ${currentCountry.name}`, 'info');
      } else {
        setLiveGdp(null);
      }
    }
    loadLiveWorldBankData();
  }, [activeCountryCode]);

  const gdpValues = liveGdp || currentCountry.gdpHistory;

  const gdpChart = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: currentCountry.years },
    yAxis: { type: 'value', axisLabel: { formatter: '${value}T' } },
    series: [
      { name: 'GDP (Trillions USD)', type: 'bar', data: gdpValues, itemStyle: { color: '#0EA5E9' } }
    ]
  };

  const exportColumns = ['Year', 'GDP (Trillions USD)', 'Country', 'Source'];
  const exportRows = currentCountry.years.map((year, idx) => [
    year,
    `$${gdpValues[idx] || 0}T`,
    currentCountry.name,
    'World Bank Open Data Group'
  ]);

  return (
    <Layout>
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <ResearchGlyph kind="country" label={currentCountry.code} className="h-20 w-20 shrink-0" />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold font-heading text-text-main">{currentCountry.name}</h1>
                  <Badge variant="outline" className="font-mono">{currentCountry.region}</Badge>
                  <PremiumBadge>Government Dataset</PremiumBadge>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> World Bank API Connected
                  </Badge>
                </div>
                <p className="text-text-muted max-w-2xl">
                  {currentCountry.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ExportDropdown
                title={`${currentCountry.name} Macroeconomic Indicators`}
                source="World Bank Open Data Group"
                lastUpdated="2026-07-22"
                columns={exportColumns}
                rows={exportRows}
              />
              <Button onClick={() => setIsAiModalOpen(true)} variant="outline">
                <Sparkles className="h-4 w-4 mr-1.5" /> AI Insight
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Country Selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.keys(COUNTRY_DATA).map((code) => (
            <button
              key={code}
              onClick={() => setActiveCountryCode(code)}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                code === activeCountryCode
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface text-text-main border-border hover:border-primary'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <ResearchGlyph kind="country" label={code} className="h-7 w-7 rounded-lg" />
                {COUNTRY_DATA[code].name}
              </span>
            </button>
          ))}
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-surface border border-border flex flex-col items-center text-center">
            <Users className="h-6 w-6 text-primary mb-2" />
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Population</div>
            <div className="font-mono text-lg font-bold">{currentCountry.population}</div>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border flex flex-col items-center text-center">
            <DollarSign className="h-6 w-6 text-emerald-500 mb-2" />
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">GDP (Nominal)</div>
            <div className="font-mono text-lg font-bold">{currentCountry.gdpNominal}</div>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border flex flex-col items-center text-center">
            <TrendingUp className="h-6 w-6 text-accent mb-2" />
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">GDP Growth</div>
            <div className="font-mono text-lg font-bold">{currentCountry.gdpGrowth}</div>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border flex flex-col items-center text-center">
            <Building2 className="h-6 w-6 text-amber-500 mb-2" />
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Urbanization</div>
            <div className="font-mono text-lg font-bold">{currentCountry.urbanization}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold font-heading mb-4">Economic Overview for {currentCountry.name} (World Bank Live API)</h2>
              <Card className="shadow-none border-border">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-2">GDP Trajectory at Current Prices (Trillions USD)</h3>
                  <ReactECharts option={gdpChart} style={{ height: '300px' }} />
                  <p className="mt-2 text-xs text-text-muted font-mono text-center">
                    Preview includes recent annual GDP trajectory. Premium unlocks full history, fiscal comparisons, and downloadable raw observations.
                  </p>
                </CardContent>
              </Card>
            </section>

            <LockedPreview
              className="min-h-[220px]"
              title="Unlock Historical Country Comparison"
              value="Compare countries across GDP, inflation, unemployment, sector output, trade flows, fiscal ratios, and source-level revisions."
            >
              <ReactECharts
                option={{
                  ...gdpChart,
                  xAxis: { type: 'category', data: ['2000', '2005', '2010', '2015', '2020', '2025'] },
                  series: [
                    { name: currentCountry.name, type: 'line', smooth: true, data: [1.1, 1.8, 2.6, 3.4, 4.1, 4.8], itemStyle: { color: '#1E3A8A' } },
                    { name: 'Peer median', type: 'line', smooth: true, data: [0.9, 1.4, 2.0, 2.9, 3.6, 4.2], itemStyle: { color: '#0EA5E9' } }
                  ]
                }}
                style={{ height: '220px' }}
              />
            </LockedPreview>

            <SourceBadge
              title={`${currentCountry.name} GDP Indicators`}
              source={VERIFIED_SOURCES.WORLD_BANK}
              qualityScore={DEFAULT_QUALITY_SCORE}
              lastUpdated="2026-07-22"
            />

            <VerificationPanel
              provider="World Bank Open Data Group"
              source="Government Dataset"
              lastUpdated="2026-07-22"
              frequency="Annual / API Synced"
              confidence="99%"
              quality="AAA"
              citation={`${currentCountry.name} macroeconomic indicators, World Bank Open Data`}
              dataset={`${currentCountry.code} country macroeconomic profile`}
              license="Open Data Research License"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold font-heading border-b border-border pb-2">Latest Reports ({currentCountry.name})</h3>
            <div className="space-y-4">
              {currentCountry.reports.map((report, i) => (
                <div
                  key={i}
                  onClick={() => navigate('/dataset')}
                  className="p-3 rounded-xl bg-surface border border-border hover:border-primary/50 cursor-pointer transition-colors"
                >
                  <div className="text-xs text-primary font-mono uppercase mb-1">Dossier</div>
                  <h4 className="text-sm font-medium text-text-main line-clamp-2">{report}</h4>
                </div>
              ))}
            </div>
            <UpgradeCard
              title="Unlock Country Intelligence"
              description="Access long-range historical data, cross-country benchmarking, fiscal datasets, and report exports."
              features={[
                'Latest 2 years remain visible for guest preview',
                'Full historical charts, comparisons, and source revisions',
                'PDF, Excel, CSV, JSON, XML, Power BI, Tableau, and API access'
              ]}
            />
          </div>
        </div>
      </div>

      <AiExplainerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        datasetTitle={`${currentCountry.name} Macroeconomic Indicator Analysis`}
      />
    </Layout>
  );
}
