/**
 * Institutional Financial Chart Theme Helper for STATIQONE
 * Enforces unified obsidian background, gold accent line styles, dark tooltips, and crisp font formatting.
 */

export const GOLD_PRIMARY = '#B9684E';
export const GOLD_HOVER = '#A85B43';
export const GRAPHITE_BORDER = '#DEDDD7';
export const CARD_BACKGROUND = '#FBFAF7';
export const TEXT_MUTED = '#77756E';
export const TEXT_MAIN = '#20201E';
export const COLOR_SUCCESS = '#657B6C';
export const COLOR_DANGER = '#9A5B55';

export const baseChartGrid = {
  left: '3%',
  right: '4%',
  bottom: '10%',
  top: '10%',
  containLabel: true,
};

export const baseTooltipStyle = {
  trigger: 'axis',
  backgroundColor: CARD_BACKGROUND,
  borderColor: GRAPHITE_BORDER,
  textStyle: {
    color: TEXT_MAIN,
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
  },
  borderWidth: 1,
};

export const baseAxisStyle = {
  axisLine: {
    lineStyle: {
      color: GRAPHITE_BORDER,
    },
  },
  axisLabel: {
    color: TEXT_MUTED,
    fontSize: 11,
    fontFamily: 'JetBrains Mono, monospace',
  },
  splitLine: {
    lineStyle: {
      color: 'rgba(222, 221, 215, 0.6)',
      type: 'dashed',
    },
  },
};

/**
 * Generates institutional line series config with primary gold gradient fill
 */
export function createInstitutionalLineSeries(name: string, data: number[], isSecondary = false) {
  const color = isSecondary ? GOLD_HOVER : GOLD_PRIMARY;
  return {
    name,
    type: 'line',
    smooth: true,
    data,
    itemStyle: { color },
    lineStyle: { width: 2.5 },
    areaStyle: !isSecondary
      ? {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(185, 104, 78, 0.35)' },
              { offset: 1, color: 'rgba(185, 104, 78, 0.0)' },
            ],
          },
        }
      : undefined,
  };
}
