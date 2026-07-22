import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PremiumBadge, UpgradeCard } from '@/components/ui/PremiumExperience';
import { ResearchGlyph } from '@/components/ui/ResearchGlyph';
import { Search, ArrowRight, Download, BarChart2, TrendingUp, Building2, Globe, FileText, ChevronRight, Lock } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const CATEGORIES = [
  "Finance", "Banking", "Economy", "Insurance", "Healthcare", "Technology",
  "AI", "Cybersecurity", "Automotive", "Energy", "Retail", "Real Estate"
];

const FEATURED_STATS = [
  { title: "Global AI Market Size 2027", value: "$407.0B", change: "+36.2%", category: "Technology", isPremium: true },
  { title: "US Interest Rates Forecast", value: "3.25%", change: "-0.50", category: "Finance", isPremium: true },
  { title: "Renewable Energy Adoption", value: "42.5%", change: "+12.1%", category: "Energy", isPremium: false },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } }
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
      showToast('Please enter a valid email address', 'warning');
      return;
    }
    showToast('Subscribed! You will receive weekly STATIQDATA data digests.', 'success');
    setNewsletterEmail('');
  };

  const handleDownloadPdf = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    showToast(`PDF export for "${title}" requires Premium. Report preview is available.`, 'info');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary px-4 py-24 sm:px-6 lg:px-8 text-center text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="container relative z-10 mx-auto max-w-4xl"
        >
          <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 border-white/20">Premium Financial Research</Badge>
          <h1 className="mb-6 font-heading text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Find the <span className="text-accent">data</span> you need,<br />faster than ever.
          </h1>
          <p className="mb-10 text-lg text-white/80 sm:text-xl max-w-2xl mx-auto font-light">
            Access over 3.5 million statistics covering finance, economy & markets across 150+ countries. Real-time data for real-world decisions.
          </p>
          
          <form onSubmit={handleSearchSubmit}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto flex max-w-2xl items-center rounded-lg bg-white p-1 shadow-lg shadow-black/10"
            >
              <Search className="ml-3 h-5 w-5 text-text-muted shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search statistics, industries, or companies..."
                className="w-full bg-transparent px-4 py-3 text-text-main outline-none placeholder:text-text-muted"
              />
              <Button type="submit" size="lg" className="rounded-md bg-secondary hover:bg-secondary/90 px-8 text-white font-medium shrink-0">
                Search
              </Button>
            </motion.div>
          </form>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm text-white/60"
          >
            <span>Trending:</span>
            {['Inflation Rate', 'EV Sales', 'SaaS Growth', 'GDP Forecast'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1 hover:bg-white/20 transition-colors text-white text-xs font-medium cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-8 sm:grid-cols-4"
          >
            {[
              { label: 'Statistics', value: '3.5M+' },
              { label: 'Industries', value: '250+' },
              { label: 'Countries', value: '150+' },
              { label: 'Reports', value: '45K+' },
            ].map((stat) => (
              <motion.div variants={itemVariants} key={stat.label} className="text-center">
                <div className="font-mono text-3xl font-bold text-white">{stat.value}</div>
                <div className="mt-1 text-sm text-white/60 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Strip */}
      <section className="border-b border-border bg-surface px-4 py-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide"
        >
          <span className="text-sm font-semibold text-text-muted uppercase tracking-wider shrink-0 mr-2">Browse by Category</span>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleTagClick(category)}
              className="shrink-0 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-text-main hover:border-primary hover:text-primary transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              {category}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Featured Statistics */}
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
          >
            <div>
              <h2 className="font-heading text-3xl font-bold text-text-main">Featured Statistics</h2>
              <p className="mt-2 text-text-muted">Most viewed data and KPIs this week globally.</p>
            </div>
            <Button variant="link" onClick={() => navigate('/search')} className="group cursor-pointer">
              View all statistics <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURED_STATS.map((stat, idx) => (
              <motion.div variants={itemVariants} key={idx} whileHover={{ y: -5 }}>
                <Card
                  onClick={() => navigate('/dataset')}
                  className="group cursor-pointer hover:border-primary shadow-sm hover:shadow-md transition-all flex flex-col h-full"
                >
                  <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                    <Badge variant="secondary" className="font-mono uppercase text-[10px] tracking-wider">{stat.category}</Badge>
                    {stat.isPremium && <PremiumBadge>Premium Dataset</PremiumBadge>}
                  </CardHeader>
                  <CardContent className="flex-1 pt-4">
                    <h3 className="mb-4 text-sm font-semibold leading-snug text-text-main line-clamp-2">{stat.title}</h3>
                    <div className="font-heading text-4xl font-bold text-text-main">{stat.value}</div>
                    <div className="mt-2 flex items-center text-sm font-medium text-success">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      {stat.change} vs last year
                    </div>
                    <div className="mt-6 h-12 w-full rounded-md border border-primary/10 bg-background p-2">
                      <div className="flex h-full items-end gap-1">
                        {[30, 45, 38, 62, 78, 90].map((height, i) => (
                          <div key={i} className="flex-1 rounded-sm bg-primary/20" style={{ height: `${height}%` }} />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Access Grid (Industries, Companies, Countries) */}
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
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" /> Top Industries
                </h3>
                <ChevronRight
                  onClick={() => navigate('/industry')}
                  className="h-5 w-5 text-text-muted cursor-pointer hover:text-primary transition-colors"
                />
              </div>
              <div className="space-y-3">
                {['Artificial Intelligence', 'Financial Services', 'E-commerce', 'Renewable Energy', 'Healthcare IT'].map((item) => (
                  <Link to="/industry" key={item} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-background transition-colors cursor-pointer group hover:border-primary/50">
                    <span className="flex items-center gap-2 text-sm font-medium text-text-main group-hover:text-primary transition-colors">
                      <ResearchGlyph kind="industry" className="h-7 w-7 rounded-lg" />
                      {item}
                    </span>
                    <span className="text-xs text-text-muted font-mono group-hover:text-primary">1,240+</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Companies */}
            <motion.div variants={itemVariants}>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" /> Top Companies
                </h3>
                <ChevronRight
                  onClick={() => navigate('/company')}
                  className="h-5 w-5 text-text-muted cursor-pointer hover:text-primary transition-colors"
                />
              </div>
              <div className="space-y-3">
                {['Apple Inc.', 'Microsoft Corp.', 'NVIDIA', 'Alphabet', 'Amazon'].map((item) => (
                  <Link to="/company" key={item} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-background transition-colors cursor-pointer group hover:border-primary/50">
                    <span className="flex items-center gap-2 text-sm font-medium text-text-main group-hover:text-primary transition-colors">
                      <ResearchGlyph kind="company" className="h-7 w-7 rounded-lg" />
                      {item}
                    </span>
                    <Badge variant="outline" className="text-[10px] group-hover:border-primary group-hover:text-primary">Dashboard</Badge>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Countries */}
            <motion.div variants={itemVariants}>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" /> Key Markets
                </h3>
                <ChevronRight
                  onClick={() => navigate('/country')}
                  className="h-5 w-5 text-text-muted cursor-pointer hover:text-primary transition-colors"
                />
              </div>
              <div className="space-y-3">
                {['United States', 'China', 'India', 'Japan', 'Germany'].map((item) => (
                  <Link to="/country" key={item} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-background transition-colors cursor-pointer group hover:border-primary/50">
                    <span className="flex items-center gap-2 text-sm font-medium text-text-main group-hover:text-primary transition-colors">
                      <ResearchGlyph kind="country" className="h-7 w-7 rounded-lg" />
                      {item}
                    </span>
                    <span className="text-xs text-text-muted font-mono group-hover:text-primary">8.5k+</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Reports & Insights */}
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 border-t border-border">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
          >
            <div>
              <h2 className="font-heading text-3xl font-bold text-text-main">Latest Reports</h2>
              <p className="mt-2 text-text-muted">In-depth market analysis and forecasts.</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/search')}>View all reports</Button>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              "Global EV Battery Market Outlook 2027-2032",
              "Enterprise Generative AI Adoption Report 2027",
              "Semiconductor Supply Chain Forecast 2026-2030",
              "Global Cloud Infrastructure Market Share 2027"
            ].map((reportTitle, i) => (
              <motion.div variants={itemVariants} key={i} whileHover={{ y: -5 }}>
                <Card
                  onClick={() => navigate('/dataset')}
                  className="group cursor-pointer overflow-hidden border-transparent hover:border-border shadow-sm hover:shadow-md transition-all h-full"
                >
                  <div className="h-32 w-full bg-background flex items-center justify-center relative overflow-hidden border-b border-border">
                    <ResearchGlyph kind="report" label={`R${i + 1}`} className="h-20 w-20" />
                  </div>
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-3 text-[10px] uppercase font-mono">Market Forecast</Badge>
                    <h4 className="mb-2 text-sm font-bold leading-tight group-hover:text-primary transition-colors">
                      {reportTitle}
                    </h4>
                    <p className="text-xs text-text-muted line-clamp-2">
                      Comprehensive analysis of market shifts, supply constraints, and financial growth projections.
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
                      <span className="font-mono">Jul 22, 2026</span>
                      <button
                        onClick={(e) => handleDownloadPdf(e, reportTitle)}
                        className="flex items-center font-medium text-primary hover:underline cursor-pointer"
                      >
                        <Lock className="mr-1 h-3 w-3" /> PDF
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-8">
            <UpgradeCard
              title="Unlock Institutional Research"
              description="Guests can preview statistics and report summaries. Premium unlocks complete datasets, report pages, export formats, and verified source trails."
              features={[
                'Complete historical datasets and premium report pages',
                'Verified source, citation, provider, license, and quality metadata',
                'PDF, Excel, CSV, JSON, XML, BI connectors, and API access'
              ]}
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary px-4 py-20 sm:px-6 lg:px-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container relative z-10 mx-auto max-w-2xl"
        >
          <h2 className="font-heading text-3xl font-bold mb-4">Stay ahead of the market</h2>
          <p className="text-white/80 mb-8">
            Get our weekly newsletter with the most important data trends, market shifts, and new statistical releases.
          </p>
          <form onSubmit={handleSubscribe} className="flex w-full max-w-md mx-auto items-center space-x-2">
            <input 
              type="email" 
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email" 
              className="flex h-10 w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all hover:bg-white/20"
            />
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-white font-semibold shrink-0">Subscribe</Button>
          </form>
        </motion.div>
      </section>
    </Layout>
  );
}
