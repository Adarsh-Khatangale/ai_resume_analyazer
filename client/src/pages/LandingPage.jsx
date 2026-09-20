import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Search,
  Download,
  Flame,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, demoLogin, openAuthModal } = useAuth();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden text-center max-w-5xl mx-auto px-4">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-indigo-600/20 to-violet-500/20 blur-3xl rounded-full -z-10 pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Next-Gen MERN ATS Parser & Skill Gap Assistant</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight leading-[1.1]">
          Stop Applying Blindly. <br />
          <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
            Beat the ATS & Match Any Job.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Extract multi-column resumes with zero server file retention. Get instant ATS compliance scores, precise skill gap diagnostics with learning links, and high-impact STAR bullet rewrites.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-lg shadow-brand-500/25 transition-all hover:scale-105"
            >
              Go to Your Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/analyze"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-lg shadow-brand-500/25 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                Try Guest Mode (1 Scan Free)
              </Link>
              <button
                onClick={() => openAuthModal()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all"
              >
                Sign In / Sign Up
              </button>
              <button
                onClick={demoLogin}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-xs sm:text-sm text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                1-Click Demo
              </button>
            </>
          )}
        </div>

        {/* Trust Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Zero-Retention File Memory Policy
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-500" />
            Multi-Column Layout Aware
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            350+ Technology Skill Taxonomy
          </span>
        </div>
      </section>

      {/* Visual Feature Pipeline Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-100/80 to-white dark:from-slate-900/90 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white">
              Engineered for Enterprise ATS Precision
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              How our deterministic NLP engine and layout-aware parser evaluate your resume against real applicant tracking algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Layout-Aware Parser
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Handles complex modern 2-column templates without merging sidebar contact lines with work history. Memory buffers are purged immediately.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Skill Gap & Learning Links
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Evaluates 350+ categorized skills. For every missing requirement (e.g. Docker, GraphQL), generates 1-click tutorial and documentation links.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Google XYZ Bullet Rewrites
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Transforms passive duties into quantified impact metrics with concrete "Instead of this... Write this..." recommendations you can copy directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-700 text-white shadow-xl shadow-brand-500/20 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
            Test Your Resume Against Any Job in 30 Seconds
          </h2>
          <p className="text-xs sm:text-sm text-brand-100 max-w-xl mx-auto">
            No registration required for your first scan. Upload your PDF or DOCX file, enter a target job description, and view your complete ATS score report.
          </p>
          <div className="pt-2">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-white text-brand-700 hover:bg-brand-50 shadow-md transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              Launch Free Analysis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
