import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { ExportDropdown } from '@/components/ui/ExportDropdown';
import { AiExplainerModal } from '@/components/ui/AiExplainerModal';
import { LockedPreview, PremiumBadge, UpgradeCard, VerificationPanel } from '@/components/ui/PremiumExperience';
import { useToast } from '@/context/ToastContext';
import { VERIFIED_SOURCES, DEFAULT_QUALITY_SCORE } from '@/services/liveConnectors';
import { Search as SearchIcon, BarChart2, FileText, Building2, Globe, Hash, Sparkles, ArrowRight, Zap, Database, TrendingUp, Briefcase } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { motion } from 'motion/react';

export function Statistics() {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || "Compare India and China population growth since 2010";
  const [query, setQuery] = useState(initialQ);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setQuery(urlQuery);
      executeSearch(urlQuery);
    }
  }, [searchParams]);

  const executeSearch = (qText: string) => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 600);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      executeSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    executeSearch(suggestion);
    showToast(`Searching for "${suggestion}"...`, 'info');
  };

  const handleSaveToWorkspace = () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    if (nextSaved) {
      showToast('Search synthesis saved to your workspace!', 'success');
    } else {
      showToast('Synthesis removed from workspace', 'info');
    }
  };

  const popChartOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['India', 'China'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: ['2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024'] },
    yAxis: { type: 'value', min: 1.3, axisLabel: { formatter: '{value}B' } },
    series: [
      { name: 'India', type: 'line', data: [1.23, 1.26, 1.30, 1.33, 1.36, 1.39, 1.41, 1.44], itemStyle: { color: '#C8A45D' }, smooth: true, lineStyle: { width: 3 } },
      { name: 'China', type: 'line', data: [1.34, 1.35, 1.37, 1.38, 1.40, 1.41, 1.41, 1.41], itemStyle: { color: '#EF4444' }, smooth: true, lineStyle: { width: 3 } }
    ]
  };

  const exportColumns = ['Year', 'India Population (B)', 'China Population (B)', 'Source'];
  const exportRows = [
    ['2010', 1.23, 1.34, 'United Nations Population Division'],
    ['2014', 1.30, 1.37, 'United Nations Population Division'],
    ['2018', 1.36, 1.40, 'United Nations Population Division'],
    ['2022', 1.41, 1.41, 'United Nations Population Division'],
    ['2024', 1.44, 1.41, 'United Nations Population Division']
  ];

  return (
    <Layout>
      {/* Search Header */}
      <div className="border-b border-border bg-surface px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-3">Statistics</h1>
            <p className="text-text-muted text-base sm:text-lg">Search and preview verified market, financial, country, and industry datasets.</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="mx-auto flex flex-col sm:flex-row max-w-4xl items-stretch sm:items-center rounded-xl bg-background p-2 sm:p-1.5 shadow-lg border border-primary/20 ring-1 ring-primary/10 transition-shadow hover:shadow-xl focus-within:ring-primary/30 gap-2 sm:gap-0">
            <div className="flex items-center flex-1 px-2 py-1">
              <Sparkles className="h-5 w-5 text-primary animate-pulse shrink-0 ml-1" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 'Healthcare spending by country' or 'Top EV companies'"
                className="w-full bg-transparent px-3 py-2 text-text-main text-base sm:text-lg outline-none placeholder:text-text-muted/60 font-medium"
              />
            </div>
            <Button type="submit" size="lg" className="rounded-lg bg-primary hover:bg-primary/90 px-8 py-3.5 sm:py-6 text-white font-semibold shadow-md transition-transform active:scale-95 shrink-0 w-full sm:w-auto">
              Analyze
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            <span className="text-xs sm:text-sm text-text-muted w-full sm:w-auto text-center sm:text-left mb-1 sm:mb-0">Try asking:</span>
            {['India GDP last 20 years', 'Top EV companies in Europe', 'Healthcare spending by country'].map(suggestion => (
              <Badge
                key={suggestion}
                variant="outline"
                onClick={() => handleSuggestionClick(suggestion)}
                className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors border-border/60 text-xs py-1"
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {isSearching ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
            <p className="text-text-muted font-mono animate-pulse text-sm">Synthesizing data sources for "{query}"...</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 sm:space-y-12">
            
            {/* AI Synthesized Answer Block */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-surface shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-primary/10 bg-background/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-primary font-medium text-xs sm:text-sm flex-wrap">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span className="font-semibold">AI Data Synthesis (UN Population Division)</span>
                  <PremiumBadge>AI Verified</PremiumBadge>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-text-muted font-mono bg-background px-3 py-1 rounded-full border border-border w-fit">
                  <span>Query Match:</span>
                  <span className="text-text-main font-semibold">High Confidence (98%)</span>
                </div>
              </div>
              <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-heading mb-3 sm:mb-4">India surpasses China as world's most populous nation</h2>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    Based on aggregated UN demographic data and national census projections, India's population officially surpassed China's in 2023, reaching approximately 1.43 billion. China's population growth has plateaued and begun a slight decline, while India's growth rate, though slowing, remains positive.
                  </p>
                  <LockedPreview
                    className="mb-6 min-h-[145px]"
                    title="AI Deep Financial Insights"
                    value="Unlock source-by-source reasoning, historical search, advanced filters, downloadable evidence tables, and cited report sections."
                  >
                    <div className="p-4 text-xs sm:text-sm text-text-main leading-relaxed">
                      Premium synthesis adds demographic cohort decomposition, scenario forecasts, sensitivity bands, methodology critique, and machine-readable API outputs for every matched dataset.
                    </div>
                  </LockedPreview>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:gap-3">
                    <Button onClick={handleSaveToWorkspace} variant="default" className="bg-primary hover:bg-primary/90 text-white shadow-sm w-full sm:w-auto justify-center">
                      <BarChart2 className="mr-2 h-4 w-4" /> {isSaved ? 'Saved' : 'Save to Workspace'}
                    </Button>
                    <ExportDropdown
                      title={`Search Synthesis: ${query}`}
                      source="United Nations Population Division"
                      lastUpdated="2026-07-22"
                      columns={exportColumns}
                      rows={exportRows}
                      className="w-full sm:w-auto"
                    />
                    <Button onClick={() => setIsAiModalOpen(true)} variant="outline" className="w-full sm:w-auto justify-center">
                      <Sparkles className="h-4 w-4 mr-1.5" /> Deep AI Analysis
                    </Button>
                  </div>
                </div>
                <div className="bg-background rounded-xl p-3 sm:p-4 border border-border shadow-sm">
                  <ReactECharts option={popChartOption} style={{ height: '280px' }} />
                  <p className="mt-2 text-center text-xs font-mono text-text-muted">
                    Preview range only. Premium unlocks full history, advanced filters, bulk results, and saved queries.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                ['Unlimited Search', 'Guest users can keep searching across datasets and reports.'],
                ['Limited Details', 'Top matches and summaries are visible before premium limits.'],
                ['Premium Search', 'AI search, advanced filters, historical search, bulk results, and saved queries.']
              ].map(([title, description]) => (
                <Card key={title} className="shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="font-heading font-bold text-sm text-text-main">{title}</h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <SourceBadge
              title="UN World Population Growth Indicators"
              source={VERIFIED_SOURCES.UN_DATA}
              qualityScore={DEFAULT_QUALITY_SCORE}
              lastUpdated="2026-07-22"
            />

            <VerificationPanel
              provider="United Nations Population Division"
              source="Government Dataset"
              lastUpdated="2026-07-22"
              frequency="Annual / Revision Synced"
              confidence="98%"
              quality="AAA"
              citation="UN World Population Growth Indicators, accessed 2026-07-22"
              dataset="UN population estimates and projections"
              license="Public Research Dataset"
            />

            <UpgradeCard
              title="Unlock AI Search"
              description="Search remains open to guests; premium adds deeper answers, evidence exports, historical retrieval, and reusable query workflows."
              features={[
                'Advanced filters, historical search, and bulk result exports',
                'Saved queries, AI collections, and workspace collaboration',
                'Cited AI summaries with original datasets and confidence scores'
              ]}
            />
          </motion.div>
        )}
      </div>

      <AiExplainerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        datasetTitle={query}
      />
    </Layout>
  );
}
