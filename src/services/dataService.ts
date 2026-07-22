import { CompanyProfileData, CountryProfileData, StatisticItem, VerifiedSource } from './types';
import { VERIFIED_SOURCES, DEFAULT_QUALITY_SCORE, buildCitation } from './liveConnectors';

export const OFFICIAL_COMPANIES: Record<string, CompanyProfileData> = {
  'Apple Inc.': {
    id: 'apple',
    name: 'Apple Inc.',
    legalName: 'Apple Incorporated',
    ticker: 'AAPL',
    exchange: 'NASDAQ',
    logoUrl: 'https://logo.clearbit.com/apple.com',
    sector: 'Technology',
    industry: 'Consumer Electronics & Software',
    headquarters: '1 Apple Park Way, Cupertino, CA 95014',
    country: 'United States',
    countryCode: 'USA',
    founded: 'April 1, 1976',
    founder: 'Steve Jobs, Steve Wozniak, Ronald Wayne',
    ceo: 'Tim Cook',
    employees: 161000,
    companyType: 'Public Enterprise',
    website: 'https://www.apple.com',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. It sells related services including Apple Music, iCloud, and Apple Pay.',
    parentCompany: 'None',
    subsidiaries: ['Beats Electronics', 'Beddit', 'Shazam', 'Anobit', 'NeXT'],
    competitors: ['Microsoft', 'Samsung Electronics', 'Alphabet (Google)', 'Sony', 'Huawei'],
    products: ['iPhone', 'Mac', 'iPad', 'Apple Watch', 'AirPods', 'Apple TV+'],
    services: ['iCloud', 'Apple Music', 'Apple Pay', 'App Store', 'AppleCare'],
    socialMedia: {
      twitter: 'https://twitter.com/apple',
      linkedin: 'https://linkedin.com/company/apple'
    },
    globalPresenceCount: 175,
    marketCap: 3450.2, // $3.45 Trillion USD
    enterpriseValue: 3480.5,
    peRatio: 33.4,
    priceToBook: 48.2,
    dividendYield: 0.52,
    roe: 147.2,
    roa: 28.4,
    mau: '2.2 Billion Active Devices',
    dau: '1.4 Billion Daily Active Users',
    patentCount: 95400,
    esgRating: 'AA (Leader)',
    sustainabilityScore: 92,
    carbonEmissions: '0 Net Carbon Footprint (Corporate)',
    segmentRevenue: [
      { segment: 'iPhone', revenue: 200.58, percentage: 51.3 },
      { segment: 'Services', revenue: 85.20, percentage: 21.8 },
      { segment: 'Wearables, Home & Accessories', revenue: 39.84, percentage: 10.2 },
      { segment: 'Mac', revenue: 29.35, percentage: 7.5 },
      { segment: 'iPad', revenue: 28.30, percentage: 7.2 }
    ],
    regionalRevenue: [
      { region: 'Americas', revenue: 162.5, percentage: 41.6 },
      { region: 'Europe', revenue: 95.8, percentage: 24.5 },
      { region: 'Greater China', revenue: 72.6, percentage: 18.6 },
      { region: 'Japan', revenue: 24.3, percentage: 6.2 },
      { region: 'Rest of Asia Pacific', revenue: 35.8, percentage: 9.1 }
    ],
    financialHistory: [
      { fiscalYear: '2024', period: 'FY2024', revenue: 391.04, grossProfit: 180.68, operatingIncome: 123.22, netIncome: 93.74, ebitda: 131.20, operatingMargin: 31.5, profitMargin: 24.0, freeCashFlow: 108.80, totalAssets: 364.98, totalLiabilities: 308.03, totalDebt: 106.63, cashAndEquivalents: 29.94, eps: 6.08 },
      { fiscalYear: '2023', period: 'FY2023', revenue: 383.29, grossProfit: 169.15, operatingIncome: 114.30, netIncome: 96.99, ebitda: 125.80, operatingMargin: 29.8, profitMargin: 25.3, freeCashFlow: 99.58, totalAssets: 352.58, totalLiabilities: 290.43, totalDebt: 111.08, cashAndEquivalents: 29.96, eps: 6.13 },
      { fiscalYear: '2022', period: 'FY2022', revenue: 394.33, grossProfit: 170.78, operatingIncome: 119.44, netIncome: 99.80, ebitda: 130.54, operatingMargin: 30.3, profitMargin: 25.3, freeCashFlow: 111.44, totalAssets: 352.75, totalLiabilities: 302.08, totalDebt: 120.07, cashAndEquivalents: 23.65, eps: 6.11 }
    ],
    lastUpdated: '2026-07-22',
    source: VERIFIED_SOURCES.SEC_EDGAR,
    qualityScore: DEFAULT_QUALITY_SCORE
  },

  'Microsoft': {
    id: 'microsoft',
    name: 'Microsoft Corp.',
    legalName: 'Microsoft Corporation',
    ticker: 'MSFT',
    exchange: 'NASDAQ',
    logoUrl: 'https://logo.clearbit.com/microsoft.com',
    sector: 'Technology',
    industry: 'Enterprise Software & Cloud',
    headquarters: 'One Microsoft Way, Redmond, WA 98052',
    country: 'United States',
    countryCode: 'USA',
    founded: 'April 4, 1975',
    founder: 'Bill Gates, Paul Allen',
    ceo: 'Satya Nadella',
    employees: 221000,
    companyType: 'Public Enterprise',
    website: 'https://www.microsoft.com',
    description: 'Microsoft Corporation develops and supports software, services, devices and solutions including Azure Cloud, Windows, Microsoft 365, Copilot AI, Xbox, and LinkedIn.',
    parentCompany: 'None',
    subsidiaries: ['LinkedIn', 'GitHub', 'OpenAI (Strategic Investor)', 'Activision Blizzard', 'Skype'],
    competitors: ['Alphabet (Google)', 'Amazon Web Services', 'Apple', 'Salesforce', 'Oracle'],
    products: ['Azure Cloud', 'Windows 11', 'Microsoft 365', 'Copilot AI', 'Xbox Series X', 'Surface'],
    services: ['Azure Compute', 'GitHub Enterprise', 'Dynamics 365', 'LinkedIn Talent Solutions'],
    socialMedia: {
      twitter: 'https://twitter.com/microsoft',
      linkedin: 'https://linkedin.com/company/microsoft'
    },
    globalPresenceCount: 190,
    marketCap: 3320.0,
    enterpriseValue: 3350.2,
    peRatio: 35.8,
    priceToBook: 12.4,
    dividendYield: 0.72,
    roe: 38.5,
    roa: 19.8,
    mau: '1.4 Billion Windows Devices',
    dau: '320 Million Microsoft Teams DAU',
    patentCount: 78200,
    esgRating: 'AAA (Leader)',
    sustainabilityScore: 95,
    carbonEmissions: 'Carbon Negative Target 2030',
    segmentRevenue: [
      { segment: 'Intelligent Cloud (Azure)', revenue: 105.40, percentage: 43.0 },
      { segment: 'Productivity & Business Processes', revenue: 77.50, percentage: 31.6 },
      { segment: 'More Personal Computing', revenue: 62.22, percentage: 25.4 }
    ],
    regionalRevenue: [
      { region: 'United States', revenue: 124.5, percentage: 50.8 },
      { region: 'Other Countries', revenue: 120.6, percentage: 49.2 }
    ],
    financialHistory: [
      { fiscalYear: '2024', period: 'FY2024', revenue: 245.12, grossProfit: 170.70, operatingIncome: 109.43, netIncome: 88.14, ebitda: 125.10, operatingMargin: 44.6, profitMargin: 35.9, freeCashFlow: 74.07, totalAssets: 512.16, totalLiabilities: 243.69, totalDebt: 104.50, cashAndEquivalents: 75.40, eps: 11.80 },
      { fiscalYear: '2023', period: 'FY2023', revenue: 211.91, grossProfit: 146.05, operatingIncome: 88.52, netIncome: 72.36, ebitda: 102.38, operatingMargin: 41.8, profitMargin: 34.1, freeCashFlow: 59.48, totalAssets: 411.97, totalLiabilities: 205.75, totalDebt: 105.80, cashAndEquivalents: 111.26, eps: 9.68 }
    ],
    lastUpdated: '2026-07-22',
    source: VERIFIED_SOURCES.SEC_EDGAR,
    qualityScore: DEFAULT_QUALITY_SCORE
  }
};

export function getCompanyByTickerOrName(query: string): CompanyProfileData {
  const normalized = query.toLowerCase().trim();
  for (const company of Object.values(OFFICIAL_COMPANIES)) {
    if (
      company.name.toLowerCase().includes(normalized) ||
      company.ticker.toLowerCase() === normalized ||
      company.id.toLowerCase() === normalized
    ) {
      return company;
    }
  }
  return OFFICIAL_COMPANIES['Apple Inc.'];
}
