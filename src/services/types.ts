export type DataQualityScoreGrade = 'AAA' | 'AA' | 'A' | 'BBB' | 'BB';

export interface VerifiedSource {
  name: string;
  code: string;
  organizationType: 'Government' | 'International Agency' | 'Regulatory Body' | 'Financial Exchange' | 'Verified Research';
  url: string;
  logoUrl?: string;
  verificationStatus: 'Verified Official Source' | 'Audited Regulatory Filing' | 'Real-Time API Feed';
}

export interface DataQualityScore {
  score: number; // 0 - 100
  grade: DataQualityScoreGrade;
  accuracy: number;
  freshness: string;
  sourceAuthority: string;
}

export interface StatisticItem {
  id: string;
  title: string;
  value: string | number;
  numericValue: number;
  unit: string;
  category: string;
  changeYoY: string;
  isPositiveChange: boolean;
  lastUpdated: string;
  timestamp: string;
  updateFrequency: 'Every Minute' | 'Every 15 Minutes' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  source: VerifiedSource;
  qualityScore: DataQualityScore;
  citation: string;
  downloadUrl?: string;
  tags: string[];
}

export interface FinancialStatement {
  fiscalYear: string;
  period: string;
  revenue: number; // in Billions USD
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  ebitda: number;
  operatingMargin: number; // %
  profitMargin: number; // %
  freeCashFlow: number;
  totalAssets: number;
  totalLiabilities: number;
  totalDebt: number;
  cashAndEquivalents: number;
  eps: number;
}

export interface CompanyProfileData {
  id: string;
  name: string;
  legalName: string;
  ticker: string;
  exchange: string;
  logoUrl?: string;
  sector: string;
  industry: string;
  headquarters: string;
  country: string;
  countryCode: string;
  founded: string;
  founder: string;
  ceo: string;
  employees: number;
  companyType: 'Public Enterprise' | 'Private Enterprise';
  website: string;
  description: string;
  parentCompany?: string;
  subsidiaries: string[];
  competitors: string[];
  products: string[];
  services: string[];
  socialMedia: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  globalPresenceCount: number;
  marketCap: number; // in Billions USD
  enterpriseValue: number; // in Billions USD
  peRatio: number;
  priceToBook: number;
  dividendYield: number;
  roe: number;
  roa: number;
  mau: string;
  dau: string;
  patentCount: number;
  esgRating: string;
  sustainabilityScore: number;
  carbonEmissions: string;
  segmentRevenue: { segment: string; revenue: number; percentage: number }[];
  regionalRevenue: { region: string; revenue: number; percentage: number }[];
  financialHistory: FinancialStatement[];
  lastUpdated: string;
  source: VerifiedSource;
  qualityScore: DataQualityScore;
}

export interface CountryProfileData {
  code: string;
  name: string;
  flag: string;
  region: string;
  subregion: string;
  capital: string;
  population: number; // in Millions
  gdpNominal: number; // in Trillions USD
  gdpGrowthRate: number; // %
  inflationRate: number; // %
  unemploymentRate: number; // %
  urbanizationRate: number; // %
  gdpPerCapita: number; // USD
  gdpHistory: { year: string; gdp: number }[];
  inflationHistory: { year: string; rate: number }[];
  topExportIndustries: string[];
  sources: VerifiedSource[];
  qualityScore: DataQualityScore;
  lastUpdated: string;
}

export type ExportFormat = 'csv' | 'json' | 'xml' | 'excel' | 'pdf';
