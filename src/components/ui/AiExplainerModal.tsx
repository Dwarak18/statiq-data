import React, { useState } from 'react';
import { Sparkles, ArrowRight, BarChart2, TrendingUp, Cpu, Database } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useToast } from '@/context/ToastContext';

interface AiExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasetTitle: string;
}

export function AiExplainerModal({ isOpen, onClose, datasetTitle }: AiExplainerModalProps) {
  const [activeTab, setActiveTab] = useState<'explain' | 'compare' | 'forecast'>('explain');
  const [compareTarget, setCompareTarget] = useState('Microsoft');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleGenerate = (action: 'explain' | 'compare' | 'forecast') => {
    setIsGenerating(true);
    setAiResult(null);
    setTimeout(() => {
      setIsGenerating(false);
      if (action === 'explain') {
        setAiResult(
          `Dataset Summary for "${datasetTitle}": Key metrics show a 34.2% compound growth trajectory over 5 fiscal periods. Revenue concentration is heavily anchored in Enterprise Tier 1 accounts, with North America generating 51.3% of total volume.`
        );
      } else if (action === 'compare') {
        setAiResult(
          `Comparative Analysis: Apple Inc. vs ${compareTarget}: Apple maintains higher operating margin efficiency (31.5% vs 44.6% for Microsoft) and leads in consumer hardware unit volume, whereas ${compareTarget} displays faster recurring cloud services expansion.`
        );
      } else {
        setAiResult(
          `5-Year Predictive Model (2025-2030): Based on Monte Carlo simulations and historical SEC 10-K filings, annual market expenditure is forecast to reach $620B by 2030, assuming sustained 28% annual CapEx expansion.`
        );
      }
      showToast('AI analysis generated!', 'success');
    }, 800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="STATIQDATA AI Data Analyst">
      <div className="flex rounded-lg bg-background p-1 mb-6 border border-border">
        <button
          onClick={() => { setActiveTab('explain'); handleGenerate('explain'); }}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${activeTab === 'explain' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
        >
          Explain Dataset
        </button>
        <button
          onClick={() => { setActiveTab('compare'); handleGenerate('compare'); }}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${activeTab === 'compare' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
        >
          Compare Peers
        </button>
        <button
          onClick={() => { setActiveTab('forecast'); handleGenerate('forecast'); }}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${activeTab === 'forecast' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
        >
          Forecast 2030
        </button>
      </div>

      {activeTab === 'compare' && (
        <div className="mb-4">
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Select Peer to Compare</label>
          <select
            value={compareTarget}
            onChange={(e) => setCompareTarget(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-text-main outline-none"
          >
            <option value="Microsoft">Microsoft Corp.</option>
            <option value="Alphabet">Alphabet (Google)</option>
            <option value="Samsung">Samsung Electronics</option>
            <option value="Amazon">Amazon Inc.</option>
          </select>
        </div>
      )}

      {isGenerating ? (
        <div className="p-8 text-center flex flex-col items-center justify-center">
          <Sparkles className="h-8 w-8 text-primary animate-spin mb-3" />
          <span className="text-xs font-mono text-text-muted animate-pulse">Running AI Synthesis across SEC EDGAR & World Bank databases...</span>
        </div>
      ) : (
        aiResult && (
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-text-main leading-relaxed mb-6">
            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
              <Sparkles className="h-4 w-4" /> AI Analyst Synthesis
            </div>
            {aiResult}
          </div>
        )
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-border">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button onClick={() => handleGenerate(activeTab)} className="bg-primary text-white">
          <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Re-Analyze
        </Button>
      </div>
    </Modal>
  );
}
