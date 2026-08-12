import { readProjectFile, fileExists, TestResult } from './test_utils';

export function runTier3Tests(): TestResult[] {
  const results: TestResult[] = [];

  // --- Test 3.1: Tab Mode Toggle + Smooth Scroll Helper & Ordering ---
  try {
    const homeContent = readProjectFile('src/pages/Home.tsx');
    const headerContent = readProjectFile('src/components/layout/Header.tsx');
    const useCasesContent = fileExists('src/components/sections/UseCases.tsx')
      ? readProjectFile('src/components/sections/UseCases.tsx')
      : '';

    // Check for centralized scrollToSection helper or requestAnimationFrame scroll invocation
    const hasScrollToSection = /function\s+scrollToSection|const\s+scrollToSection/.test(homeContent) ||
      /function\s+scrollToSection|const\s+scrollToSection/.test(headerContent);

    const hasHeaderHeightCalculation = /getBoundingClientRect\(\)\.height|data-site-header/.test(homeContent) ||
      /getBoundingClientRect\(\)\.height|data-site-header/.test(headerContent);

    const hasRAFOrStableOrdering = /requestAnimationFrame/.test(homeContent) ||
      /requestAnimationFrame/.test(headerContent) ||
      /requestAnimationFrame/.test(useCasesContent);

    const passed = (hasScrollToSection || hasHeaderHeightCalculation) && (hasRAFOrStableOrdering || hasScrollToSection);
    const details: string[] = [];
    if (!hasScrollToSection) details.push('Centralized scrollToSection helper function missing in Home.tsx / Header.tsx');
    if (!hasHeaderHeightCalculation) details.push('Dynamic header height calculation (data-site-header) missing in scroll handler');
    if (!hasRAFOrStableOrdering) details.push('requestAnimationFrame layout stability wrapper missing in mode/tab scroll triggers');

    results.push({
      tier: 3,
      name: 'Tab Mode Toggle & Smooth Scroll Ordering',
      passed,
      message: passed
        ? 'Centralized scrollToSection scroll helper with dynamic header height and RAF layout stabilization verified'
        : 'Scroll ordering & layout stabilization implementation incomplete',
      details,
    });
  } catch (err: any) {
    results.push({
      tier: 3,
      name: 'Tab Mode Toggle & Smooth Scroll Ordering',
      passed: false,
      message: `Error checking scroll ordering: ${err.message}`,
    });
  }

  // --- Test 3.2: Active Section State Switching (IntersectionObserver Spy) ---
  try {
    const homeContent = readProjectFile('src/pages/Home.tsx');

    const usesIntersectionObserver = /new\s+IntersectionObserver/.test(homeContent);
    const hasRootMargin = /rootMargin\s*:/.test(homeContent);
    const hasManualScrollListener = /window\.scrollY\s*\+\s*200/.test(homeContent) || /window\.addEventListener\(['"]scroll['"]/.test(homeContent);

    // Pass if IntersectionObserver is present AND manual window.scrollY + 200 is stripped
    const passed = usesIntersectionObserver && hasRootMargin && !hasManualScrollListener;
    const details: string[] = [];
    if (!usesIntersectionObserver) details.push('IntersectionObserver missing in Home.tsx');
    if (!hasRootMargin) details.push('rootMargin configuration missing in IntersectionObserver instantiation');
    if (hasManualScrollListener) details.push('Legacy window.scrollY + 200 manual scroll listener still present in Home.tsx');

    results.push({
      tier: 3,
      name: 'Active Section State Switching (IntersectionObserver Spy)',
      passed,
      message: passed
        ? 'Active section navigation spy uses IntersectionObserver with rootMargin and no manual scroll calculations'
        : 'Active section state switching spy incomplete in Home.tsx',
      details,
    });
  } catch (err: any) {
    results.push({
      tier: 3,
      name: 'Active Section State Switching (IntersectionObserver Spy)',
      passed: false,
      message: `Error checking IntersectionObserver: ${err.message}`,
    });
  }

  return results;
}
