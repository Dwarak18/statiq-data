import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import {
  GOLD_PRIMARY,
  CARD_BACKGROUND,
  GRAPHITE_BORDER,
  TEXT_MAIN,
  TEXT_MUTED,
  baseTooltipStyle,
  baseAxisStyle,
} from '@/utils/chartTheme';

type DatasetKey = 'aapl' | 'fed' | 'ai';

interface DatasetData {
  title: string;
  subtitle: string;
  citation: string;
  cik: string;
  categories: string[];
  series: {
    name: string;
    data: number[];
    unit: string;
  }[];
  accuracyScore: string;
}

const DATASETS: Record<DatasetKey, DatasetData> = {
  aapl: {
    title: 'Apple Inc. (AAPL) SEC 10-K Fundamentals',
    subtitle: 'Audited enterprise revenue, net income, and operating margin (FY2020–FY2024)',
    citation: 'SEC EDGAR Annual Report Form 10-K CIK 0000320193',
    cik: '0000320193',
    categories: ['FY2020', 'FY2021', 'FY2022', 'FY2023', 'FY2024'],
    series: [
      { name: 'Revenue ($B)', data: [274.52, 365.82, 394.33, 383.29, 391.04], unit: '$B' },
      { name: 'Net Income ($B)', data: [57.41, 94.68, 99.80, 96.99, 93.74], unit: '$B' },
      { name: 'Operating Margin (%)', data: [24.1, 29.8, 30.3, 29.8, 31.5], unit: '%' },
    ],
    accuracyScore: 'Grade AAA // 99.8%',
  },
  fed: {
    title: 'US Federal Reserve Target Interest Rate Outlook',
    subtitle: 'Effective Federal Funds Rate and FOMC Projections (2020–2026)',
    citation: 'Federal Reserve Bank of St. Louis (FRED ID: FEDFUNDS)',
    cik: 'FRED-FEDFUNDS',
    categories: ['2020', '2021', '2022', '2023', '2024', '2025*', '2026*'],
    series: [
      { name: 'Target Rate (%)', data: [0.25, 0.25, 4.25, 5.33, 4.83, 3.75, 3.25], unit: '%' },
      { name: 'US 10Y Yield (%)', data: [0.89, 1.45, 3.88, 3.88, 4.21, 4.05, 3.85], unit: '%' },
      { name: 'Core PCE Inflation (%)', data: [1.4, 4.8, 4.7, 2.9, 2.7, 2.3, 2.0], unit: '%' },
    ],
    accuracyScore: 'Grade AAA // 99.9%',
  },
  ai: {
    title: 'Global Enterprise AI Infrastructure Spend',
    subtitle: 'Capital expenditure breakdown across cloud & semiconductor hardware (2020–2026)',
    citation: 'Gartner & IDC Audited Market Reports + SEC 10-K CapEx Notes',
    cik: 'IDC-AI-INFRA-2026',
    categories: ['2020', '2021', '2022', '2023', '2024', '2025*', '2026*'],
    series: [
      { name: 'North America ($B)', data: [12.4, 18.2, 35.0, 68.5, 105.0, 142.0, 185.0], unit: '$B' },
      { name: 'Asia-Pacific ($B)', data: [8.1, 12.5, 24.8, 48.0, 75.0, 110.0, 145.0], unit: '$B' },
      { name: 'Europe ($B)', data: [5.2, 8.0, 15.5, 28.2, 45.0, 65.0, 88.0], unit: '$B' },
    ],
    accuracyScore: 'Grade AAA // 99.7%',
  },
};

export function ProductSurface() {
  const [activeKey, setActiveKey] = useState<DatasetKey>('aapl');
  const [activeMetricIdx, setActiveMetricIdx] = useState(0);

  const dataset = DATASETS[activeKey];
  const activeSeries = dataset.series[activeMetricIdx] || dataset.series[0];

  const chartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      ...baseTooltipStyle,
      formatter: (params: any[]) => {
        if (!params || params.length === 0) return '';
        const item = params[0];
        return `<div class="font-mono text-xs p-1">
          <div class="text-[#77756E] mb-1">${item.name}</div>
          <div class="font-bold text-[#B9684E]">${item.seriesName}: ${item.value} ${activeSeries.unit}</div>
        </div>`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '8%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dataset.categories,
      ...baseAxisStyle,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: TEXT_MUTED,
        fontSize: 11,
        fontFamily: 'JetBrains Mono, monospace',
        formatter: (val: number) => `${val}${activeSeries.unit}`,
      },
      splitLine: baseAxisStyle.splitLine,
    },
    series: [
      {
        name: activeSeries.name,
        type: 'line',
        smooth: true,
        data: activeSeries.data,
        itemStyle: { color: GOLD_PRIMARY },
        lineStyle: { width: 2.5 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(185, 104, 78, 0.20)' },
              { offset: 1, color: 'rgba(185, 104, 78, 0.0)' },
            ],
          },
        },
      },
    ],
  };

  const tabClass = (key: DatasetKey) =>
    activeKey === key
      ? 'bg-[#20201E] text-white font-bold shadow-sm'
      : 'bg-white text-[#77756E] border border-[#DEDDD7] hover:text-[#20201E] hover:border-[#B9684E]/40';

  return (
    <section id="product" className="border-b border-[#DEDDD7] bg-white py-16 sm:py-24">
      <Container>
        {/* Header */}
        <Reveal yOffset={12}>
          <div className="mb-10 max-w-3xl">
            <SectionLabel number="03" text="PRODUCT SURFACE" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#20201E] mt-3">
              Interactive Data Canvas &amp; Financial Dossier Engine
            </h2>
            <p className="text-sm sm:text-base text-[#4F4E49] mt-3 leading-relaxed">
              Explore live financial series, macroeconomic forecasts, and equity fundamentals with primary SEC EDGAR audit lineage.
            </p>
          </div>
        </Reveal>

        {/* Dataset Tab Bar */}
        <Reveal delay={0.1} yOffset={16}>
          <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-[#E9E7E1] pb-4">
            {(['aapl', 'fed', 'ai'] as DatasetKey[]).map((key) => {
              const labels: Record<DatasetKey, string> = {
                aapl: 'Apple Inc. (AAPL)',
                fed: 'US Fed Rates (Macro)',
                ai: 'Enterprise AI Spend',
              };
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => { setActiveKey(key); setActiveMetricIdx(0); }}
                  className={`px-4 py-2 rounded-[6px] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${tabClass(key)}`}
                >
                  {labels[key]}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* 12-Column Grid: Main Chart + Citation Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart Area (8 Columns) */}
          <div className="lg:col-span-8">
            <Reveal delay={0.2} yOffset={16}>
              <div className="rounded-[8px] bg-white border border-[#DEDDD7] overflow-hidden shadow-[0_8px_30px_rgba(20,20,18,0.06)]">
                {/* Canvas Control Bar */}
                <div className="p-4 border-b border-[#E9E7E1] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FBFAF7]">
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#20201E]">
                      {dataset.title}
                    </h3>
                    <p className="text-xs text-[#77756E] font-mono mt-0.5">
                      {dataset.subtitle}
                    </p>
                  </div>

                  {/* Metric Selectors */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {dataset.series.map((s, idx) => (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => setActiveMetricIdx(idx)}
                        className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                          activeMetricIdx === idx
                            ? 'bg-[#EAD8D0] text-[#B9684E] border border-[#B9684E]/40 font-semibold'
                            : 'bg-white text-[#77756E] border border-[#DEDDD7] hover:text-[#20201E]'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ECharts Instance */}
                <div className="p-4 sm:p-6">
                  <ReactECharts
                    option={chartOption}
                    style={{ height: '360px', width: '100%' }}
                    notMerge={true}
                    lazyUpdate={true}
                  />
                  <div className="mt-4 pt-3 border-t border-[#E9E7E1] flex items-center justify-between text-[11px] font-mono text-[#77756E]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#B9684E]" />
                      Lineage Audit: Primary Regulatory Sources
                    </span>
                    <span>Interactive Workspace Preview</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Citation & Metadata Drawer (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            <Reveal delay={0.3} yOffset={16}>
              <div className="rounded-[8px] bg-[#FBFAF7] border border-[#DEDDD7] p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#E9E7E1] pb-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#B9684E] font-bold">
                    Citation Metadata
                  </span>
                  <span className="text-[10px] font-mono text-[#657B6C] bg-[#DCE1DC] border border-[#657B6C]/20 px-2 py-0.5 rounded-[4px]">
                    VERIFIED
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#77756E] font-mono block text-[11px]">Primary Source Citation</span>
                    <span className="text-[#20201E] font-medium leading-tight block mt-0.5">
                      {dataset.citation}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#77756E] font-mono block text-[11px]">Regulatory Identifier</span>
                    <span className="text-[#B9684E] font-mono font-semibold block mt-0.5">
                      {dataset.cik}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#77756E] font-mono block text-[11px]">Quality Rating</span>
                    <span className="text-[#20201E] font-mono font-bold block mt-0.5">
                      {dataset.accuracyScore}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#77756E] font-mono block text-[11px]">Available Formats</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {['Excel (.xlsx)', 'CSV', 'JSON', 'Parquet', 'REST API v4'].map((fmt) => (
                        <span
                          key={fmt}
                          className="px-2 py-0.5 bg-white border border-[#DEDDD7] text-[#77756E] font-mono text-[10px] rounded-[4px]"
                        >
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#E9E7E1] pt-4 space-y-2">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full justify-center font-bold text-xs"
                    onClick={() => window.location.href = '/dataset'}
                  >
                    Open Full Dataset Workspace
                    <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
