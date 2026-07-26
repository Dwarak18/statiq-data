import { ExportFormat } from './types';

interface ExportableDataset {
  title: string;
  source: string;
  lastUpdated: string;
  columns: string[];
  rows: (string | number)[][];
}

/**
 * Triggers a file download in the browser for the given content, filename, and MIME type
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportDataset(data: ExportableDataset, format: ExportFormat): string {
  const sanitizeFilename = data.title.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 40);

  switch (format) {
    case 'csv': {
      const header = data.columns.join(',');
      const rowsText = data.rows.map((row) => row.map((val) => `"${val}"`).join(',')).join('\n');
      const csvContent = `# Source: ${data.source}\n# Platform: STATIQONE Intelligence\n# Last Updated: ${data.lastUpdated}\n${header}\n${rowsText}`;
      downloadFile(csvContent, `${sanitizeFilename}_statiqone.csv`, 'text/csv;charset=utf-8;');
      return `Exported ${sanitizeFilename}_statiqone.csv successfully!`;
    }

    case 'json': {
      const jsonStructure = {
        metadata: {
          platform: 'STATIQONE Research Platform',
          title: data.title,
          source: data.source,
          lastUpdated: data.lastUpdated,
          extractedAt: new Date().toISOString()
        },
        columns: data.columns,
        data: data.rows.map((row) => {
          const obj: Record<string, any> = {};
          data.columns.forEach((col, idx) => {
            obj[col] = row[idx];
          });
          return obj;
        })
      };
      const jsonContent = JSON.stringify(jsonStructure, null, 2);
      downloadFile(jsonContent, `${sanitizeFilename}_statiqone.json`, 'application/json');
      return `Exported ${sanitizeFilename}_statiqone.json successfully!`;
    }

    case 'xml': {
      const xmlRows = data.rows
        .map((row) => {
          const fields = data.columns
            .map((col, idx) => {
              const tag = col.replace(/[^a-zA-Z0-9]/g, '_');
              return `    <${tag}>${row[idx]}</${tag}>`;
            })
            .join('\n');
          return `  <record>\n${fields}\n  </record>`;
        })
        .join('\n');

      const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<STATIQONEDataset title="${data.title}" source="${data.source}" updated="${data.lastUpdated}">\n${xmlRows}\n</STATIQONEDataset>`;
      downloadFile(xmlContent, `${sanitizeFilename}_statiqone.xml`, 'application/xml');
      return `Exported ${sanitizeFilename}_statiqone.xml successfully!`;
    }

    case 'excel': {
      const header = data.columns.join('\t');
      const rowsText = data.rows.map((row) => row.join('\t')).join('\n');
      const excelContent = `Platform:\tSTATIQONE Intelligence\nTitle:\t${data.title}\nSource:\t${data.source}\nUpdated:\t${data.lastUpdated}\n\n${header}\n${rowsText}`;
      downloadFile(excelContent, `${sanitizeFilename}_statiqone.xls`, 'application/vnd.ms-excel');
      return `Exported ${sanitizeFilename}_statiqone.xls successfully!`;
    }

    case 'pdf': {
      window.print();
      return `Opened print dialog for STATIQONE PDF export of ${data.title}`;
    }

    default:
      return 'Unsupported format';
  }
}
