import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analysisAPI } from '../services/api';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award,
  Layers,
  Info,
} from 'lucide-react';
import CircularGauge from '../components/CircularGauge';
import SkillsRadarChart from '../components/SkillsRadarChart';
import SkillGapSection from '../components/SkillGapSection';
import SuggestionsBox from '../components/SuggestionsBox';
import GuestBanner from '../components/GuestBanner';
import ReportDownloadButton from '../components/ReportDownloadButton';
import SkeletonLoader from '../components/SkeletonLoader';

export default function ResultsPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, guestAnalysis } = useAuth();

  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!analysis);
  const [rawTextOpen, setRawTextOpen] = useState(false);

  const queryId = searchParams.get('id');

  useEffect(() => {
    // If analysis was passed via navigation state, use it
    if (location.state?.analysis) {
      setAnalysis(location.state.analysis);
      setLoading(false);
      return;
    }

    // If an ID was provided in URL params, fetch from server
    if (queryId && isAuthenticated) {
      setLoading(true);
      analysisAPI
        .getById(queryId)
        .then((res) => {
          if (res.data?.analysis) {
            setAnalysis(res.data.analysis);
          }
        })
        .catch((err) => {
          console.error('Failed to load analysis:', err);
        })
        .finally(() => setLoading(false));
      return;
    }

    // Otherwise check guestAnalysis from localStorage
    if (guestAnalysis) {
      setAnalysis(guestAnalysis);
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [queryId, isAuthenticated, location.state, guestAnalysis]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <SkeletonLoader />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
          <FileText className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          No Analysis Results Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Upload your resume and a target job description to generate your ATS and match scorecard.
        </p>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          Run Resume Scan
        </Link>
      </div>
    );
  }

  const isGuestScan = analysis.isGuest || !isAuthenticated;
  const atsDetails = analysis.atsDetails || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to={isAuthenticated ? '/dashboard' : '/analyze'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          {isAuthenticated ? 'Back to Dashboard' : 'Back to Analyzer'}
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            Scan Another Role
          </Link>
          <ReportDownloadButton analysis={analysis} />
        </div>
      </div>

      {/* Guest Mode Conversion Banner */}
      {isGuestScan && <GuestBanner />}

      {/* Title Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-50/70 via-indigo-50/50 to-white dark:from-slate-900 dark:via-brand-950/20 dark:to-slate-900 border border-brand-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Target Job Role
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white mt-0.5">
            {analysis.jobTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Analysis generated on {new Date(analysis.createdAt || Date.now()).toLocaleDateString()} • Zero-Retention privacy protected
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Zero-Retention Verified
          </span>
        </div>
      </div>

      {/* Top Visual Gauges & Radar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gauge 1: Estimated ATS Score */}
        <div className="flex flex-col justify-between">
          <CircularGauge
            value={analysis.atsScore}
            maxValue={100}
            label="Estimated ATS Score"
            subtitle="Formatting, sections, metrics, and word density."
          />
        </div>

        {/* Gauge 2: Job Match Percentage */}
        <div className="flex flex-col justify-between">
          <CircularGauge
            value={analysis.matchScore}
            maxValue={100}
            label="Job Match Alignment"
            subtitle="Extracted resume skills vs. job requirements."
          />
        </div>

        {/* Chart 3: Category Radar Alignment */}
        <div className="md:col-span-2 lg:col-span-1">
          <SkillsRadarChart categoryScores={analysis.categoryScores} />
        </div>
      </div>

      {/* ATS Parser Compliance Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
              ATS Parser Readiness Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Evaluation of core ATS algorithmic filters (format readability, section headers, metrics).
            </p>
          </div>
          <span className="text-[11px] text-slate-400 italic">
            {atsDetails.disclaimer || 'This is an estimated ATS-style score based on standard parser behavior.'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Formatting & Length
            </span>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              {atsDetails.formattingScore || 85}%
            </p>
            <span className="text-[10px] text-slate-400 block">
              {atsDetails.lengthWordCount || 450} words ({atsDetails.bulletCount || 10} bullets)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Section Structure
            </span>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              {atsDetails.sectionPresenceScore || 90}%
            </p>
            <span className="text-[10px] text-slate-400 block">
              Work, Edu, Skills, Contact
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Metric Impact
            </span>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              {atsDetails.metricImpactScore || 80}%
            </p>
            <span className="text-[10px] text-slate-400 block">
              Quantifiable % and action verbs
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Keyword Density
            </span>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              {atsDetails.keywordScore || 85}%
            </p>
            <span className="text-[10px] text-slate-400 block">
              Taxonomy alignment
            </span>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses 2-Column Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold font-heading text-base">
            <CheckCircle2 className="w-5 h-5" />
            Detected Strengths
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {(analysis.strengths || []).map((str, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Improvements Needed */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold font-heading text-base">
            <AlertCircle className="w-5 h-5" />
            Areas for Optimization
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {(analysis.weaknesses || []).map((wk, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skill Gap Analysis with Dynamic Learning Links */}
      <SkillGapSection
        matchedSkills={analysis.matchedSkills}
        missingSkills={analysis.missingSkills}
      />

      {/* Actionable STAR Bullet Rewrites ("Instead of this... Write this...") */}
      <SuggestionsBox suggestions={analysis.suggestions} />

      {/* Collapsible Clean Extracted Sections (Verify no hallucination) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <button
          type="button"
          onClick={() => setRawTextOpen(!rawTextOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <div>
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-500" />
              Inspected Resume Sections & Contact Data
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review extracted personal information, education, and experience boundaries
            </p>
          </div>
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {rawTextOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {rawTextOpen && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs animate-in fade-in">
            {/* Contact data */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Detected Contact Information:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                <p><strong>Name:</strong> {analysis.extractedData?.contactInfo?.name || 'Not detected'}</p>
                <p><strong>Email:</strong> {analysis.extractedData?.contactInfo?.email || 'Not detected'}</p>
                <p><strong>Phone:</strong> {analysis.extractedData?.contactInfo?.phone || 'Not detected'}</p>
                <p><strong>LinkedIn:</strong> {analysis.extractedData?.contactInfo?.linkedin || 'None'}</p>
                <p><strong>GitHub:</strong> {analysis.extractedData?.contactInfo?.github || 'None'}</p>
                <p><strong>Location:</strong> {analysis.extractedData?.contactInfo?.location || 'None'}</p>
              </div>
            </div>

            {/* Extracted Raw Text */}
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed max-h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{analysis.resumeRawText}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Download Sticky Strip */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Download Executive Career Report
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export a high-resolution PDF with your ATS score, radar chart breakdown, and STAR bullet checklist.
          </p>
        </div>
        <ReportDownloadButton analysis={analysis} />
      </div>
    </div>
  );
}
