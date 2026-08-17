/**
 * STATIQONE Global Insurance Intelligence - Seed Dataset
 * High-fidelity institutional news records across USA, Europe, Asia, and Global regions.
 */

const crypto = require('crypto');

function computeHash(guid, link, title) {
  return crypto.createHash('sha256').update(`${guid || ''}|${link || ''}|${title || ''}`).digest('hex');
}

const RAW_SEED_ARTICLES = [
  // --- USA REGION ---
  {
    title: 'NAIC Adopts Comprehensive Climate Risk Disclosure Standard for Commercial Carriers',
    description: 'The National Association of Insurance Commissioners (NAIC) has finalized unified disclosure frameworks requiring property and casualty insurers with over $100M direct premium to report climate scenario modeling.',
    link: 'https://www.insurancejournal.com/news/national/2026/08/14/naic-climate-disclosure-standard.htm',
    guid: 'ij-20260814-naic-climate',
    source: 'Insurance Journal',
    sourceCode: 'IJ',
    pubDate: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    region: 'USA',
    category: 'Regulatory & Risk',
    author: 'Andrew Simpson',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Florida Property Insurance Market Stabilizes as Depopulation from Citizens Accelerates',
    description: 'Citizens Property Insurance Corp. transferred an additional 42,000 policies to private admitted carriers in Q2, signaling improving capitalization and reinsurance treaty stability across the Gulf Coast corridor.',
    link: 'https://www.insurancejournal.com/news/southeast/2026/08/12/florida-citizens-depopulation-q2.htm',
    guid: 'ij-20260812-florida-depopulation',
    source: 'Insurance Journal',
    sourceCode: 'IJ',
    pubDate: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    region: 'USA',
    category: 'Property & Casualty',
    author: 'William Rabb',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Commercial Cyber Rates Flatten in Mid-Market as Underwriting Discipline Tightens',
    description: 'Business Insurance mid-year rate barometer indicates US cyber insurance pricing moderated to +1.2% year-over-year, supported by mandatory EDR/MFA adoption across corporate policyholders.',
    link: 'https://www.businessinsurance.com/article/20260810/NEWS06/912345678/commercial-cyber-insurance-rates-flatten-2026',
    guid: 'bi-20260810-cyber-rates',
    source: 'Business Insurance',
    sourceCode: 'BI',
    pubDate: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    region: 'USA',
    category: 'Commercial Lines',
    author: 'Gavin Souter',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'FEMA Updates National Flood Insurance Program Actuarial Risk Rating 2.0 Benchmarks',
    description: 'Updated Risk Rating 2.0 metrics incorporate refined inland flash flood mapping and coastal storm surge bathymetry, affecting multi-family and commercial asset classes across 18 states.',
    link: 'https://www.insurancejournal.com/news/national/2026/08/08/fema-flood-rating-update.htm',
    guid: 'ij-20260808-fema-rating',
    source: 'Insurance Journal',
    sourceCode: 'IJ',
    pubDate: new Date(Date.now() - 1000 * 60 * 720).toISOString(), // 12 hours ago
    region: 'USA',
    category: 'Property & Casualty',
    author: 'Claire Wilkinson',
    imageUrl: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'US Excess & Surplus Lines Premium Volume Hits Record $82B in Annual Surplus Filings',
    description: 'Wholesale & Specialty Insurance Association (WSIA) reports specialty casualty and wildfire property risks drove double-digit surplus growth as standard admitted markets tightened capacity.',
    link: 'https://www.businessinsurance.com/article/20260805/NEWS06/912345679/excess-surplus-lines-record-filings',
    guid: 'bi-20260805-es-record',
    source: 'Business Insurance',
    sourceCode: 'BI',
    pubDate: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 24 hours ago
    region: 'USA',
    category: 'Commercial Lines',
    author: 'Angela Childers',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  },

  // --- EUROPE REGION ---
  {
    title: "Lloyd's of London Reports Record First-Half Underwriting Profit and 84.2% Combined Ratio",
    description: "The Lloyd's market generated £3.1B in pre-tax underwriting surplus for H1, bolstered by positive prior-year reserve development, robust specialty lines margins, and benign North Atlantic severe weather losses.",
    link: 'https://www.theinsurer.com/news/lloyds-record-first-half-profit-combined-ratio-2026/34567.article',
    guid: 'ti-20260815-lloyds-h1-profit',
    source: 'The Insurer',
    sourceCode: 'TI',
    pubDate: new Date(Date.now() - 1000 * 60 * 50).toISOString(), // 50 mins ago
    region: 'Europe',
    category: 'Reinsurance & ILS',
    author: 'David Benyon',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'EIOPA Publishes Technical Standards on Solvency II 2026 Modernization Directives',
    description: 'The European Insurance and Occupational Pensions Authority (EIOPA) introduced revised capital charges for long-term equity holdings and green infrastructure assets across EU insurers.',
    link: 'https://www.theinsurer.com/regulatory/eiopa-solvency-ii-technical-standards-2026/34568.article',
    guid: 'ti-20260813-eiopa-solvency2',
    source: 'The Insurer',
    sourceCode: 'TI',
    pubDate: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
    region: 'Europe',
    category: 'Regulatory & Risk',
    author: 'Sophie Roberts',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Swiss Re and Munich Re Expand European Secondary Perils Parametric Covers',
    description: 'Continental reinsurers report accelerating demand from German and French primary carriers for index-linked hail, localized flash-flood, and agricultural drought risk transfer facilities.',
    link: 'https://www.theinsurer.com/reinsurance/swiss-re-munich-re-secondary-perils-parametric/34569.article',
    guid: 'ti-20260811-parametric-perils',
    source: 'The Insurer',
    sourceCode: 'TI',
    pubDate: new Date(Date.now() - 1000 * 60 * 480).toISOString(), // 8 hours ago
    region: 'Europe',
    category: 'Reinsurance & ILS',
    author: 'Michael Loney',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'London Market Casualty Treaty Pricing Hardens Amid US Emerging Mass Tort Exposure',
    description: 'European retrocessionaires require heightened retention attachment points on casualty quota shares exposed to PFAS remediation litigation and US commercial fleet nuclear verdicts.',
    link: 'https://www.theinsurer.com/casualty/london-market-casualty-treaty-hardening-2026/34570.article',
    guid: 'ti-20260807-london-casualty',
    source: 'The Insurer',
    sourceCode: 'TI',
    pubDate: new Date(Date.now() - 1000 * 60 * 960).toISOString(), // 16 hours ago
    region: 'Europe',
    category: 'Commercial Lines',
    author: 'Adam McNestrie',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
  },

  // --- ASIA REGION ---
  {
    title: 'IRDAI Reports FY2026-27 Q1 Non-Life Gross Direct Premium Crosses ₹87,917 Crore (+10.91% YoY)',
    description: 'General Insurance Council flash data shows Standalone Health Insurers (SAHI) delivered sector-leading 32.89% expansion to ₹12,161 Cr, while private non-life market share strengthened to 56.25%.',
    link: 'https://www.reinsurancene.ws/irdai-q1-non-life-premium-growth-sahi-expands-2026/',
    guid: 'rn-20260816-irdai-q1-expansion',
    source: 'Reinsurance News',
    sourceCode: 'RN',
    pubDate: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 mins ago
    region: 'Asia',
    category: 'Health & Solvency',
    author: 'Luke Gallin',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'GIC Re Bolsters Domestic Capacity as Indian Reinsurance Inward Treaties Expand 18%',
    description: 'General Insurance Corporation of India (GIC Re) capital base and retrocession structure positioned to capture expanding infrastructure, aviation, and cyber underwriting pipelines across South Asia.',
    link: 'https://www.reinsurancene.ws/gic-re-expands-domestic-indian-reinsurance-capacity-2026/',
    guid: 'rn-20260814-gic-re-capacity',
    source: 'Reinsurance News',
    sourceCode: 'RN',
    pubDate: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    region: 'Asia',
    category: 'Reinsurance & ILS',
    author: 'Charlie Wood',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Singapore MAS Launches Asian Catastrophe Data Exchange & Parametric Resilience Hub',
    description: 'Monetary Authority of Singapore (MAS) and ASEAN Disaster Risk Financing Facility unveil high-resolution typhoon and seismic hazard API integration for parametric reinsurance placements.',
    link: 'https://www.theinsurer.com/asia/singapore-mas-catastrophe-data-exchange-hub-2026/34571.article',
    guid: 'ti-20260809-singapore-mas-cat',
    source: 'The Insurer',
    sourceCode: 'TI',
    pubDate: new Date(Date.now() - 1000 * 60 * 600).toISOString(), // 10 hours ago
    region: 'Asia',
    category: 'Regulatory & Risk',
    author: 'James Thaler',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Tokyo Marine and Ping An Form Cross-Border Green Energy Renewable Risk Syndicate',
    description: 'Joint underwriting capacity established for APAC offshore wind farms, grid-scale BESS storage installations, and hydrogen transmission corridors with $1.5B single-risk capacity.',
    link: 'https://www.reinsurancene.ws/tokyo-marine-ping-an-green-energy-syndicate-apac/',
    guid: 'rn-20260806-tokyo-marine-green',
    source: 'Reinsurance News',
    sourceCode: 'RN',
    pubDate: new Date(Date.now() - 1000 * 60 * 1200).toISOString(), // 20 hours ago
    region: 'Asia',
    category: 'Commercial Lines',
    author: 'Steve Evans',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
  },

  // --- GLOBAL REGION ---
  {
    title: 'Global Catastrophe Bond Issuance Reaches Record $16.4B in First Seven Months of 2026',
    description: 'Artemis and Reinsurance News tracking demonstrates record institutional capital deployment into 144A property catastrophe bonds, with average risk margins narrowing by 45 basis points.',
    link: 'https://www.reinsurancene.ws/global-cat-bond-issuance-record-16-billion-2026/',
    guid: 'rn-20260816-global-cat-bond-record',
    source: 'Reinsurance News',
    sourceCode: 'RN',
    pubDate: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    region: 'Global',
    category: 'Reinsurance & ILS',
    author: 'Steve Evans',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Mid-Year 2026 Treaty Renewals Settle at Disciplined Equilibrium Across Tier-1 Reinsurers',
    description: 'Reinsurance executives gather ahead of the Monte Carlo Rendez-Vous, with consensus pointing to orderly capacity supply, stabilized attachment points, and firm retrocession covenants.',
    link: 'https://www.reinsurancene.ws/mid-year-2026-reinsurance-renewals-monte-carlo-outlook/',
    guid: 'rn-20260815-treaty-renewals-monte-carlo',
    source: 'Reinsurance News',
    sourceCode: 'RN',
    pubDate: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
    region: 'Global',
    category: 'Reinsurance & ILS',
    author: 'Luke Gallin',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Global Cyber Reinsurance Capacity Expands 22% as Systemic War Exclusion Wordings Standardize',
    description: 'Clearer contractual drafting for state-sponsored systemic cyber warfare and cloud outage aggregation has unlocked fresh dedicated ILS and collateralized reinsurance capacity.',
    link: 'https://www.theinsurer.com/cyber/global-cyber-reinsurance-capacity-growth-exclusions-2026/34572.article',
    guid: 'ti-20260812-global-cyber-capacity',
    source: 'The Insurer',
    sourceCode: 'TI',
    pubDate: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5 hours ago
    region: 'Global',
    category: 'Commercial Lines',
    author: 'Sophie Roberts',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Aon and Guy Carpenter Release Global Reinsurance Capital Benchmark: $615B Available Capital',
    description: 'Alternative capital grew to $112B, representing 18.2% of total worldwide reinsurance dedicated capital, driven by cat bond returns and collateralized reinsurance vehicles.',
    link: 'https://www.reinsurancene.ws/global-reinsurance-capital-615-billion-aon-guy-carpenter/',
    guid: 'rn-20260809-global-capital-benchmark',
    source: 'Reinsurance News',
    sourceCode: 'RN',
    pubDate: new Date(Date.now() - 1000 * 60 * 800).toISOString(), // 13 hours ago
    region: 'Global',
    category: 'Reinsurance & ILS',
    author: 'Charlie Wood',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  }
];

const SEED_ARTICLES = RAW_SEED_ARTICLES.map((article) => {
  const guidHash = computeHash(article.guid, article.link, article.title);
  return {
    ...article,
    guidHash,
    id: crypto.randomUUID ? crypto.randomUUID() : guidHash.slice(0, 36),
  };
});

const SEED_FEED_SOURCES = [
  {
    id: 'insurance-journal',
    name: 'Insurance Journal',
    sourceCode: 'IJ',
    url: 'https://www.insurancejournal.com/rss/news/',
    fallbackUrl: 'https://www.insurancejournal.com/rss/news/national/',
    region: 'USA',
    category: 'P&C and Commercial',
    status: 'active',
  },
  {
    id: 'reinsurance-news',
    name: 'Reinsurance News',
    sourceCode: 'RN',
    url: 'https://www.reinsurancene.ws/feed/',
    fallbackUrl: 'https://www.reinsurancene.ws/feed/?paged=1',
    region: 'Global',
    category: 'Reinsurance, ILS & Capital',
    status: 'active',
  },
  {
    id: 'the-insurer',
    name: 'The Insurer',
    sourceCode: 'TI',
    url: 'https://www.theinsurer.com/feed/',
    fallbackUrl: 'https://www.theinsurer.com/rss/',
    region: 'Europe',
    category: 'London Market & Global Specialty',
    status: 'active',
  },
  {
    id: 'business-insurance',
    name: 'Business Insurance',
    sourceCode: 'BI',
    url: 'https://www.businessinsurance.com/section/rss?feed=rss',
    fallbackUrl: 'https://www.businessinsurance.com/rss',
    region: 'USA',
    category: 'Commercial Risk & Cyber',
    status: 'active',
  }
];

module.exports = {
  computeHash,
  SEED_ARTICLES,
  SEED_FEED_SOURCES,
};
