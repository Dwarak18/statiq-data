import { readProjectFile, extractCssVariables, TestResult } from './test_utils';

export function runTier1Tests(): TestResult[] {
  const results: TestResult[] = [];

  // --- Test 1.1: Warm Palette Variable Presence in index.css ---
  try {
    const cssContent = readProjectFile('src/index.css');
    const cssVars = extractCssVariables(cssContent);

    const requiredTokens: Record<string, string> = {
      '--color-bg': '#F7F6F2',
      '--color-surface': '#FBFAF7',
      '--color-surface-raised': '#FFFFFF',
      '--color-ink': '#20201E',
      '--color-ink-soft': '#4F4E49',
      '--color-muted': '#77756E',
      '--color-faint': '#9A9890',
      '--color-border': '#DEDDD7',
      '--color-border-soft': '#E9E7E1',
      '--color-accent': '#B9684E',
      '--color-accent-hover': '#A85B43',
      '--color-accent-soft': '#EAD8D0',
      '--color-sage': '#7D8A82',
      '--color-sage-soft': '#DCE1DC',
      '--color-success': '#657B6C',
      '--color-warning': '#A6845C',
      '--color-error': '#9A5B55',
      '--data-primary': '#667A70',
      '--data-secondary': '#B9684E',
      '--data-tertiary': '#A8ADA4',
      '--data-neutral': '#D7D5CE',
      '--radius-sm': '4px',
      '--radius-md': '8px',
      '--radius-lg': '14px',
    };

    const missingTokens: string[] = [];
    const mismatchedTokens: string[] = [];

    for (const [token, expectedValue] of Object.entries(requiredTokens)) {
      if (!cssVars.has(token)) {
        missingTokens.push(token);
      } else {
        const actual = cssVars.get(token)?.toUpperCase();
        const expected = expectedValue.toUpperCase();
        if (actual !== expected) {
          mismatchedTokens.push(`${token} (expected ${expected}, got ${actual})`);
        }
      }
    }

    if (missingTokens.length === 0 && mismatchedTokens.length === 0) {
      results.push({
        tier: 1,
        name: 'Warm Palette & Design Tokens Presence',
        passed: true,
        message: 'All 24 Warm Intelligence color, data viz, and radius tokens present in src/index.css',
      });
    } else {
      results.push({
        tier: 1,
        name: 'Warm Palette & Design Tokens Presence',
        passed: false,
        message: 'Missing or mismatched tokens in src/index.css',
        details: [
          ...missingTokens.map((t) => `Missing token: ${t}`),
          ...mismatchedTokens.map((t) => `Mismatched token: ${t}`),
        ],
      });
    }
  } catch (err: any) {
    results.push({
      tier: 1,
      name: 'Warm Palette & Design Tokens Presence',
      passed: false,
      message: `Error reading src/index.css: ${err.message}`,
    });
  }

  // --- Test 1.2: data-site-header Attribute on Header ---
  try {
    const headerContent = readProjectFile('src/components/layout/Header.tsx');
    const hasDataSiteHeader = /<header[\s\S]*?data-site-header[\s\S]*?>/.test(headerContent);

    results.push({
      tier: 1,
      name: 'Header data-site-header Attribute',
      passed: hasDataSiteHeader,
      message: hasDataSiteHeader
        ? 'Header component properly includes data-site-header attribute'
        : 'Header component in src/components/layout/Header.tsx missing data-site-header attribute on <header> element',
    });
  } catch (err: any) {
    results.push({
      tier: 1,
      name: 'Header data-site-header Attribute',
      passed: false,
      message: `Error reading Header.tsx: ${err.message}`,
    });
  }

  // --- Test 1.3: Section scroll-margin-top CSS Rules ---
  try {
    const cssContent = readProjectFile('src/index.css');

    const hasSectionScrollMargin = /section\s*\[\s*id\s*\]\s*\{[\s\S]*?scroll-margin-top\s*:\s*96px/.test(cssContent);
    const hasMobileScrollMargin = /@media[\s\S]*?max-width:\s*768px[\s\S]*?section\s*\[\s*id\s*\]\s*\{[\s\S]*?scroll-margin-top\s*:\s*72px/.test(cssContent);

    const passed = hasSectionScrollMargin && hasMobileScrollMargin;
    const details: string[] = [];
    if (!hasSectionScrollMargin) details.push('Missing desktop section[id] scroll-margin-top: 96px');
    if (!hasMobileScrollMargin) details.push('Missing mobile @media (max-width: 768px) section[id] scroll-margin-top: 72px');

    results.push({
      tier: 1,
      name: 'Section scroll-margin-top Rules',
      passed,
      message: passed
        ? 'Section scroll-margin-top rules (96px desktop / 72px mobile) verified in src/index.css'
        : 'Section scroll-margin-top rules incomplete in src/index.css',
      details,
    });
  } catch (err: any) {
    results.push({
      tier: 1,
      name: 'Section scroll-margin-top Rules',
      passed: false,
      message: `Error checking scroll-margin-top in index.css: ${err.message}`,
    });
  }

  // --- Test 1.4: Editorial Row Structures in Section Components ---
  try {
    const sectionsToCheck = [
      { name: 'ProofStrip', file: 'src/components/sections/ProofStrip.tsx' },
      { name: 'IntelligenceFlow', file: 'src/components/sections/IntelligenceFlow.tsx' },
      { name: 'Capabilities', file: 'src/components/sections/Capabilities.tsx' },
      { name: 'Methodology', file: 'src/components/sections/Methodology.tsx' },
      { name: 'Evidence', file: 'src/components/sections/Evidence.tsx' },
    ];

    const failedSections: string[] = [];

    for (const sec of sectionsToCheck) {
      const content = readProjectFile(sec.file);
      // Look for numbered editorial row pattern like "01", "01 —", or editorial list items
      const hasNumberedRowPattern = /\b01\b/.test(content) || /numbered/i.test(content) || /editorial/i.test(content);
      if (!hasNumberedRowPattern) {
        failedSections.push(sec.name);
      }
    }

    results.push({
      tier: 1,
      name: 'Editorial Row Structure in Key Sections',
      passed: failedSections.length === 0,
      message: failedSections.length === 0
        ? 'All key section components incorporate editorial numbered row structure'
        : `Sections missing editorial numbered row structure: ${failedSections.join(', ')}`,
    });
  } catch (err: any) {
    results.push({
      tier: 1,
      name: 'Editorial Row Structure in Key Sections',
      passed: false,
      message: `Error checking section components: ${err.message}`,
    });
  }

  // --- Test 1.5: Plus Jakarta Sans Font Loading ---
  try {
    const cssContent = readProjectFile('src/index.css');
    const htmlContent = readProjectFile('index.html');

    const cssFontHeading = /--font-heading\s*:\s*['"]?Plus Jakarta Sans['"]?/i.test(cssContent);
    const fontImported = /Plus\+Jakarta\+Sans/i.test(htmlContent) || /Plus Jakarta Sans/i.test(cssContent);

    const passed = cssFontHeading && fontImported;
    const details: string[] = [];
    if (!cssFontHeading) details.push('--font-heading in src/index.css does not specify Plus Jakarta Sans');
    if (!fontImported) details.push('Plus Jakarta Sans font link/import missing from index.html / index.css');

    results.push({
      tier: 1,
      name: 'Plus Jakarta Sans Font Loading & Config',
      passed,
      message: passed
        ? 'Plus Jakarta Sans font correctly loaded and configured as heading font'
        : 'Plus Jakarta Sans font loading configuration incomplete',
      details,
    });
  } catch (err: any) {
    results.push({
      tier: 1,
      name: 'Plus Jakarta Sans Font Loading & Config',
      passed: false,
      message: `Error checking font configuration: ${err.message}`,
    });
  }

  return results;
}
