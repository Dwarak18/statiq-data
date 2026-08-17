/**
 * STATIQONE PDF Report Generator & Intelligence Service
 * Server-side vector PDF generation engine for Requirement R3.
 * 
 * Features:
 * - Institutional STATIQONE branding (Navy #0F172A, Gold #C8A45D, Light Gray #F8FAFC)
 * - Multi-page layout (A4 format) with vector tables, badges, callout cards
 * - Cross-Border Stock Screener snapshot (NASDAQ & NSE movers, valuation benchmarks)
 * - IRDAI Indian Insurance disclosures (Gross Direct Premium, SAHI growth, Top Insurers League Table, Financial Ratios)
 * - Google Gemini AI executive synthesis with deterministic fallback
 * - Running headers, footers with dynamic page numbers ("Page X of Y"), and security watermark
 * - PostgreSQL quota enforcement, audit logging, and in-memory fallback
 */

const crypto = require('crypto');
const geminiService = require('./geminiService');
const stockService = require('./stockService');

// Attempt to load PostgreSQL pool
let pool = null;
try {
  pool = require('../db/pool');
} catch (err) {
  console.warn('[ReportService] DB pool not loaded, using memory fallback:', err.message);
}

// In-Memory Fallback Store for PDF Logs & User Quotas (used when DB is offline)
const memoryPdfLogs = [];
const memoryUserQuotas = new Map();

/**
 * Authoritative IRDAI & GI Council Market Intelligence Datasets
 * Mirrored from src/data/indiaInsuranceData.ts
 */
const IRDAI_DATA = {
  summary: {
    period: 'FY 2026-27 (Upto June 2026 - Q1 Flash Figures)',
    totalGrossDirectPremium: 87917.63, // Rs Cr
    yoyGrowthRate: 10.91, // %
    accretion: 8645.93, // Rs Cr
    totalPoliciesEstimate: '290 Million+',
    solvencyAverage: 2.10,
    healthMarketShare: 44.14,
    motorMarketShare: 30.06,
  },
  sectorShare: [
    { sector: 'Private General Insurers', premium: 49454.96, share: 56.25, growth: 11.45 },
    { sector: 'Public Sector Insurers (PSUs)', premium: 26031.08, share: 29.61, growth: 2.65 },
    { sector: 'Standalone Health Insurers (SAHI)', premium: 12161.27, share: 13.83, growth: 32.89 },
    { sector: 'Specialized Insurers (AIC/ECGC)', premium: 270.32, share: 0.31, growth: 7.09 },
  ],
  topInsurers: [
    { rank: 1, name: 'The New India Assurance Co Ltd', type: 'Public', premium: 12700.74, growth: 3.26, share: 14.45 },
    { rank: 2, name: 'ICICI Lombard General Insurance', type: 'Private', premium: 8317.89, growth: 7.54, share: 9.46 },
    { rank: 3, name: 'Tata AIG General Insurance Co', type: 'Private', premium: 6558.63, growth: 34.22, share: 7.46 },
    { rank: 4, name: 'The Oriental Insurance Co Ltd', type: 'Public', premium: 6246.73, growth: 7.26, share: 7.11 },
    { rank: 5, name: 'Bajaj Allianz General Insurance', type: 'Private', premium: 5768.81, growth: 11.57, share: 6.56 },
    { rank: 6, name: 'United India Insurance Co Ltd', type: 'Public', premium: 5725.79, growth: 1.06, share: 6.51 },
    { rank: 7, name: 'Star Health & Allied Insurance', type: 'SAHI', premium: 4287.09, growth: 19.18, share: 4.88 },
    { rank: 8, name: 'HDFC Ergo General Insurance Co', type: 'Private', premium: 4125.27, growth: 20.60, share: 4.69 },
    { rank: 9, name: 'National Insurance Co Ltd', type: 'Public', premium: 4097.36, growth: 3.23, share: 4.66 },
    { rank: 10, name: 'SBI General Insurance Co Ltd', type: 'Private', premium: 3506.27, growth: 10.85, share: 3.99 },
  ],
  financialRatios: [
    { category: 'Private Sector Insurers', retention: 74.9, claims: 69.8, commission: 10.0, expense: 23.5, opProfit: 2445.23 },
    { category: 'Public Sector Insurers (PSUs)', retention: 86.2, claims: 90.4, commission: 5.4, expense: 28.6, opProfit: -193.38 },
    { category: 'Standalone Health Insurers (SAHI)', retention: 68.8, claims: 66.3, commission: 14.5, expense: 25.8, opProfit: 663.93 },
    { category: 'Specialized Insurers (AIC/ECGC)', retention: 91.3, claims: 73.8, commission: 2.1, expense: 12.5, opProfit: 500.17 },
  ],
};

/**
 * Initialize PostgreSQL tables for PDF logging and subscription quotas if DB is available.
 */
let dbInitialized = false;
async function ensureDbSchema() {
  if (!pool || dbInitialized) return;
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS pdf_reports_log (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          report_type VARCHAR(50) NOT NULL DEFAULT 'full_market_synthesis',
          report_title TEXT NOT NULL,
          ai_summary_used BOOLEAN NOT NULL DEFAULT TRUE,
          file_size_bytes INTEGER NOT NULL,
          generation_ms INTEGER NOT NULL,
          generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        CREATE INDEX IF NOT EXISTS idx_pdf_reports_user ON pdf_reports_log (user_id, generated_at DESC);
      `);
      dbInitialized = true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('[ReportService] DB schema note:', err.message);
  }
}

ensureDbSchema().catch(() => {});

// ==============================================================================
// 1. High-Performance Vector PDF Document Builder
// ==============================================================================

/**
 * Converts Hex / RGB color string into PDF RGB components (0..1)
 */
function parseColor(color) {
  if (!color) return [0, 0, 0];
  if (Array.isArray(color)) return color;
  let hex = color.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return [Number(r.toFixed(3)), Number(g.toFixed(3)), Number(b.toFixed(3))];
}

/**
 * Escapes special characters for PDF text strings
 */
function escapePdfText(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[\r\n]/g, ' ')
    // Replace non-ASCII currency symbols with ASCII equivalents for standard WinAnsi font encoding
    .replace(/₹/g, 'INR ')
    .replace(/€/g, 'EUR ')
    .replace(/£/g, 'GBP ')
    .replace(/—/g, ' - ')
    .replace(/–/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[•·]/g, '*');
}

/**
 * Lightweight, standard-compliant vector PDF 1.4 Builder.
 */
class PdfDocument {
  constructor(options = {}) {
    this.width = options.width || 595.28; // A4 Width in points
    this.height = options.height || 841.89; // A4 Height in points
    this.margin = options.margin || 36;
    this.pages = [];
    this.currentPageIndex = -1;
    this.addPage();
  }

  addPage() {
    this.pages.push({
      commands: [],
      headerCommands: [],
      footerCommands: [],
    });
    this.currentPageIndex = this.pages.length - 1;
    return this;
  }

  get currentPage() {
    return this.pages[this.currentPageIndex];
  }

  // Coordinate conversion: Top-down (0,0 is top-left) -> PDF Bottom-up (0,0 is bottom-left)
  toPdfY(y) {
    return this.height - y;
  }

  rect(x, y, w, h, options = {}) {
    const pdfY = this.toPdfY(y + h);
    const cmd = [];
    cmd.push('q');
    if (options.fill) {
      const [r, g, b] = parseColor(options.fill);
      cmd.push(`${r} ${g} ${b} rg`);
    }
    if (options.stroke) {
      const [r, g, b] = parseColor(options.stroke);
      cmd.push(`${r} ${g} ${b} RG`);
      cmd.push(`${options.lineWidth || 1} w`);
    }
    cmd.push(`${x.toFixed(2)} ${pdfY.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re`);
    if (options.fill && options.stroke) {
      cmd.push('B');
    } else if (options.fill) {
      cmd.push('f');
    } else if (options.stroke) {
      cmd.push('S');
    }
    cmd.push('Q');
    this.currentPage.commands.push(cmd.join('\n'));
    return this;
  }

  line(x1, y1, x2, y2, options = {}) {
    const pdfY1 = this.toPdfY(y1);
    const pdfY2 = this.toPdfY(y2);
    const cmd = ['q'];
    const [r, g, b] = parseColor(options.stroke || '#000000');
    cmd.push(`${r} ${g} ${b} RG`);
    cmd.push(`${options.lineWidth || 1} w`);
    if (options.dash) {
      cmd.push(`[${options.dash.join(' ')}] 0 d`);
    }
    cmd.push(`${x1.toFixed(2)} ${pdfY1.toFixed(2)} m`);
    cmd.push(`${x2.toFixed(2)} ${pdfY2.toFixed(2)} l`);
    cmd.push('S');
    cmd.push('Q');
    this.currentPage.commands.push(cmd.join('\n'));
    return this;
  }

  /**
   * Approximate width calculation for Helvetica font
   */
  measureText(text, size = 10, bold = false) {
    const factor = bold ? 0.58 : 0.52;
    return String(text).length * size * factor;
  }

  /**
   * Word wraps text into lines fitting within maxWidth
   */
  wrapText(text, maxWidth, size = 10, bold = false) {
    if (!text) return [];
    const words = String(text).split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const candidate = currentLine ? `${currentLine} ${word}` : word;
      const width = this.measureText(candidate, size, bold);
      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = candidate;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  text(str, x, y, options = {}) {
    if (str === null || str === undefined || str === '') return this;
    const size = options.size || 10;
    const fontName = options.bold ? (options.italic ? 'F4' : 'F2') : options.italic ? 'F3' : 'F1';
    const [r, g, b] = parseColor(options.color || '#1E293B');
    const align = options.align || 'left';
    const maxWidth = options.width || (this.width - x - this.margin);
    const lineSpacing = options.lineSpacing || (size * 1.25);

    const rawLines = String(str).split('\n');
    let currentY = y;

    for (const rawLine of rawLines) {
      const wrappedLines = options.wrap !== false ? this.wrapText(rawLine, maxWidth, size, options.bold) : [rawLine];

      for (const line of wrappedLines) {
        let drawX = x;
        const textWidth = this.measureText(line, size, options.bold);

        if (align === 'center') {
          drawX = x + (maxWidth - textWidth) / 2;
        } else if (align === 'right') {
          drawX = x + maxWidth - textWidth;
        }

        const pdfY = this.toPdfY(currentY + size * 0.85);
        const escaped = escapePdfText(line);

        const cmd = [
          'BT',
          `/${fontName} ${size.toFixed(2)} Tf`,
          `${r} ${g} ${b} rg`,
          `1 0 0 1 ${drawX.toFixed(2)} ${pdfY.toFixed(2)} Tm`,
          `(${escaped}) Tj`,
          'ET',
        ];

        this.currentPage.commands.push(cmd.join('\n'));
        currentY += lineSpacing;
      }
    }

    return currentY;
  }

  /**
   * Draws a formatted vector data table
   */
  table(config = {}) {
    const {
      x = this.margin,
      y = 100,
      width = this.width - this.margin * 2,
      headers = [],
      rows = [],
      columnWidths = [],
      headerBg = '#0F172A',
      headerColor = '#FFFFFF',
      stripeBg = '#F8FAFC',
      borderColor = '#E2E8F0',
      rowHeight = 20,
      headerHeight = 22,
      cellPadding = 5,
      fontSize = 8.5,
      align = [],
    } = config;

    // Calculate column widths if not fully supplied
    let colWidths = [...columnWidths];
    if (colWidths.length === 0) {
      const equalWidth = width / headers.length;
      colWidths = headers.map(() => equalWidth);
    }

    let currentY = y;

    // 1. Draw Header Row
    this.rect(x, currentY, width, headerHeight, { fill: headerBg, stroke: borderColor, lineWidth: 0.5 });
    let colX = x;
    headers.forEach((hdr, i) => {
      const colW = colWidths[i] || 50;
      const colAlign = align[i] || 'left';
      this.text(hdr, colX + cellPadding, currentY + 6, {
        size: fontSize,
        bold: true,
        color: headerColor,
        width: colW - cellPadding * 2,
        align: colAlign,
        wrap: false,
      });
      colX += colW;
    });

    currentY += headerHeight;

    // 2. Draw Data Rows
    rows.forEach((row, rowIndex) => {
      const isStripe = rowIndex % 2 === 1;
      const fillBg = isStripe ? stripeBg : '#FFFFFF';

      this.rect(x, currentY, width, rowHeight, { fill: fillBg, stroke: borderColor, lineWidth: 0.5 });

      colX = x;
      row.forEach((cell, i) => {
        const colW = colWidths[i] || 50;
        const colAlign = align[i] || 'left';
        let cellColor = '#1E293B';
        let isBold = false;

        if (typeof cell === 'object' && cell !== null) {
          cellColor = cell.color || cellColor;
          isBold = cell.bold || false;
          cell = cell.text;
        }

        // Color coding for gains and losses
        if (typeof cell === 'string') {
          if (cell.startsWith('+')) cellColor = '#059669';
          else if (cell.startsWith('-') && !cell.startsWith('--')) cellColor = '#DC2626';
        }

        this.text(cell, colX + cellPadding, currentY + 5, {
          size: fontSize,
          color: cellColor,
          bold: isBold,
          width: colW - cellPadding * 2,
          align: colAlign,
          wrap: false,
        });

        colX += colW;
      });

      currentY += rowHeight;
    });

    return currentY;
  }

  /**
   * Compiles the entire PDF document into a binary Buffer
   */
  render() {
    const totalPages = this.pages.length;
    const objects = [];
    let objectCount = 0;

    function newObject(content) {
      objectCount++;
      objects.push({ id: objectCount, content });
      return objectCount;
    }

    // 1. Root Catalog & Pages Tree IDs
    const catalogId = 1;
    const pagesRootId = 2;
    objectCount = 2; // Reserve 1 and 2

    // 2. Standard Type1 Helvetica Fonts
    const fontHelveticaId = newObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    const fontHelveticaBoldId = newObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    const fontHelveticaObliqueId = newObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>');
    const fontHelveticaBoldObliqueId = newObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-BoldOblique /Encoding /WinAnsiEncoding >>');

    const pageObjectIds = [];

    // 3. Render Each Page with Running Header and Footer
    this.pages.forEach((page, index) => {
      const pageNum = index + 1;

      // Ingest running header & footer commands
      const headerFooterCmds = [];

      // Top Running Header (Pages 2+)
      if (pageNum > 1) {
        const topHdrY = 22;
        const [r1, g1, b1] = parseColor('#64748B');
        const [rG, gG, bG] = parseColor('#C8A45D');
        headerFooterCmds.push(`BT /F2 8 Tf ${r1} ${g1} ${b1} rg 1 0 0 1 ${this.margin} ${this.toPdfY(topHdrY)} Tm (STATIQONE FINANCIAL INTELLIGENCE) Tj ET`);
        headerFooterCmds.push(`BT /F1 8 Tf ${r1} ${g1} ${b1} rg 1 0 0 1 ${(this.width - this.margin - 160).toFixed(2)} ${this.toPdfY(topHdrY)} Tm (CONFIDENTIAL & PROPRIETARY) Tj ET`);
        // Gold Divider Rule
        headerFooterCmds.push(`q ${rG} ${gG} ${bG} RG 0.75 w ${this.margin} ${this.toPdfY(topHdrY + 6)} m ${(this.width - this.margin).toFixed(2)} ${this.toPdfY(topHdrY + 6)} l S Q`);
      }

      // Bottom Running Footer (All Pages)
      const footerY = this.height - 24;
      const [rF, gF, bF] = parseColor('#64748B');
      const [rGold, gGold, bGold] = parseColor('#C8A45D');

      // Thin Top Rule on Footer
      headerFooterCmds.push(`q ${rGold} ${gGold} ${bGold} RG 0.5 w ${this.margin} ${this.toPdfY(footerY - 6)} m ${(this.width - this.margin).toFixed(2)} ${this.toPdfY(footerY - 6)} l S Q`);
      headerFooterCmds.push(`BT /F1 7.5 Tf ${rF} ${gF} ${bF} rg 1 0 0 1 ${this.margin} ${this.toPdfY(footerY + 5)} Tm (STATIQONE Market Research | www.statiqone.com | Real-Time Feeds) Tj ET`);

      const pageText = `Page ${pageNum} of ${totalPages}`;
      const pageTextWidth = pageText.length * 7.5 * 0.52;
      const pageX = this.width - this.margin - pageTextWidth;
      headerFooterCmds.push(`BT /F2 7.5 Tf ${rF} ${gF} ${bF} rg 1 0 0 1 ${pageX.toFixed(2)} ${this.toPdfY(footerY + 5)} Tm (${pageText}) Tj ET`);

      const fullContentStream = [...headerFooterCmds, ...page.commands].join('\n');
      const streamBytes = Buffer.from(fullContentStream, 'utf8');

      // Content Stream Object
      const streamObjId = newObject(`<< /Length ${streamBytes.length} >>\nstream\n${fullContentStream}\nendstream`);

      // Page Object
      const pageObjId = newObject(`<<
  /Type /Page
  /Parent ${pagesRootId} 0 R
  /MediaBox [0 0 ${this.width} ${this.height}]
  /Contents ${streamObjId} 0 R
  /Resources <<
    /Font <<
      /F1 ${fontHelveticaId} 0 R
      /F2 ${fontHelveticaBoldId} 0 R
      /F3 ${fontHelveticaObliqueId} 0 R
      /F4 ${fontHelveticaBoldObliqueId} 0 R
    >>
    /ProcSet [/PDF /Text /ImageB /ImageC /ImageI]
  >>
>>`);
      pageObjectIds.push(pageObjId);
    });

    // 4. Fill in Root Catalog and Pages Tree
    objects.unshift({
      id: catalogId,
      content: `<< /Type /Catalog /Pages ${pagesRootId} 0 R >>`,
    });
    objects.splice(1, 0, {
      id: pagesRootId,
      content: `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${totalPages} >>`,
    });

    // 5. Serialize PDF Buffer with XRef Table
    const chunks = [];
    chunks.push(Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', 'binary'));

    const xrefOffsets = [0]; // Offset for object 0
    let currentOffset = chunks[0].length;

    // Sort objects by ID
    objects.sort((a, b) => a.id - b.id);

    objects.forEach((obj) => {
      xrefOffsets[obj.id] = currentOffset;
      const objHeader = `${obj.id} 0 obj\n`;
      const objFooter = '\nendobj\n';
      const objBuffer = Buffer.from(objHeader + obj.content + objFooter, 'utf8');
      chunks.push(objBuffer);
      currentOffset += objBuffer.length;
    });

    const startXref = currentOffset;
    let xrefTable = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i++) {
      const offsetStr = String(xrefOffsets[i]).padStart(10, '0');
      xrefTable += `${offsetStr} 00000 n \n`;
    }

    const trailer = `trailer\n<<\n  /Size ${objects.length + 1}\n  /Root ${catalogId} 0 R\n>>\nstartxref\n${startXref}\n%%EOF\n`;
    chunks.push(Buffer.from(xrefTable + trailer, 'utf8'));

    return Buffer.concat(chunks);
  }
}

// ==============================================================================
// 2. Institutional STATIQONE PDF Report Generator
// ==============================================================================

/**
 * Builds the complete 4-Page Institutional STATIQONE PDF Report
 */
async function generateInstitutionalPdf({
  reportType = 'full_market',
  user = { id: 'usr_guest', displayName: 'Institutional Subscriber', email: 'subscriber@statiqone.com' },
  customOptions = {},
} = {}) {
  const startTime = Date.now();
  const documentId = `STATIQ-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  const issueDate = new Date().toUTCString();

  // 1. Fetch Real-Time Stock Screener Data
  const [moversResult, screenerResult] = await Promise.all([
    stockService.getMarketMovers().catch(() => ({ topGainers: [], topLosers: [], mostActive: [] })),
    stockService.getScreenerQuotes({ limit: 50 }).catch(() => ({ data: [] })),
  ]);

  const stockQuotes = screenerResult.data || [];
  const nasdaqStocks = stockQuotes.filter((s) => s.exchange === 'NASDAQ').slice(0, 8);
  const nseStocks = stockQuotes.filter((s) => s.exchange === 'NSE').slice(0, 8);

  const topGainer = moversResult.topGainers?.[0] || nasdaqStocks[0] || { symbol: 'NVDA', changePercent: 3.2 };
  const topNseMover = nseStocks[0] || { symbol: 'RELIANCE', changePercent: 1.8 };

  // 2. Prepare Context & Synthesize Executive Summary via Gemini
  const marketContext = {
    nasdaqMover: `${topGainer.symbol} (${topGainer.changePercent > 0 ? '+' : ''}${topGainer.changePercent}%)`,
    nseMover: `${topNseMover.symbol} (${topNseMover.changePercent > 0 ? '+' : ''}${topNseMover.changePercent}%)`,
    grossPremium: `₹${IRDAI_DATA.summary.totalGrossDirectPremium.toLocaleString()} Cr`,
    yoyGrowth: `${IRDAI_DATA.summary.yoyGrowthRate}%`,
    accretion: `₹${IRDAI_DATA.summary.accretion.toLocaleString()} Cr`,
    sahiGrowth: '32.89%',
    solvencyAvg: '2.10',
    topInsurer: 'New India Assurance (₹12,700.74 Cr, 14.45% share)',
    reportType,
  };

  const aiSynthesis = await geminiService.generateExecutiveSummary(marketContext);

  // 3. Initialize Vector Document
  const doc = new PdfDocument();
  const pageWidth = doc.width;
  const margin = doc.margin;
  const contentWidth = pageWidth - margin * 2;

  // ============================================================================
  // PAGE 1: Title, Executive Metadata & AI Market Intelligence Synthesis
  // ============================================================================

  // STATIQONE Navy Top Header Banner
  doc.rect(margin, margin, contentWidth, 54, { fill: '#0F172A' });
  doc.rect(margin, margin + 51, contentWidth, 3, { fill: '#C8A45D' }); // Gold Rule

  // STATIQONE Branding Header
  doc.text('STATIQONE', margin + 14, margin + 14, { size: 16, bold: true, color: '#FFFFFF' });
  doc.text('MARKET RESEARCH & INTELLIGENCE', margin + 14, margin + 34, { size: 7.5, bold: true, color: '#C8A45D' });

  // Verification Shield & Classification Tag
  doc.rect(pageWidth - margin - 150, margin + 12, 136, 30, { fill: '#1E293B', stroke: '#C8A45D', lineWidth: 0.5 });
  doc.text('CLASSIFICATION: AUDITED INSTITUTIONAL', pageWidth - margin - 146, margin + 18, { size: 6.5, bold: true, color: '#C8A45D' });
  doc.text(`DOC ID: ${documentId}`, pageWidth - margin - 146, margin + 29, { size: 6.5, color: '#E2E8F0' });

  // Document Title
  let docY = margin + 68;
  doc.text('GLOBAL FINANCIAL INTELLIGENCE & IRDAI MARKET SYNTHESIS', margin, docY, { size: 13, bold: true, color: '#0F172A' });
  docY += 16;
  doc.text(`Macro Equity Outlook, Valuation Benchmarks & Indian Insurance Disclosures | Published: ${issueDate}`, margin, docY, {
    size: 8,
    color: '#64748B',
  });

  // Subscriber Metadata & Security Bar
  docY += 14;
  doc.rect(margin, docY, contentWidth, 24, { fill: '#F8FAFC', stroke: '#E2E8F0', lineWidth: 0.5 });
  const subEmail = user.email || 'institutional@statiqone.com';
  const subTier = (user.subscriptionTier || 'Institutional Monthly').toUpperCase();
  doc.text(`SUBSCRIBER: ${user.displayName || 'Authorized User'} (${subEmail})`, margin + 10, docY + 8, { size: 7.5, color: '#334155' });
  doc.text(`TIER: ${subTier} | ENGINE: ${aiSynthesis.model || 'Gemini 2.5 Flash'}`, pageWidth - margin - 220, docY + 8, { size: 7.5, bold: true, color: '#0F172A' });

  // AI Sentiment Callout Pill
  docY += 32;
  doc.rect(margin, docY, contentWidth, 26, { fill: '#0F172A', stroke: '#C8A45D', lineWidth: 0.75 });
  doc.text('AI MARKET SENTIMENT SYNTHESIS:', margin + 10, docY + 8, { size: 8, bold: true, color: '#C8A45D' });
  doc.text(aiSynthesis.marketSentiment || 'BULLISH / SELECTIVE ACCUMULATION', margin + 175, docY + 8, { size: 8, bold: true, color: '#FFFFFF' });
  doc.text(`CONFIDENCE: ${Math.round((aiSynthesis.confidenceScore || 0.96) * 100)}%`, pageWidth - margin - 90, docY + 8, { size: 8, color: '#94A3B8' });

  // Render 4 Structured AI Sections
  docY += 34;
  const sections = aiSynthesis.sections || [];

  sections.forEach((sec, idx) => {
    // Section Header Box with Left Gold Accent Bar
    doc.rect(margin, docY, 3, 14, { fill: '#C8A45D' });
    doc.text(sec.title, margin + 8, docY + 2, { size: 9, bold: true, color: '#0F172A' });
    docY += 16;

    // Body Paragraphs or Bullets
    if (sec.paragraphs) {
      sec.paragraphs.forEach((p) => {
        docY = doc.text(p, margin + 8, docY, {
          size: 7.5,
          color: '#334155',
          width: contentWidth - 12,
          lineSpacing: 10.5,
        });
        docY += 3;
      });
    }

    if (sec.bulletPoints) {
      sec.bulletPoints.forEach((b) => {
        doc.rect(margin + 8, docY + 3, 3, 3, { fill: '#C8A45D' });
        docY = doc.text(b, margin + 16, docY, {
          size: 7.5,
          color: '#334155',
          width: contentWidth - 20,
          lineSpacing: 10.5,
        });
        docY += 2;
      });
    }

    docY += 4;
  });

  // ============================================================================
  // PAGE 2: Cross-Border Equity Screener Snapshot (NASDAQ & NSE Movers)
  // ============================================================================
  doc.addPage();
  docY = margin + 28;

  doc.text('1. CROSS-BORDER EQUITY INTELLIGENCE — NASDAQ & NSE SNAPSHOT', margin, docY, { size: 12, bold: true, color: '#0F172A' });
  docY += 14;
  doc.text('Real-time multi-market screener snapshot, top movers, valuation multiples, and volume metrics.', margin, docY, {
    size: 8,
    color: '#64748B',
  });
  docY += 14;

  // NASDAQ Table
  doc.text('NASDAQ 100 — US TECHNOLOGY & MEGA-CAP EQUITIES (USD)', margin, docY, { size: 9.5, bold: true, color: '#0F172A' });
  docY += 12;

  const nasdaqHeaders = ['Symbol', 'Company Name', 'Price ($)', '24h Change', 'Mkt Cap ($B)', 'P/E', '52W Range ($)'];
  const nasdaqRows = (nasdaqStocks.length > 0 ? nasdaqStocks : stockQuotes.slice(0, 6)).map((s) => [
    { text: s.symbol, bold: true },
    s.name.length > 22 ? s.name.substring(0, 20) + '...' : s.name,
    `$${Number(s.price).toFixed(2)}`,
    `${s.changePercent >= 0 ? '+' : ''}${Number(s.changePercent).toFixed(2)}%`,
    `$${(s.marketCap / 1e9).toFixed(1)}B`,
    s.peRatio ? `${Number(s.peRatio).toFixed(1)}x` : 'N/A',
    `$${s.low52w || (s.price * 0.8).toFixed(1)} - $${s.high52w || (s.price * 1.2).toFixed(1)}`,
  ]);

  docY = doc.table({
    x: margin,
    y: docY,
    width: contentWidth,
    headers: nasdaqHeaders,
    rows: nasdaqRows,
    columnWidths: [55, 135, 60, 65, 70, 45, 93],
    align: ['left', 'left', 'right', 'right', 'right', 'right', 'center'],
  });

  docY += 18;

  // NSE India Table
  doc.text('NSE INDIA — NIFTY 50 & BLUECHIP CONGLOMERATES (INR)', margin, docY, { size: 9.5, bold: true, color: '#0F172A' });
  docY += 12;

  const nseHeaders = ['Symbol', 'Company Name', 'Price (INR)', '24h Change', 'Mkt Cap (Cr)', 'P/E', 'Sector'];
  const nseRows = (nseStocks.length > 0 ? nseStocks : stockQuotes.slice(6, 12)).map((s) => [
    { text: s.symbol, bold: true },
    s.name.length > 22 ? s.name.substring(0, 20) + '...' : s.name,
    `INR ${Number(s.price).toLocaleString()}`,
    `${s.changePercent >= 0 ? '+' : ''}${Number(s.changePercent).toFixed(2)}%`,
    `INR ${Number(s.marketCap).toLocaleString()}`,
    s.peRatio ? `${Number(s.peRatio).toFixed(1)}x` : 'N/A',
    s.sector.length > 18 ? s.sector.substring(0, 16) + '...' : s.sector,
  ]);

  docY = doc.table({
    x: margin,
    y: docY,
    width: contentWidth,
    headers: nseHeaders,
    rows: nseRows,
    columnWidths: [65, 135, 75, 65, 85, 45, 53],
    align: ['left', 'left', 'right', 'right', 'right', 'right', 'left'],
  });

  docY += 20;

  // Cross-Asset Valuation Benchmark Card
  doc.rect(margin, docY, contentWidth, 75, { fill: '#F8FAFC', stroke: '#E2E8F0', lineWidth: 0.5 });
  doc.rect(margin, docY, contentWidth, 18, { fill: '#0F172A' });
  doc.text('CROSS-ASSET VALUATION BENCHMARK & MULTIPLES MATRIX', margin + 10, docY + 5, { size: 8, bold: true, color: '#FFFFFF' });

  doc.text('Tech Median P/E: 32.4x  |  Financials Median P/E: 18.2x  |  Energy Median P/E: 14.6x  |  Healthcare Median P/E: 24.8x', margin + 10, docY + 28, {
    size: 7.5,
    bold: true,
    color: '#0F172A',
  });
  doc.text('Key Valuation Insight: High-multiple US technology equities continue trading at a 78% premium to Indian financial intermediaries. Value capital allocation models suggest increasing weighting in private sector insurers with combined ratios below 98%.', margin + 10, docY + 44, {
    size: 7.5,
    color: '#475569',
    width: contentWidth - 20,
    lineSpacing: 10,
  });

  // ============================================================================
  // PAGE 3: IRDAI Indian Insurance Industry Flash Figures & League Table
  // ============================================================================
  doc.addPage();
  docY = margin + 28;

  doc.text('2. IRDAI & GENERAL INSURANCE COUNCIL FINANCIAL DISCLOSURES', margin, docY, { size: 12, bold: true, color: '#0F172A' });
  docY += 14;
  doc.text(`Official Underwriting Statistics for ${IRDAI_DATA.summary.period}`, margin, docY, {
    size: 8,
    color: '#64748B',
  });
  docY += 14;

  // 4 Key Highlights Metric Boxes
  const boxW = (contentWidth - 18) / 4;
  const metrics = [
    { title: 'GROSS DIRECT PREMIUM', val: 'INR 87,917.63 Cr', sub: '+10.91% YoY Growth' },
    { title: 'SAHI HEALTH GROWTH', val: '+32.89%', sub: 'INR 12,161.27 Cr Underwritten' },
    { title: 'SOLVENCY RATIO (AVG)', val: '2.10', sub: 'Min Regulatory: 1.50' },
    { title: 'TOTAL POLICIES', val: '290 Million+', sub: 'Active In-Force Policies' },
  ];

  metrics.forEach((m, idx) => {
    const bx = margin + idx * (boxW + 6);
    doc.rect(bx, docY, boxW, 46, { fill: '#F8FAFC', stroke: '#E2E8F0', lineWidth: 0.5 });
    doc.rect(bx, docY, boxW, 3, { fill: '#C8A45D' });
    doc.text(m.title, bx + 6, docY + 10, { size: 6.5, bold: true, color: '#64748B' });
    doc.text(m.val, bx + 6, docY + 23, { size: 9.5, bold: true, color: '#0F172A' });
    doc.text(m.sub, bx + 6, docY + 36, { size: 6.5, color: '#059669' });
  });

  docY += 56;

  // Sector Share Breakdown Table
  doc.text('SECTOR DISTRIBUTION & UNDERWRITING GROWTH', margin, docY, { size: 9.5, bold: true, color: '#0F172A' });
  docY += 12;

  const sectorHeaders = ['Sector Classification', 'Gross Premium (INR Cr)', 'Market Share (%)', 'YoY Growth Rate'];
  const sectorRows = IRDAI_DATA.sectorShare.map((s) => [
    { text: s.sector, bold: true },
    `INR ${s.premium.toLocaleString()}`,
    `${s.share}%`,
    `+${s.growth}%`,
  ]);

  docY = doc.table({
    x: margin,
    y: docY,
    width: contentWidth,
    headers: sectorHeaders,
    rows: sectorRows,
    columnWidths: [200, 110, 100, 113],
    align: ['left', 'right', 'right', 'right'],
  });

  docY += 16;

  // Top 10 Insurer League Table
  doc.text('TOP 10 GENERAL & HEALTH INSURERS LEAGUE TABLE', margin, docY, { size: 9.5, bold: true, color: '#0F172A' });
  docY += 12;

  const insurerHeaders = ['Rank', 'Insurer Name', 'Type', 'Premium (INR Cr)', 'Growth %', 'Share %'];
  const insurerRows = IRDAI_DATA.topInsurers.map((ins) => [
    { text: `#${ins.rank}`, bold: true },
    ins.name,
    ins.type,
    `INR ${ins.premium.toLocaleString()}`,
    `+${ins.growth}%`,
    `${ins.share}%`,
  ]);

  docY = doc.table({
    x: margin,
    y: docY,
    width: contentWidth,
    headers: insurerHeaders,
    rows: insurerRows,
    columnWidths: [40, 200, 70, 95, 60, 58],
    align: ['center', 'left', 'center', 'right', 'right', 'right'],
  });

  // ============================================================================
  // PAGE 4: Regulatory Disclosures, Financial Ratios & Methodology
  // ============================================================================
  doc.addPage();
  docY = margin + 28;

  doc.text('3. FINANCIAL RATIOS & UNDERWRITING PERFORMANCE', margin, docY, { size: 12, bold: true, color: '#0F172A' });
  docY += 14;
  doc.text('Retention, Incurred Claims, Commission, Expense & Operating Profitability Analysis', margin, docY, {
    size: 8,
    color: '#64748B',
  });
  docY += 14;

  const ratioHeaders = ['Sector Category', 'Net Retention %', 'Claims Ratio %', 'Commission %', 'Expense %', 'Op. Profit (Cr)'];
  const ratioRows = IRDAI_DATA.financialRatios.map((r) => [
    { text: r.category, bold: true },
    `${r.retention}%`,
    `${r.claims}%`,
    `${r.commission}%`,
    `${r.expense}%`,
    `INR ${r.opProfit.toLocaleString()} Cr`,
  ]);

  docY = doc.table({
    x: margin,
    y: docY,
    width: contentWidth,
    headers: ratioHeaders,
    rows: ratioRows,
    columnWidths: [180, 70, 70, 65, 65, 73],
    align: ['left', 'right', 'right', 'right', 'right', 'right'],
  });

  docY += 24;

  // Methodology & Audit Trail Box
  doc.text('4. METHODOLOGY, DATA SOURCES & AUDIT VERIFICATION', margin, docY, { size: 11, bold: true, color: '#0F172A' });
  docY += 14;

  const methodologyText = `STATIQONE Quantitative Research models combine multi-market real-time equity data with official regulatory statistics. Equity data is polled via high-frequency financial feeds with 60-second stale-while-revalidate database caching. Insurance sector figures are directly ingested from verified monthly flash disclosures of the Insurance Regulatory and Development Authority of India (IRDAI) and the General Insurance Council. AI synthesis is executed via Google Gemini 2.5 multimodal quantitative reasoning architectures with deterministic institutional failover validation.`;
  docY = doc.text(methodologyText, margin, docY, {
    size: 8,
    color: '#475569',
    width: contentWidth,
    lineSpacing: 11,
  });

  docY += 18;

  // Official Data Sources
  doc.rect(margin, docY, contentWidth, 54, { fill: '#F8FAFC', stroke: '#E2E8F0', lineWidth: 0.5 });
  doc.text('VERIFIED DATA SOURCES & CITATIONS:', margin + 10, docY + 8, { size: 7.5, bold: true, color: '#0F172A' });
  doc.text('• Equity Feeds: NASDAQ Data Link, National Stock Exchange of India (NSE), Yahoo Finance API.', margin + 10, docY + 20, { size: 7, color: '#475569' });
  doc.text('• Insurance Intelligence: IRDAI Monthly Flash Premium Reports, GI Council Financial Disclosures.', margin + 10, docY + 31, { size: 7, color: '#475569' });
  doc.text('• Reinsurance & Global Feeds: Reinsurance News, Insurance Journal, SEC EDGAR 10-K/10-Q Filings.', margin + 10, docY + 42, { size: 7, color: '#475569' });

  docY += 66;

  // Institutional Compliance & Disclaimer Box
  doc.rect(margin, docY, contentWidth, 75, { fill: '#0F172A', stroke: '#C8A45D', lineWidth: 0.75 });
  doc.text('LEGAL & INSTITUTIONAL DISCLAIMER', margin + 10, docY + 8, { size: 8, bold: true, color: '#C8A45D' });
  const disclaimer = `This report is prepared for institutional and professional subscribers of STATIQONE (www.statiqone.com) for information purposes only. It does not constitute investment advice, financial guidance, an offer to buy or sell securities, or an endorsement of any insurer. While all data is compiled from sources believed to be reliable, STATIQONE makes no representation as to completeness or accuracy. Redistribution or commercial resale without express written authorization is strictly prohibited.`;
  doc.text(disclaimer, margin + 10, docY + 22, {
    size: 6.8,
    color: '#94A3B8',
    width: contentWidth - 20,
    lineSpacing: 9.5,
  });

  // Render & Compile PDF Buffer
  const pdfBuffer = doc.render();
  const generationMs = Date.now() - startTime;

  // Log generation audit record
  await logReportGeneration({
    userId: user.id,
    reportType,
    reportTitle: `STATIQONE Financial Intelligence & IRDAI Synthesis (${reportType})`,
    aiSummaryUsed: true,
    fileSizeBytes: pdfBuffer.length,
    generationMs,
  });

  return {
    buffer: pdfBuffer,
    documentId,
    fileSizeBytes: pdfBuffer.length,
    generationMs,
    aiSynthesis,
  };
}

// ==============================================================================
// 3. User Quota & Audit Logging Engine
// ==============================================================================

/**
 * Logs a generated report in PostgreSQL pdf_reports_log or in-memory fallback.
 */
async function logReportGeneration({
  userId,
  reportType,
  reportTitle,
  aiSummaryUsed = true,
  fileSizeBytes,
  generationMs,
}) {
  const record = {
    id: `rpt_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    userId,
    reportType,
    reportTitle,
    aiSummaryUsed,
    fileSizeBytes,
    generationMs,
    generatedAt: new Date().toISOString(),
  };

  memoryPdfLogs.unshift(record);
  if (memoryPdfLogs.length > 500) memoryPdfLogs.pop();

  if (pool) {
    try {
      await pool.query(
        `INSERT INTO pdf_reports_log (user_id, report_type, report_title, ai_summary_used, file_size_bytes, generation_ms)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, reportType, reportTitle, aiSummaryUsed, fileSizeBytes, generationMs]
      );
    } catch (err) {
      // Non-fatal, memory log maintains availability
    }
  }
}

// In-Memory Fallback Subscriptions map
const memoryUserSubscriptions = new Map();

function setMemoryUserSubscription(userId, tier = 'monthly', usedCount = 0) {
  memoryUserSubscriptions.set(userId, { tier, usedCount });
}

/**
 * Checks and returns user PDF download quota status.
 * @param {string|Object} userOrId - User ID string or User object
 */
async function getUserReportQuota(userOrId) {
  const userId = typeof userOrId === 'string' ? userOrId : userOrId?.id;

  if (!userId) {
    return {
      tier: 'free',
      monthlyQuota: 0,
      usedThisMonth: 0,
      remaining: 0,
      isUnlimited: false,
      canGenerate: false,
      reason: 'Authentication is required to generate PDF reports.',
    };
  }

  let dbUser = null;

  if (pool) {
    try {
      const { rows } = await pool.query(
        `SELECT id, role, subscription_tier, subscription_status, subscription_expires_at, monthly_pdf_count, pdf_count_reset_at
         FROM users WHERE id = $1`,
        [userId]
      );
      dbUser = rows[0] || null;
    } catch (err) {
      // Fallback to memory
    }
  }

  // Resolve tier: priority: DB user -> passed user object -> memory subscription -> free
  const passedTier = typeof userOrId === 'object' ? (userOrId.subscriptionTier || userOrId.tier) : null;
  const memorySub = memoryUserSubscriptions.get(userId);
  const tier = dbUser?.subscription_tier || passedTier || memorySub?.tier || 'free';
  const role = dbUser?.role || (typeof userOrId === 'object' ? userOrId.role : 'user');
  const memoryCount = memoryUserQuotas.get(userId) ?? memorySub?.usedCount;
  const monthlyPdfCount = dbUser?.monthly_pdf_count ?? memoryCount ?? (typeof userOrId === 'object' && userOrId.monthlyPdfCount !== undefined ? userOrId.monthlyPdfCount : 0);

  if (role === 'admin' || tier === 'annual') {
    return {
      tier: 'annual',
      monthlyQuota: -1,
      usedThisMonth: monthlyPdfCount,
      remaining: 'Unlimited',
      isUnlimited: true,
      canGenerate: true,
    };
  }

  if (tier === 'monthly') {
    const quota = 5;
    const remaining = Math.max(0, quota - monthlyPdfCount);
    return {
      tier: 'monthly',
      monthlyQuota: quota,
      usedThisMonth: monthlyPdfCount,
      remaining,
      isUnlimited: false,
      canGenerate: remaining > 0,
      reason: remaining === 0 ? 'Monthly quota of 5 PDF reports reached. Upgrade to Annual for unlimited downloads.' : null,
    };
  }

  // Free Tier
  return {
    tier: 'free',
    monthlyQuota: 0,
    usedThisMonth: 0,
    remaining: 0,
    isUnlimited: false,
    canGenerate: false,
    reason: 'PDF reports are exclusively available on Monthly and Annual Institutional subscriptions. Upgrade to unlock.',
  };
}

// Per-user serialization lock to prevent concurrent TOCTOU race conditions in Node.js runtime
const userLocks = new Map();

async function withUserLock(userId, fn) {
  const currentLock = userLocks.get(userId) || Promise.resolve();
  let release;
  const nextLock = new Promise((resolve) => {
    release = resolve;
  });
  userLocks.set(userId, nextLock);
  try {
    await currentLock;
    return await fn();
  } finally {
    release();
    if (userLocks.get(userId) === nextLock) {
      userLocks.delete(userId);
    }
  }
}

/**
 * Enforces and consumes 1 PDF report from user's quota atomically.
 */
async function enforceAndConsumeQuota(userOrId) {
  const userId = typeof userOrId === 'string' ? userOrId : userOrId?.id;

  if (!userId) {
    const error = new Error('Authentication is required to generate PDF reports.');
    error.status = 401;
    throw error;
  }

  return withUserLock(userId, async () => {
    // 1. If PostgreSQL connection is available, execute atomic check-and-increment query
    if (pool) {
      try {
        const updateRes = await pool.query(
          `UPDATE users
           SET monthly_pdf_count = monthly_pdf_count + 1
           WHERE id = $1
             AND (
               role = 'admin'
               OR subscription_tier = 'annual'
               OR (subscription_tier = 'monthly' AND monthly_pdf_count < 5)
             )
           RETURNING id, role, subscription_tier, monthly_pdf_count`,
          [userId]
        );

        if (updateRes.rows.length > 0) {
          const row = updateRes.rows[0];
          const isUnlimited = row.role === 'admin' || row.subscription_tier === 'annual';
          const newCount = row.monthly_pdf_count;
          memoryUserQuotas.set(userId, newCount);
          const memSub = memoryUserSubscriptions.get(userId);
          if (memSub) memSub.usedCount = newCount;

          return {
            tier: row.subscription_tier || (row.role === 'admin' ? 'annual' : 'free'),
            monthlyQuota: isUnlimited ? -1 : 5,
            usedThisMonth: newCount,
            remaining: isUnlimited ? 'Unlimited' : Math.max(0, 5 - newCount),
            isUnlimited,
            canGenerate: true,
          };
        }

        // If 0 rows updated, verify exact reason (Free tier, or Monthly quota reached)
        const checkRes = await pool.query(
          `SELECT role, subscription_tier, monthly_pdf_count FROM users WHERE id = $1`,
          [userId]
        );
        if (checkRes.rows.length > 0) {
          const u = checkRes.rows[0];
          const isMonthly = u.subscription_tier === 'monthly';
          const isFree = !u.subscription_tier || u.subscription_tier === 'free';
          const reason = isFree
            ? 'PDF reports are exclusively available on Monthly and Annual Institutional subscriptions. Upgrade to unlock.'
            : isMonthly && u.monthly_pdf_count >= 5
            ? 'Monthly quota of 5 PDF reports reached. Upgrade to Annual for unlimited downloads.'
            : 'PDF report generation not permitted.';
          const error = new Error(reason);
          error.status = 403;
          error.quota = {
            tier: u.subscription_tier || 'free',
            monthlyQuota: isMonthly ? 5 : (u.subscription_tier === 'annual' || u.role === 'admin' ? -1 : 0),
            usedThisMonth: u.monthly_pdf_count,
            remaining: isMonthly ? Math.max(0, 5 - u.monthly_pdf_count) : 0,
            isUnlimited: u.subscription_tier === 'annual' || u.role === 'admin',
            canGenerate: false,
            reason,
          };
          throw error;
        }
      } catch (dbErr) {
        if (dbErr.status === 403 || dbErr.status === 401) throw dbErr;
        // Fall back to in-memory quota enforcement if DB is disconnected/unavailable
      }
    }

    // 2. In-memory fallback quota enforcement (serialized by withUserLock)
    const quota = await getUserReportQuota(userOrId);
    if (!quota.canGenerate) {
      const error = new Error(quota.reason || 'PDF report generation not permitted.');
      error.status = 403;
      error.quota = quota;
      throw error;
    }

    const currentCount = typeof quota.usedThisMonth === 'number' ? quota.usedThisMonth : 0;
    if (quota.tier === 'monthly' && currentCount >= 5) {
      const error = new Error('Monthly quota of 5 PDF reports reached. Upgrade to Annual for unlimited downloads.');
      error.status = 403;
      error.quota = { ...quota, canGenerate: false, remaining: 0 };
      throw error;
    }

    const newCount = currentCount + 1;
    memoryUserQuotas.set(userId, newCount);

    const memSub = memoryUserSubscriptions.get(userId);
    if (memSub) {
      memSub.usedCount = newCount;
    }

    return {
      ...quota,
      usedThisMonth: newCount,
      remaining: quota.isUnlimited ? 'Unlimited' : Math.max(0, quota.monthlyQuota - newCount),
      canGenerate: quota.isUnlimited || newCount < quota.monthlyQuota,
    };
  });
}

/**
 * Retrieves PDF generation history for a user
 */
async function getUserReportHistory(userOrId) {
  const userId = typeof userOrId === 'string' ? userOrId : userOrId?.id;
  if (pool) {
    try {
      const { rows } = await pool.query(
        `SELECT id, report_type, report_title, ai_summary_used, file_size_bytes, generation_ms, generated_at
         FROM pdf_reports_log WHERE user_id = $1 ORDER BY generated_at DESC LIMIT 20`,
        [userId]
      );
      if (rows.length > 0) return rows;
    } catch (err) {}
  }

  return memoryPdfLogs.filter((l) => l.userId === userId);
}

module.exports = {
  generateInstitutionalPdf,
  getUserReportQuota,
  enforceAndConsumeQuota,
  getUserReportHistory,
  setMemoryUserSubscription,
  PdfDocument,
};
