import fs from 'fs';
import path from 'path';
import { readProjectFile, resolveImportPath, getProjectRoot, TestResult } from './test_utils';

export function runTier4Tests(): TestResult[] {
  const results: TestResult[] = [];
  const projectRoot = getProjectRoot();

  // --- Test 4.1: Full Marketing Page Composition ---
  try {
    const homeContent = readProjectFile('src/pages/Home.tsx');

    const requiredComponents = [
      'Header',
      'Hero',
      'ProofStrip',
      'IntelligenceFlow',
      'ProductSurface',
      'Capabilities',
      'Methodology',
      'UseCases',
      'Evidence',
      'About',
      'FinalCTA',
      'Footer',
    ];

    const missingImports: string[] = [];
    const missingJSX: string[] = [];

    for (const comp of requiredComponents) {
      const importRegex = new RegExp(`import\\s+.*\\b${comp}\\b.*\\s+from`, 'i');
      const jsxRegex = new RegExp(`<${comp}\\b`, 'i');

      if (!importRegex.test(homeContent)) {
        missingImports.push(comp);
      }
      if (!jsxRegex.test(homeContent)) {
        missingJSX.push(comp);
      }
    }

    const passed = missingImports.length === 0 && missingJSX.length === 0;
    const details: string[] = [];
    if (missingImports.length > 0) details.push(`Missing component imports in Home.tsx: ${missingImports.join(', ')}`);
    if (missingJSX.length > 0) details.push(`Missing component JSX tags in Home.tsx: ${missingJSX.join(', ')}`);

    results.push({
      tier: 4,
      name: 'Full Marketing Page Component Composition (12 Sections)',
      passed,
      message: passed
        ? 'All 12 required marketing section components are imported and rendered in Home.tsx'
        : 'Home.tsx incomplete marketing section composition',
      details,
    });
  } catch (err: any) {
    results.push({
      tier: 4,
      name: 'Full Marketing Page Component Composition (12 Sections)',
      passed: false,
      message: `Error reading Home.tsx: ${err.message}`,
    });
  }

  // --- Test 4.2: Zero Hardcoded Dark Hex Code Classes ---
  try {
    const filesToAudit = [
      'src/pages/Home.tsx',
      'src/components/layout/Header.tsx',
      'src/components/layout/Footer.tsx',
      'src/components/sections/Hero.tsx',
      'src/components/sections/ProofStrip.tsx',
      'src/components/sections/IntelligenceFlow.tsx',
      'src/components/sections/ProductSurface.tsx',
      'src/components/sections/Capabilities.tsx',
      'src/components/sections/Methodology.tsx',
      'src/components/sections/UseCases.tsx',
      'src/components/sections/Evidence.tsx',
      'src/components/sections/About.tsx',
      'src/components/sections/FinalCTA.tsx',
    ];

    const forbiddenDarkRegex = /#(09090B|111111|2A2A2A|C8A45D)/gi;
    const violations: { file: string; match: string }[] = [];

    for (const relFile of filesToAudit) {
      const fullPath = path.join(projectRoot, relFile);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const matches = content.match(forbiddenDarkRegex);
        if (matches) {
          violations.push({ file: relFile, match: `${matches.length} occurrences (${Array.from(new Set(matches)).join(', ')})` });
        }
      }
    }

    const passed = violations.length === 0;
    const details = violations.map((v) => `${v.file}: ${v.match}`);

    results.push({
      tier: 4,
      name: 'Zero Legacy Obsidian Dark Hex Classes',
      passed,
      message: passed
        ? 'Zero legacy dark hex codes (#09090B, #111111, #2A2A2A, #C8A45D) present in Home & section components'
        : `Found hardcoded legacy dark hex values in ${violations.length} files`,
      details,
    });
  } catch (err: any) {
    results.push({
      tier: 4,
      name: 'Zero Legacy Obsidian Dark Hex Classes',
      passed: false,
      message: `Error auditing dark hex classes: ${err.message}`,
    });
  }

  // --- Test 4.3: Zero Broken Imports Across All Source Files ---
  try {
    const getAllTsFiles = (dir: string): string[] => {
      let results: string[] = [];
      const list = fs.readdirSync(dir);
      list.forEach((file) => {
        const full = path.join(dir, file);
        const stat = fs.statSync(full);
        if (stat && stat.isDirectory()) {
          results = results.concat(getAllTsFiles(full));
        } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
          results.push(full);
        }
      });
      return results;
    };

    const srcDir = path.join(projectRoot, 'src');
    const allTsFiles = getAllTsFiles(srcDir);
    const brokenImports: { file: string; importStatement: string }[] = [];

    const importRegex = /import\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]/g;

    for (const fullFilePath of allTsFiles) {
      const relativeFilePath = path.relative(projectRoot, fullFilePath);
      const content = fs.readFileSync(fullFilePath, 'utf8');

      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importSpecifier = match[1];

        // Skip absolute npm package imports
        if (!importSpecifier.startsWith('.') && !importSpecifier.startsWith('@/')) {
          continue;
        }

        const resolved = resolveImportPath(relativeFilePath, importSpecifier);
        if (!resolved) {
          brokenImports.push({ file: relativeFilePath, importStatement: importSpecifier });
        }
      }
    }

    const passed = brokenImports.length === 0;
    const details = brokenImports.map((b) => `${b.file} -> cannot resolve "${b.importStatement}"`);

    results.push({
      tier: 4,
      name: 'Zero Broken Import Paths Across src/',
      passed,
      message: passed
        ? `All import statements across ${allTsFiles.length} source files resolve cleanly`
        : `Found ${brokenImports.length} broken import path(s)`,
      details,
    });
  } catch (err: any) {
    results.push({
      tier: 4,
      name: 'Zero Broken Import Paths Across src/',
      passed: false,
      message: `Error auditing imports: ${err.message}`,
    });
  }

  return results;
}
