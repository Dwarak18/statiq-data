import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, Smartphone, Sparkles, Check } from 'lucide-react';
import { usePWA } from './usePWA';

export interface InstallPromptBannerProps {
  className?: string;
  forceShow?: boolean;
}

export function InstallPromptBanner({ className = '', forceShow = false }: InstallPromptBannerProps) {
  const {
    canInstall,
    isInstalled,
    promptType,
    isIOS,
    promptInstall,
    dismissPrompt,
  } = usePWA();

  const [installing, setInstalling] = useState(false);
  const [showIOSSteps, setShowIOSSteps] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // If already installed or no prompt applicable (unless forceShow is passed for testing/preview)
  if (!forceShow && (isInstalled || !canInstall || promptType === 'none')) {
    return null;
  }

  const handleInstallClick = async () => {
    setInstalling(true);
    const accepted = await promptInstall();
    setInstalling(false);
    if (accepted) {
      setInstalledSuccess(true);
      setTimeout(() => {
        dismissPrompt(30);
      }, 3000);
    }
  };

  const handleDismiss = () => {
    dismissPrompt(7);
  };

  return (
    <div
      role="region"
      aria-label="PWA Install Banner"
      className={`fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 md:bottom-6 md:left-auto md:right-6 md:max-w-md ${className}`}
    >
      {/* Glow accent */}
      <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none" />

      <div className="relative flex items-start gap-3.5">
        {/* App Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 shadow-inner">
          <Smartphone className="h-6 w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white tracking-tight">
              Install STATIQONE App
            </h4>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-2.5 w-2.5" /> PWA
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            Get instant market alerts, offline stock screener, and fast full-screen experience.
          </p>

          {/* Action Area based on Platform */}
          {installedSuccess ? (
            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
              <Check className="h-4 w-4 shrink-0" />
              <span>STATIQONE installed successfully! Launching app mode...</span>
            </div>
          ) : promptType === 'native_prompt' || forceShow ? (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstallClick}
                disabled={installing}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-md transition-all hover:from-emerald-400 hover:to-teal-400 active:scale-95 disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                {installing ? 'Installing...' : 'Install Now'}
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
              >
                Not now
              </button>
            </div>
          ) : (promptType === 'ios_instructions' || isIOS) && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowIOSSteps(!showIOSSteps)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                <span>{showIOSSteps ? 'Hide iOS install instructions' : 'How to install on iPhone/iPad →'}</span>
              </button>

              {showIOSSteps && (
                <div className="mt-2.5 space-y-2 rounded-xl bg-slate-950/60 border border-slate-800 p-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-slate-200">1</span>
                    <span className="flex items-center gap-1">
                      Tap the <strong className="text-white inline-flex items-center gap-0.5"><Share className="inline h-3 w-3 text-cyan-400" /> Share</strong> button in Safari toolbar.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-slate-200">2</span>
                    <span className="flex items-center gap-1">
                      Scroll down and tap <strong className="text-white inline-flex items-center gap-0.5"><PlusSquare className="inline h-3 w-3 text-emerald-400" /> Add to Home Screen</strong>.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-slate-200">3</span>
                    <span>Tap <strong className="text-white">Add</strong> in top-right corner to finish.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install banner"
          className="absolute top-0 right-0 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
