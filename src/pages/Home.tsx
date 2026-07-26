import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PremiumBadge, UpgradeCard } from '@/components/ui/PremiumExperience';
import { ResearchGlyph } from '@/components/ui/ResearchGlyph';
import { InstitutionalTrustBar } from '@/components/ui/InstitutionalTrustBar';
import { 
  Search, ArrowRight, Download, BarChart3, TrendingUp, TrendingDown, 
  Building2, Globe, FileText, ChevronRight, Lock, Sparkles, Command, 
  ShieldCheck, ArrowUpRight, Cpu, DollarSign, Layers, Activity 
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const CATEGORIES = [
  "Macroeconomy", "Banking & Finance", "Enterprise AI", "Semiconductors",
  "Cybersecurity", "Healthcare", "Energy & ESG", "Private Equity", "M&A Intelligence"
];

const FEATURED_STATS = [
  { title: "Global Enterprise AI Infrastructure Spend 2026-2030", value: "$407.0B", change: "+36.2% YoY", category: "Technology", isPremium: true, source: "IDC & Gartner Data" },
  { title: "US Federal Reserve Target Interest Rate Outlook", value: "3.25%", change: "-50 bps", category: "Macro", isPremium: true, source: "Federal Reserve Board" },
  { title: "Global Renewable Energy Generation Capacity", value: "42.5%", change: "+12.1% YoY", category: "Energy", isPremium: false, source: "IEA World Outlook" },
  { title: "Global Semiconductor Foundry Revenue Share", value: "$142.8B", change: "+18.4% YoY", category: "Hardware", isPremium: true, source: "S&P Market Intelligence" },
];

const MARKET_INDICATORS = [
  { name: "S&P 500 Index", val: "5,842.10", chg: "+0.42%", trend: "up" },
  { name: "US 10Y Treasury", val: "4.21%", chg: "-0.03", trend: "down" },
  { name: "Brent Crude Oil", val: "$74.50/bbl", chg: "+1.10%", trend: "up" },
  { name: "Global Inflation Avg", val: "3.1%", chg: "-0.4%", trend: "down" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleTagClick = (tag: string) => {
    navigate(`/search?q=${encodeURIComponent(tag)}`);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid work email address', 'warning');
      return;
    }
    showToast('Subscribed! You will receive weekly STATIQONE Institutional Digests.', 'success');
    setNewsletterEmail('');
  };

  const handleDownloadPdf = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    showToast(`PDF export for "${title}" requires Premium Institutional Access.`, 'info');
  };

  return (
    <Layout>
      {/* Hero Section: Institutional Editorial Layout (No solid gold flood background!) */}
      <section className="relative overflow-hidden bg-background border-b border-border px-4 py-16 sm:py-20 lg:px-8">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2A2A2A_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="container relative z-10 mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
            
            {/* Left Column: Editorial Headline & Search */}
            <div className="w-full lg:w-7/12 text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-main leading-[1.1] mb-6">
                  Data Driven Intelligence for <span className="text-primary underline decoration-primary/40 underline-offset-8">Institutional Investors</span>.
                </h1>

                <p className="text-base sm:text-lg text-text-muted font-normal leading-relaxed mb-8 max-w-2xl">
                  Access 3.5 million+ audited statistics, SEC filings, economic forecasts, and industry benchmarks across 150+ global markets.
                </p>
              </motion.div>

              {/* Natural Spotlight / AI Search Input */}
              <motion.form 
                onSubmit={handleSearchSubmit}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-6"
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-xl border border-border bg-card p-1.5 shadow-2xl focus-within:border-primary/50 transition-all gap-2">
                  <div className="flex items-center flex-1 px-3 py-1">
                    <Search className="h-4 w-4 text-primary shrink-0 mr-2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search company, ticker, macro dataset (e.g., 'US Interest Rates')..."
                      className="w-full bg-transparent text-text-main outline-none placeholder:text-text-muted text-sm font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline font-mono text-[10px] text-text-muted bg-surface px-2 py-1 rounded border border-border">
                      Press ↵
                    </span>
                    <Button type="submit" size="sm" className="bg-primary text-black hover:bg-hover font-bold px-5 h-9 shrink-0">
                      Explore
                    </Button>
                  </div>
                </div>
              </motion.form>

              {/* Trending Queries Pill Filter */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-2 text-xs text-text-muted"
              >
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted mr-1">Trending:</span>
                {['US Fed Rates', 'NVIDIA Margin', 'Global AI Spend', 'EV Supply Chain', 'India GDP'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="rounded-md border border-border bg-surface px-2.5 py-1 hover:border-primary/40 hover:text-text-main transition-colors text-xs font-medium cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Right Column: Live Market Snapshot Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-5/12"
            >
              <div className="rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="font-heading font-bold text-sm text-text-main uppercase tracking-wider">Live Macro Snapshot</span>
                  </div>
                  <span className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">REAL-TIME</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {MARKET_INDICATORS.map((ind) => (
                    <div key={ind.name} className="p-3 rounded-lg border border-border bg-surface hover:border-primary/20 transition-all">
                      <div className="text-[11px] text-text-muted font-medium truncate">{ind.name}</div>
                      <div className="text-lg font-bold font-mono text-text-main mt-0.5">{ind.val}</div>
                      <div className={`text-xs font-semibold mt-0.5 flex items-center ${ind.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                        {ind.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {ind.chg}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3 flex items-center justify-between text-xs">
                  <span className="text-text-muted">Database Status</span>
                  <span className="font-mono text-text-main flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-success"></span>
                    3,542,109 Series Active
                  </span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Key Metrics Band */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-2 gap-4 border-t border-border pt-8 sm:grid-cols-4"
          >
            {[
              { label: 'Audited Statistics', value: '3.5M+' },
              { label: 'Covered Sectors', value: '250+' },
              { label: 'Global Markets', value: '150+' },
              { label: 'Institutional Reports', value: '45K+' },
            ].map((stat) => (
              <motion.div variants={itemVariants} key={stat.label} className="p-4 rounded-xl border border-border bg-card">
                <div className="font-mono text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-xs text-text-muted font-mono uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Institutional Trust & Data Sources Bar */}
      <InstitutionalTrustBar />

      {/* Category Filter Strip */}
      <section className="border-b border-border bg-surface px-4 py-4 sm:px-6">
        <div className="container mx-auto flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-mono uppercase tracking-wider text-text-muted shrink-0 mr-2">Sectors:</span>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleTagClick(category)}
              className="shrink-0 rounded-md border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-text-main hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Institutional Statistics Grid */}
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-border pb-6">
            <div>
              <div className="text-xs font-mono font-bold text-primary uppercase tracking-wider mb-1">AUDITED METRICS</div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-main">Featured Institutional Statistics</h2>
            </div>
            <Button variant="outline" onClick={() => navigate('/search')} className="text-xs border-border hover:border-primary/50">
              Browse All 3.5M+ Series <ArrowRight className="ml-2 h-3.5 w-3.5 text-primary" />
            </Button>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {FEATURED_STATS.map((stat, idx) => (
              <motion.div variants={itemVariants} key={idx} whileHover={{ y: -4 }}>
                <Card
                  onClick={() => navigate('/dataset')}
                  className="group cursor-pointer hover:border-primary/40 shadow-xl transition-all flex flex-col h-full bg-card"
                >
                  <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                    <Badge variant="secondary" className="font-mono uppercase text-[10px] border-border text-text-muted">{stat.category}</Badge>
                    {stat.isPremium && <PremiumBadge>Exclusive</PremiumBadge>}
                  </CardHeader>
                  <CardContent className="flex-1 pt-3 flex flex-col justify-between">
                    <div>
                      <h3 className="mb-3 text-xs font-semibold leading-snug text-text-main group-hover:text-primary transition-colors line-clamp-2">{stat.title}</h3>
                      <div className="font-mono text-3xl font-bold text-text-main tracking-tight">{stat.value}</div>
                      <div className="mt-2 flex items-center text-xs font-semibold text-success">
                        <TrendingUp className="mr-1 h-3.5 w-3.5" />
                        {stat.change}
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t border-border pt-3 flex items-center justify-between text-[11px] text-text-muted">
                      <span className="font-mono">{stat.source}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Access Matrix (Industries, Companies, Countries) */}
      <section className="border-t border-border bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-3"
          >
            {/* Industries */}
            <motion.div variants={itemVariants}>
              <div className="mb-6 flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-heading text-lg font-bold flex items-center gap-2 text-text-main">
                  <BarChart3 className="h-4 w-4 text-primary" /> Key Sectors
                </h3>
                <ChevronRight
                  onClick={() => navigate('/industry')}
                  className="h-4 w-4 text-text-muted cursor-pointer hover:text-primary transition-colors"
                />
              </div>
              <div className="space-y-2.5">
                {['Enterprise Artificial Intelligence', 'Global Financial Institutions', 'Cloud Infrastructure & SaaS', 'Clean Energy & Grid ESG', 'Pharma & Biotech Research'].map((item) => (
                  <Link to="/industry" key={item} className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:border-primary/40 transition-colors cursor-pointer group">
                    <span className="flex items-center gap-2.5 text-xs font-semibold text-text-main group-hover:text-primary transition-colors">
                      <ResearchGlyph kind="industry" className="h-6 w-6 rounded" />
                      {item}
                    </span>
                    <span className="text-[11px] text-text-muted font-mono group-hover:text-primary">1,240+ Datasets</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Companies */}
            <motion.div variants={itemVariants}>
              <div className="mb-6 flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-heading text-lg font-bold flex items-center gap-2 text-text-main">
                  <Building2 className="h-4 w-4 text-primary" /> Top Equities
                </h3>
                <ChevronRight
                  onClick={() => navigate('/company')}
                  className="h-4 w-4 text-text-muted cursor-pointer hover:text-primary transition-colors"
                />
              </div>
              <div className="space-y-2.5">
                {[
                  { name: 'Apple Inc. (AAPL)', val: '$3.45T Cap' },
                  { name: 'Microsoft Corp. (MSFT)', val: '$3.12T Cap' },
                  { name: 'NVIDIA Corp. (NVDA)', val: '$3.28T Cap' },
                  { name: 'Alphabet Inc. (GOOGL)', val: '$2.15T Cap' },
                  { name: 'Amazon.com Inc. (AMZN)', val: '$1.98T Cap' }
                ].map((item) => (
                  <Link to="/company" key={item.name} className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:border-primary/40 transition-colors cursor-pointer group">
                    <span className="flex items-center gap-2.5 text-xs font-semibold text-text-main group-hover:text-primary transition-colors">
                      <ResearchGlyph kind="company" className="h-6 w-6 rounded" />
                      {item.name}
                    </span>
                    <span className="text-[11px] text-primary font-mono font-semibold">{item.val}</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Countries */}
            <motion.div variants={itemVariants}>
              <div className="mb-6 flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-heading text-lg font-bold flex items-center gap-2 text-text-main">
                  <Globe className="h-4 w-4 text-primary" /> Sovereign Economies
                </h3>
                <ChevronRight
                  onClick={() => navigate('/country')}
                  className="h-4 w-4 text-text-muted cursor-pointer hover:text-primary transition-colors"
                />
              </div>
              <div className="space-y-2.5">
                {[
                  { name: 'United States', gdp: '$28.7T GDP' },
                  { name: 'China', gdp: '$18.5T GDP' },
                  { name: 'Germany', gdp: '$4.5T GDP' },
                  { name: 'Japan', gdp: '$4.2T GDP' },
                  { name: 'India', gdp: '$3.9T GDP' }
                ].map((item) => (
                  <Link to="/country" key={item.name} className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:border-primary/40 transition-colors cursor-pointer group">
                    <span className="flex items-center gap-2.5 text-xs font-semibold text-text-main group-hover:text-primary transition-colors">
                      <ResearchGlyph kind="country" className="h-6 w-6 rounded" />
                      {item.name}
                    </span>
                    <span className="text-[11px] text-text-muted font-mono group-hover:text-primary">{item.gdp}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Reports & Exclusive Intelligence Section */}
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 border-t border-border">
        <div className="container mx-auto">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-border pb-6">
            <div>
              <div className="text-xs font-mono font-bold text-primary uppercase tracking-wider mb-1">EXECUTIVE BRIEFINGS</div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-main">Institutional Research Reports</h2>
            </div>
            <Button variant="outline" onClick={() => navigate('/search')} className="text-xs border-border hover:border-primary/50">View All Reports</Button>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              "Global EV Battery Supply Chain Outlook 2026-2032",
              "Enterprise Generative AI Adoption & ROI Analysis",
              "Semiconductor Wafer Capacity & Geopolitical Risk",
              "Global Hyperscale Cloud Infrastructure Share 2026"
            ].map((reportTitle, i) => (
              <motion.div variants={itemVariants} key={i} whileHover={{ y: -4 }}>
                <Card
                  onClick={() => navigate('/dataset')}
                  className="group cursor-pointer border-border hover:border-primary/40 shadow-xl transition-all h-full bg-card flex flex-col justify-between"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-[10px] uppercase font-mono border-border text-text-muted">Market Forecast</Badge>
                      <Lock className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <h4 className="mb-2 text-xs font-bold leading-relaxed text-text-main group-hover:text-primary transition-colors">
                      {reportTitle}
                    </h4>
                    <p className="text-[11px] text-text-muted line-clamp-3 leading-relaxed mb-4">
                      Comprehensive institutional breakdown of market dynamics, supply chain allocations, and valuation multiples.
                    </p>
                  </CardContent>
                  <div className="px-5 pb-5 border-t border-border pt-3 flex items-center justify-between text-[11px] text-text-muted">
                    <span className="font-mono">July 2026 Release</span>
                    <button
                      onClick={(e) => handleDownloadPdf(e, reportTitle)}
                      className="flex items-center font-semibold text-primary hover:underline cursor-pointer"
                    >
                      PDF <ArrowUpRight className="ml-1 h-3 w-3" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10">
            <UpgradeCard
              title="Unlock Full Institutional Research & Raw Datasets"
              description="Guests can preview high-level stats. Premium subscribers unlock 3.5M+ full historical datasets, institutional research PDF downloads, SEC filings parser, and API connectors."
              features={[
                'Unrestricted access to 3.5M+ statistics and 45K+ institutional report pages',
                'Raw data downloads in Excel, CSV, JSON, Parquet, and Direct API endpoints',
                'Audited primary source trails, methodologies, and SEC filing citations'
              ]}
            />
          </div>
        </div>
      </section>

      {/* Refined Dark Institutional Digest Subscription (No massive gold flood!) */}
      <section className="border-t border-border bg-card px-4 py-16 sm:py-20 sm:px-6 lg:px-8 text-center text-text-main relative overflow-hidden">
        <div className="container relative z-10 mx-auto max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-surface text-xs font-mono text-primary font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            WEEKLY RESEARCH DIGEST
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3">Institutional Intelligence in Your Inbox</h2>
          <p className="text-text-muted text-xs sm:text-sm mb-6 max-w-md mx-auto leading-relaxed">
            Curated analysis of global macro shifts, earnings surprises, and structural statistical releases delivered every Monday.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full max-w-md mx-auto items-stretch sm:items-center gap-2.5">
            <input 
              type="email" 
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter institutional work email" 
              className="flex h-10 w-full rounded-lg border border-border bg-surface px-4 text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
            />
            <Button type="submit" className="h-10 bg-primary text-black font-bold hover:bg-hover shrink-0 w-full sm:w-auto px-6 text-xs">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
