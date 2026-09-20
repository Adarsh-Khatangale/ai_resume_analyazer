import React from 'react';
import { ShieldCheck, Lock, Heart, FileCode2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse"></span>
              AI Resume Analyzer & Job Match Assistant
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Empowering job seekers with precision ATS formatting scores, deep semantic job matching, and actionable skill gap learning paths.
            </p>
          </div>

          {/* Zero Retention Policy Guarantee */}
          <div className="rounded-2xl p-4 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-xs mb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Strict Zero-Retention File Guarantee
            </div>
            <p className="text-xs text-emerald-700/90 dark:text-emerald-400/80 leading-relaxed">
              Resumes are processed entirely in-memory using Multer RAM buffers. The binary file is immediately destroyed post-extraction. We never persist raw files to disk.
            </p>
          </div>

          {/* Privacy & Compliance */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold text-xs">
              <Lock className="w-4 h-4 text-brand-500" />
              Data Privacy & Security
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Protected with Helmet security headers, rate limiting, and HttpOnly JWT cookies. Fully compliant with GDPR "Right to be Forgotten" via one-click account and data purge.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} AI Resume Analyzer. Built for high-impact careers.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FileCode2 className="w-3.5 h-3.5 text-brand-500" />
              MERN Stack Architecture
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
