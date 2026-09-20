import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, Cpu, CheckCircle2 } from 'lucide-react';

const ANALYSIS_STEPS = [
  'Extracting multi-column text and contact metadata...',
  'Zero-Retention: Discarding raw binary buffer from memory...',
  'Parsing Experience, Education, Projects & Skills sections...',
  'Cross-referencing 350+ skills against target job description...',
  'Calculating estimated ATS Score and metric impact...',
  'Formulating STAR-method bullet rewrite suggestions...',
];

export default function SkeletonLoader() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 animate-pulse-slow">
      {/* Top Status Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/60 shadow-sm animate-bounce">
          <Cpu className="w-7 h-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
          Analyzing Resume & Job Alignment...
        </h2>
        <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 font-medium">
          {ANALYSIS_STEPS[currentStep]}
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {ANALYSIS_STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={step}
              className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
                isDone
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
                  : isCurrent
                  ? 'bg-brand-50/80 dark:bg-brand-950/40 border-brand-400 dark:border-brand-600 text-brand-700 dark:text-brand-300 font-semibold ring-1 ring-brand-400'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              ) : (
                <div
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                    isCurrent
                      ? 'border-brand-600 border-t-transparent animate-spin'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
              )}
              <span className="truncate">{step.split('...')[0]}</span>
            </div>
          );
        })}
      </div>

      {/* Shimmer Placeholder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Shimmer Gauge Card 1 */}
        <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/60 space-y-4">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          <div className="w-28 h-28 mx-auto rounded-full border-8 border-slate-200 dark:border-slate-700"></div>
          <div className="h-3 w-48 mx-auto bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>

        {/* Shimmer Gauge Card 2 */}
        <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/60 space-y-4">
          <div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          <div className="w-28 h-28 mx-auto rounded-full border-8 border-slate-200 dark:border-slate-700"></div>
          <div className="h-3 w-44 mx-auto bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>

      {/* Shimmer Skill Pills */}
      <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/60 space-y-4">
        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        <div className="flex flex-wrap gap-2">
          {[80, 100, 60, 110, 90, 75, 95, 85].map((w, i) => (
            <div
              key={i}
              className="h-7 bg-slate-200 dark:bg-slate-700 rounded-lg"
              style={{ width: `${w}px` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
