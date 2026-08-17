/**
 * STATIQONE Institutional Market Intelligence: Insurance Industry in India
 * Compiled from official IRDAI Flash Figures (upto June 2026 for FY 2026-27),
 * GI Council Financial Highlights (FY 2024-25 / FY 2025-26), and Regulatory Audit Disclosures.
 */

export interface MarketSummary {
  period: string;
  totalGrossDirectPremium: number; // in Rs Crore
  yoyGrowthRate: number; // percentage
  accretion: number; // in Rs Crore
  totalPoliciesEstimate: string;
  solvencyAverage: number;
  healthMarketShare: number;
  motorMarketShare: number;
}

export interface SegmentData {
  segment: string;
  premiumJune2026: number; // in Rs Cr
  premiumJune2025: number; // in Rs Cr
  growthRate: number; // percentage
  marketShare: number; // percentage
  accretion: number; // in Rs Cr
  category: 'Health' | 'Motor' | 'Commercial' | 'Specialized' | 'Misc';
}

export interface InsurerPerformance {
  rank: number;
  name: string;
  shortName: string;
  type: 'Public' | 'Private' | 'SAHI' | 'Specialized';
  premiumJune2026: number; // in Rs Cr
  premiumJune2025: number; // in Rs Cr
  growthRate: number; // percentage
  marketShare: number; // percentage
  accretion: number; // in Rs Cr
  keyStrength: string;
}

export interface SectorShare {
  sector: string;
  premiumJune2026: number;
  marketShare: number;
  growthRate: number;
  color: string;
}

export interface FinancialRatio {
  category: string;
  netRetentionRatio: number; // %
  incurredClaimsRatio: number; // %
  commissionRatio: number; // %
  expenseRatio: number; // %
  operatingProfitCr: number; // Rs Cr
}

export const OVERALL_MARKET_SUMMARY: MarketSummary = {
  period: 'FY 2026-27 (Upto June 2026 - Q1 Flash Figures)',
  totalGrossDirectPremium: 87917.63,
  yoyGrowthRate: 10.91,
  accretion: 8645.93,
  totalPoliciesEstimate: '290 Million+',
  solvencyAverage: 2.10,
  healthMarketShare: 44.14,
  motorMarketShare: 30.06,
};

export const SECTOR_TYPES_JUNE_2026: SectorShare[] = [
  { sector: 'Private General Insurers', premiumJune2026: 49454.96, marketShare: 56.25, growthRate: 11.45, color: '#3B82F6' },
  { sector: 'Public Sector Insurers (PSUs)', premiumJune2026: 26031.08, marketShare: 29.61, growthRate: 2.65, color: '#10B981' },
  { sector: 'Standalone Health Insurers (SAHI)', premiumJune2026: 12161.27, marketShare: 13.83, growthRate: 32.89, color: '#C8A45D' },
  { sector: 'Specialized Insurers (AIC/ECGC)', premiumJune2026: 270.32, marketShare: 0.31, growthRate: 7.09, color: '#8B5CF6' },
];

export const SEGMENT_BREAKDOWN_JUNE_2026: SegmentData[] = [
  { segment: 'Health - Group Insurance', premiumJune2026: 23200.08, premiumJune2025: 19456.44, growthRate: 19.24, marketShare: 26.39, accretion: 3743.64, category: 'Health' },
  { segment: 'Health - Retail Insurance', premiumJune2026: 11238.92, premiumJune2025: 9456.44, growthRate: 18.85, marketShare: 12.78, accretion: 1782.48, category: 'Health' },
  { segment: 'Health - Government Schemes', premiumJune2026: 2360.35, premiumJune2025: 1893.45, growthRate: 24.66, marketShare: 2.68, accretion: 466.90, category: 'Health' },
  { segment: 'Motor - Third Party (TP)', premiumJune2026: 15419.12, premiumJune2025: 13743.66, growthRate: 12.19, marketShare: 17.54, accretion: 1675.46, category: 'Motor' },
  { segment: 'Motor - Own Damage (OD)', premiumJune2026: 11006.59, premiumJune2025: 9456.44, growthRate: 16.39, marketShare: 12.52, accretion: 1550.15, category: 'Motor' },
  { segment: 'Fire Insurance', premiumJune2026: 8109.92, premiumJune2025: 7548.00, growthRate: 7.44, marketShare: 9.22, accretion: 561.92, category: 'Commercial' },
  { segment: 'Personal Accident (P.A.)', premiumJune2026: 4691.63, premiumJune2025: 3182.45, growthRate: 47.42, marketShare: 5.34, accretion: 1509.18, category: 'Health' },
  { segment: 'Crop & All Other Miscellaneous', premiumJune2026: 3082.79, premiumJune2025: 3644.94, growthRate: -15.42, marketShare: 3.51, accretion: -562.15, category: 'Misc' },
  { segment: 'Marine Insurance (Cargo & Hull)', premiumJune2026: 2320.88, premiumJune2025: 1733.49, growthRate: 33.88, marketShare: 2.64, accretion: 587.39, category: 'Commercial' },
  { segment: 'Liability Insurance', premiumJune2026: 2124.57, premiumJune2025: 1893.45, growthRate: 12.21, marketShare: 2.42, accretion: 231.12, category: 'Commercial' },
  { segment: 'Engineering Insurance', premiumJune2026: 2015.21, premiumJune2025: 1770.59, growthRate: 13.82, marketShare: 2.29, accretion: 244.62, category: 'Commercial' },
  { segment: 'Aviation Insurance', premiumJune2026: 342.73, premiumJune2025: 247.70, growthRate: 38.36, marketShare: 0.39, accretion: 95.03, category: 'Specialized' },
];

export const TOP_INSURERS_JUNE_2026: InsurerPerformance[] = [
  { rank: 1, name: 'The New India Assurance Co Ltd', shortName: 'New India Assurance', type: 'Public', premiumJune2026: 12700.74, premiumJune2025: 12299.49, growthRate: 3.26, marketShare: 14.45, accretion: 401.25, keyStrength: 'Largest PSU, Dominant Commercial & Motor Portfolio' },
  { rank: 2, name: 'ICICI Lombard General Insurance Co Ltd', shortName: 'ICICI Lombard', type: 'Private', premiumJune2026: 8317.89, premiumJune2025: 7734.86, growthRate: 7.54, marketShare: 9.46, accretion: 583.03, keyStrength: '#1 Private General Insurer, Strong Tech Integration' },
  { rank: 3, name: 'Tata AIG General Insurance Co Ltd', shortName: 'Tata AIG', type: 'Private', premiumJune2026: 6558.63, premiumJune2025: 4886.48, growthRate: 34.22, marketShare: 7.46, accretion: 1672.15, keyStrength: 'Fastest Growing Major Private Insurer, Retail Surge' },
  { rank: 4, name: 'The Oriental Insurance Co Ltd', shortName: 'Oriental Insurance', type: 'Public', premiumJune2026: 6246.73, premiumJune2025: 5824.15, growthRate: 7.26, marketShare: 7.11, accretion: 422.58, keyStrength: 'Strong Public Sector Network & Group Health' },
  { rank: 5, name: 'Bajaj Allianz General Insurance Co Ltd', shortName: 'Bajaj Allianz', type: 'Private', premiumJune2026: 5768.81, premiumJune2025: 5170.54, growthRate: 11.57, marketShare: 6.56, accretion: 598.27, keyStrength: 'High Profitability, Strong Agent & Bank Channel' },
  { rank: 6, name: 'United India Insurance Co Ltd', shortName: 'United India', type: 'Public', premiumJune2026: 5725.79, premiumJune2025: 5665.69, growthRate: 1.06, marketShare: 6.51, accretion: 60.10, keyStrength: 'Deep Penetration in Tier 2/3 Markets' },
  { rank: 7, name: 'Star Health & Allied Insurance Co Ltd', shortName: 'Star Health', type: 'SAHI', premiumJune2026: 4287.09, premiumJune2025: 3597.08, growthRate: 19.18, marketShare: 4.88, accretion: 690.01, keyStrength: '#1 Standalone Health Insurer, 650k+ Agency Force' },
  { rank: 8, name: 'HDFC Ergo General Insurance Co Ltd', shortName: 'HDFC ERGO', type: 'Private', premiumJune2026: 4125.27, premiumJune2025: 3420.67, growthRate: 20.60, marketShare: 4.69, accretion: 704.60, keyStrength: 'HDFC Bank Ecosystem Synergy, High Digital Conversion' },
  { rank: 9, name: 'National Insurance Co Ltd', shortName: 'National Insurance', type: 'Public', premiumJune2026: 4097.36, premiumJune2025: 3969.24, growthRate: 3.23, marketShare: 4.66, accretion: 128.12, keyStrength: 'Pan-India Footprint, Eastern Region Leader' },
  { rank: 10, name: 'SBI General Insurance Co Ltd', shortName: 'SBI General', type: 'Private', premiumJune2026: 3506.27, premiumJune2025: 3163.07, growthRate: 10.85, marketShare: 3.99, accretion: 343.20, keyStrength: 'SBI Bancassurance Network, Crop & Micro Insurance' },
  { rank: 11, name: 'Care Health Insurance Ltd', shortName: 'Care Health', type: 'SAHI', premiumJune2026: 2927.16, premiumJune2025: 2049.43, growthRate: 42.83, marketShare: 3.33, accretion: 877.73, keyStrength: 'Hyper-growth in Retail Health & Corporate Wellness' },
  { rank: 12, name: 'IFFCO-Tokio General Insurance Co Ltd', shortName: 'IFFCO Tokio', type: 'Private', premiumJune2026: 2229.83, premiumJune2025: 2023.14, growthRate: 10.22, marketShare: 2.54, accretion: 206.69, keyStrength: 'Rural & Agri-Cooperative Network Integration' },
  { rank: 13, name: 'Aditya Birla Health Insurance Co Ltd', shortName: 'Aditya Birla Health', type: 'SAHI', premiumJune2026: 2149.96, premiumJune2025: 1631.90, growthRate: 31.75, marketShare: 2.45, accretion: 518.06, keyStrength: 'Incentivized Wellness App & Direct-to-Consumer' },
  { rank: 14, name: 'Niva Bupa Health Insurance Co Ltd', shortName: 'Niva Bupa', type: 'SAHI', premiumJune2026: 2005.36, premiumJune2025: 1326.65, growthRate: 51.16, marketShare: 2.28, accretion: 678.71, keyStrength: 'Highest Growth Rate in SAHI Segment' },
  { rank: 15, name: 'Go Digit General Insurance Ltd', shortName: 'Go Digit', type: 'Private', premiumJune2026: 2446.77, premiumJune2025: 2507.33, growthRate: -2.42, marketShare: 2.78, accretion: -60.56, keyStrength: 'Digital Native Insurtech, API-first Underwriting' },
  { rank: 16, name: 'Universal Sompo General Insurance Co Ltd', shortName: 'Universal Sompo', type: 'Private', premiumJune2026: 1750.62, premiumJune2025: 1311.43, growthRate: 33.49, marketShare: 1.99, accretion: 439.19, keyStrength: 'Bank Joint Venture (Indian Bank, IOB)' },
  { rank: 17, name: 'Cholamandalam MS General Insurance Co Ltd', shortName: 'Chola MS', type: 'Private', premiumJune2026: 1859.92, premiumJune2025: 1812.14, growthRate: 2.64, marketShare: 2.12, accretion: 47.78, keyStrength: 'Commercial Vehicle & Auto Dealer Tie-ups' },
  { rank: 18, name: 'Royal Sundaram General Insurance Co Ltd', shortName: 'Royal Sundaram', type: 'Private', premiumJune2026: 1285.05, premiumJune2025: 1160.24, growthRate: 10.76, marketShare: 1.46, accretion: 124.81, keyStrength: 'Pioneer Private Insurer, Strong Affinity Partners' },
  { rank: 19, name: 'Shriram General Insurance Co Ltd', shortName: 'Shriram General', type: 'Private', premiumJune2026: 1179.69, premiumJune2025: 960.38, growthRate: 22.84, marketShare: 1.34, accretion: 219.31, keyStrength: 'Commercial Vehicle & Heavy Transport Finance' },
  { rank: 20, name: 'Acko General Insurance Ltd', shortName: 'Acko General', type: 'Private', premiumJune2026: 749.30, premiumJune2025: 526.66, growthRate: 42.27, marketShare: 0.85, accretion: 222.64, keyStrength: 'Embedded Digital Motor & Travel Insurance' },
];

export const FINANCIAL_RATIO_HIGHLIGHTS: FinancialRatio[] = [
  { category: 'Private Sector Insurers', netRetentionRatio: 74.9, incurredClaimsRatio: 69.8, commissionRatio: 10.0, expenseRatio: 23.5, operatingProfitCr: 2445.23 },
  { category: 'Public Sector Insurers (PSUs)', netRetentionRatio: 86.2, incurredClaimsRatio: 90.4, commissionRatio: 5.4, expenseRatio: 28.6, operatingProfitCr: -193.38 },
  { category: 'Standalone Health Insurers (SAHI)', netRetentionRatio: 68.8, incurredClaimsRatio: 66.3, commissionRatio: 14.5, expenseRatio: 25.8, operatingProfitCr: 663.93 },
  { category: 'Specialized Insurers (AIC/ECGC)', netRetentionRatio: 91.3, incurredClaimsRatio: 73.8, commissionRatio: 2.1, expenseRatio: 12.5, operatingProfitCr: 500.17 },
];

export const INDUSTRY_INFRASTRUCTURE = {
  totalEmployees: '155,000+',
  totalBranchOffices: '12,500+',
  totalPoliciesIssued: '290 Million+',
  pospPersonnel: '1.20 Million+',
  foreignDirectInvestmentCr: 12012.22,
  industryCapitalReservesCr: 67605.00,
  averageSolvencyRatio: 2.10,
};
