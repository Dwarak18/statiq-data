import fs from 'fs';
import path from 'path';

export interface TestResult {
  name: string;
  tier: number;
  passed: boolean;
  message: string;
  details?: string[];
}

export interface SuiteSummary {
  total: number;
  passed: number;
  failed: number;
  results: TestResult[];
}

import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../../');

export function getProjectRoot(): string {
  return PROJECT_ROOT;
}

export function readProjectFile(relativePath: string): string {
  const fullPath = path.join(PROJECT_ROOT, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${relativePath} (full path: ${fullPath})`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

export function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(PROJECT_ROOT, relativePath));
}

export function resolveImportPath(sourceFileRelative: string, importPath: string): string | null {
  // Ignore external npm packages (don't start with . or @/)
  if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
    return null; // external dependency
  }

  const sourceDir = path.dirname(path.join(PROJECT_ROOT, sourceFileRelative));
  let targetPath: string;

  if (importPath.startsWith('@/')) {
    targetPath = path.join(PROJECT_ROOT, 'src', importPath.slice(2));
  } else {
    targetPath = path.resolve(sourceDir, importPath);
  }

  // Check possible extensions
  const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.css', '/index.ts', '/index.tsx', '/index.js'];
  for (const ext of extensions) {
    const candidate = targetPath + ext;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null; // Not found
}

export function extractCssVariables(cssContent: string): Map<string, string> {
  const vars = new Map<string, string>();
  // Match --variable-name: value;
  const regex = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(cssContent)) !== null) {
    const name = match[1].trim();
    const value = match[2].trim();
    vars.set(name, value);
  }
  return vars;
}
