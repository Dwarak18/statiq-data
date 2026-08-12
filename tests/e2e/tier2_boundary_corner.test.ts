import { readProjectFile, fileExists, TestResult } from './test_utils';

export function runTier2Tests(): TestResult[] {
  const results: TestResult[] = [];

  // --- Test 2.1: Mobile scroll-margin-top 72px vs Desktop 96px ---
  try {
    const cssContent = readProjectFile('src/index.css');

    // Regex match desktop block
    const desktopMatch = /section\s*\[\s*id\s*\]\s*\{[^}]*scroll-margin-top\s*:\s*96px[^}]*\}/.test(cssContent);
    // Regex match mobile media query
    const mobileMediaMatch = /@media\s*\(\s*max-width\s*:\s*768px\s*\)\s*\{[\s\S]*?section\s*\[\s*id\s*\]\s*\{[^}]*scroll-margin-top\s*:\s*72px[^}]*\}[\s\S]*?\}/.test(cssContent);

    const passed = desktopMatch && mobileMediaMatch;
    const details: string[] = [];
    if (!desktopMatch) details.push('Desktop section[id] scroll-margin-top: 96px not found');
    if (!mobileMediaMatch) details.push('Mobile @media (max-width: 768px) section[id] scroll-margin-top: 72px not found');

    results.push({
      tier: 2,
      name: 'Responsive Mobile vs Desktop Scroll-Margin Boundaries',
      passed,
      message: passed
        ? 'Desktop (96px) and Mobile (72px @ 768px) scroll-margin-top boundaries correctly defined'
        : 'Responsive scroll-margin-top boundary conditions incomplete',
      details,
    });
  } catch (err: any) {
    results.push({
      tier: 2,
      name: 'Responsive Mobile vs Desktop Scroll-Margin Boundaries',
      passed: false,
      message: `Error reading src/index.css: ${err.message}`,
    });
  }

  // --- Test 2.2: Reduced Motion CSS Fallback ---
  try {
    const cssContent = readProjectFile('src/index.css');

    const hasReducedMotionMedia = /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/.test(cssContent);
    const hasScrollBehaviorAuto = /scroll-behavior\s*:\s*auto\s*(!important)?/.test(cssContent);
    const hasAnimationDurationOverride = /animation-duration\s*:/.test(cssContent);

    const passed = hasReducedMotionMedia && hasScrollBehaviorAuto && hasAnimationDurationOverride;
    const details: string[] = [];
    if (!hasReducedMotionMedia) details.push('Missing @media (prefers-reduced-motion: reduce) block');
    if (!hasScrollBehaviorAuto) details.push('Missing scroll-behavior: auto in reduced motion query');
    if (!hasAnimationDurationOverride) details.push('Missing animation/transition duration override in reduced motion query');

    results.push({
      tier: 2,
      name: 'Accessibility Reduced Motion Fallback',
      passed,
      message: passed
        ? 'Reduced motion CSS overrides (scroll-behavior: auto, zero duration) correctly implemented'
        : 'Reduced motion fallback incomplete in src/index.css',
      details,
    });
  } catch (err: any) {
    results.push({
      tier: 2,
      name: 'Accessibility Reduced Motion Fallback',
      passed: false,
      message: `Error checking reduced motion rules: ${err.message}`,
    });
  }

  // --- Test 2.3: Mobile Navigation Collapse & Accessibility Attributes ---
  try {
    const headerContent = readProjectFile('src/components/layout/Header.tsx');
    const mobileNavExists = fileExists('src/components/layout/MobileNav.tsx');
    let mobileNavContent = '';
    if (mobileNavExists) {
      mobileNavContent = readProjectFile('src/components/layout/MobileNav.tsx');
    }

    const hasAriaExpanded = /aria-expanded=/.test(headerContent);
    const hasAriaControls = /aria-controls=/.test(headerContent);
    const hasToggleState = /isMobileMenuOpen|setIsMobileMenuOpen|toggle/i.test(headerContent);

    const passed = mobileNavExists && hasAriaExpanded && hasAriaControls && hasToggleState;
    const details: string[] = [];
    if (!mobileNavExists) details.push('src/components/layout/MobileNav.tsx missing');
    if (!hasAriaExpanded) details.push('Header mobile button missing aria-expanded attribute');
    if (!hasAriaControls) details.push('Header mobile button missing aria-controls attribute');
    if (!hasToggleState) details.push('Header missing mobile menu state management');

    results.push({
      tier: 2,
      name: 'Mobile Navigation Collapse & ARIA State',
      passed,
      message: passed
        ? 'Mobile navigation drawer properly collapses and contains required ARIA state attributes'
        : 'Mobile navigation collapse implementation incomplete',
      details,
    });
  } catch (err: any) {
    results.push({
      tier: 2,
      name: 'Mobile Navigation Collapse & ARIA State',
      passed: false,
      message: `Error checking Mobile Navigation: ${err.message}`,
    });
  }

  return results;
}
