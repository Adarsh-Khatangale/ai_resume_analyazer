import React, { useState } from 'react';
import { ArrowRight, Check, Copy, Sparkles, AlertCircle, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';

export default function SuggestionsBox({ suggestions = [] }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success('Optimized bullet copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            Actionable Bullet Rewrites
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Transform passive responsibilities into high-impact, metric-driven accomplishments using the Google XYZ framework.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
          <TrendingUp className="w-3.5 h-3.5" />
          STAR Methodology
        </span>
      </div>

      <div className="space-y-4">
        {suggestions.map((item, idx) => {
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 transition-all hover:border-brand-300 dark:hover:border-brand-700"
            >
              {/* Category / Section Header */}
              <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                  Target Area: {item.section || 'Work Experience'}
                </span>
                <span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                  Suggestion #{idx + 1}
                </span>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Instead of this (Weak) */}
                  <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Instead of this:
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic">
                      "{item.insteadOf}"
                    </p>
                  </div>

                  {/* Write this (High-Impact) */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <Check className="w-3.5 h-3.5" />
                        Write this instead:
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">
                        "{item.writeThis}"
                      </p>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleCopy(item.writeThis, idx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Rewrite
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rationale explanation */}
                {item.rationale && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-start gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">
                      Why this works:
                    </span>
                    <span>{item.rationale}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
