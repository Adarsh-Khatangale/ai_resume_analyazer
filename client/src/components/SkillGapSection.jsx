import React, { useState } from 'react';
import {
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Youtube,
  BookOpen,
  Search,
  Sparkles,
} from 'lucide-react';

export default function SkillGapSection({ matchedSkills = [], missingSkills = [] }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'matched' | 'missing'
  const [searchQuery, setSearchQuery] = useState('');

  const totalRequired = matchedSkills.length + missingSkills.length;
  const matchRate = totalRequired > 0 ? Math.round((matchedSkills.length / totalRequired) * 100) : 0;

  // Filter skills by tab and search input
  const filterSkills = (list) => {
    if (!searchQuery) return list;
    return list.filter((item) => {
      const name = typeof item === 'string' ? item : item.skill || '';
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  const displayedMatched = filterSkills(matchedSkills);
  const displayedMissing = filterSkills(missingSkills);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Header with KPI Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 dark:text-white">
              Skill Gap & Learning Roadmap
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
              {matchRate}% Match Rate
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Identify exact technical competencies matched versus missing requirements with 1-click learning links.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({totalRequired})
          </button>
          <button
            onClick={() => setFilter('matched')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'matched'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-emerald-700 dark:text-emerald-400 hover:opacity-80'
            }`}
          >
            You Have ({matchedSkills.length})
          </button>
          <button
            onClick={() => setFilter('missing')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'missing'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-rose-700 dark:text-rose-400 hover:opacity-80'
            }`}
          >
            Missing ({missingSkills.length})
          </button>
        </div>
      </div>

      {/* Search Filter Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter skills by keyword (e.g. Docker, React, AWS)..."
          className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
        />
      </div>

      {/* Skills Display Grid */}
      <div className="space-y-6">
        {/* Section 1: Matching Skills (You Have) */}
        {(filter === 'all' || filter === 'matched') && displayedMatched.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              Matching Skills (Verified in Resume) — {displayedMatched.length}
            </div>
            <div className="flex flex-wrap gap-2">
              {displayedMatched.map((item, idx) => {
                const skillName = typeof item === 'string' ? item : item.skill;
                const cat = typeof item === 'object' && item.category ? item.category : 'Competency';
                return (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/70"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-semibold">{skillName}</span>
                    <span className="text-[10px] opacity-75 ml-1 px-1.5 py-0.2 rounded bg-emerald-100/80 dark:bg-emerald-900/60">
                      {cat}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 2: Missing Skills (Actionable Where-To-Learn Roadmap) */}
        {(filter === 'all' || filter === 'missing') && displayedMissing.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-4 h-4" />
                Missing Skills (Job Requirements to Acquire) — {displayedMissing.length}
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Click links below to launch targeted courses & tutorials
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayedMissing.map((item, idx) => {
                const skillName = typeof item === 'string' ? item : item.skill;
                const cat = typeof item === 'object' && item.category ? item.category : 'Requirement';
                const youtubeUrl =
                  item.learningUrl ||
                  `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName)}+tutorial+for+beginners`;
                const docsUrl =
                  item.docsUrl ||
                  `https://www.google.com/search?q=${encodeURIComponent(skillName)}+official+documentation`;

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 flex flex-col justify-between gap-2.5 hover:border-rose-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {skillName}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
                        {cat}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-rose-100 dark:border-rose-900/30 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Where to Learn:
                      </span>
                      <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-medium transition-colors"
                      >
                        <Youtube className="w-3.5 h-3.5" />
                        YouTube
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                      <a
                        href={docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-brand-500" />
                        Official Docs
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {displayedMatched.length === 0 && displayedMissing.length === 0 && (
          <div className="py-8 text-center text-slate-400 text-sm">
            No skills matched your search query "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
}
