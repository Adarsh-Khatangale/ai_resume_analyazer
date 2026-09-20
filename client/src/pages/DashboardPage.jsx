import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, analysisAPI } from '../services/api';
import {
  FileText,
  PlusCircle,
  TrendingUp,
  CheckCircle,
  Clock,
  Trash2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  BarChart3,
  Award,
} from 'lucide-react';
import { toast } from 'react-toastify';
import GuestBanner from '../components/GuestBanner';
import ReportDownloadButton from '../components/ReportDownloadButton';

export default function DashboardPage() {
  const { user, isAuthenticated, guestAnalysis } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalScans: 0,
    avgAts: 0,
    avgMatch: 0,
    bestMatch: 0,
  });
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [profileRes, analysisRes] = await Promise.all([
        userAPI.getProfile(),
        analysisAPI.getAll(),
      ]);

      if (profileRes.data?.stats) {
        setStats(profileRes.data.stats);
      }
      if (analysisRes.data?.analyses) {
        setAnalyses(analysisRes.data.analyses);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAuthenticated]);

  const handleDeleteAnalysis = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;

    try {
      await analysisAPI.delete(id);
      toast.success('Analysis deleted.');
      setAnalyses((prev) => prev.filter((a) => a._id !== id));
      setStats((prev) => ({
        ...prev,
        totalScans: Math.max(0, prev.totalScans - 1),
      }));
    } catch (err) {
      toast.error('Failed to delete analysis: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Guest Mode Callout */}
      {!isAuthenticated && <GuestBanner />}

      {/* Welcome & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            {isAuthenticated ? `Welcome back, ${user.name.split(' ')[0]} 👋` : 'Career Analytics Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track ATS formatting readiness, skill taxonomy coverage, and target job alignment over time.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/20 transition-all hover:scale-105 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          New Resume Scan
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Scans */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Scans
            </span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            {isAuthenticated ? stats.totalScans : guestAnalysis ? 1 : 0}
          </p>
          <span className="text-[11px] text-slate-400 block">
            {isAuthenticated ? 'Saved in account history' : 'Guest session active'}
          </span>
        </div>

        {/* Card 2: Average ATS Score */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Avg ATS Score
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            {isAuthenticated ? stats.avgAts : guestAnalysis ? guestAnalysis.atsScore : 0}
            <span className="text-sm font-normal text-slate-400">/100</span>
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">
            Parser formatting compliance
          </span>
        </div>

        {/* Card 3: Average Job Match */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Avg Job Match
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            {isAuthenticated ? stats.avgMatch : guestAnalysis ? guestAnalysis.matchScore : 0}%
          </p>
          <span className="text-[11px] text-slate-400 block">
            Skill keyword overlap ratio
          </span>
        </div>

        {/* Card 4: Top Match Score */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Peak Match
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            {isAuthenticated ? stats.bestMatch : guestAnalysis ? guestAnalysis.matchScore : 0}%
          </p>
          <span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium block">
            Highest recorded alignment
          </span>
        </div>
      </div>

      {/* Guest Active Analysis Quick Card */}
      {!isAuthenticated && guestAnalysis && (
        <div className="p-6 rounded-3xl bg-brand-50/60 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
                Active Guest Analysis
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {guestAnalysis.jobTitle}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/results"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors"
              >
                View Full Scorecard
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Scans Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 dark:text-white">
              Recent Resume Scans
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Historical performance for job-tailored resumes
            </p>
          </div>
          {isAuthenticated && analyses.length > 0 && (
            <Link
              to="/history"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              View All History
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {analyses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="pb-3 font-semibold">Target Job Role</th>
                  <th className="pb-3 font-semibold text-center">ATS Score</th>
                  <th className="pb-3 font-semibold text-center">Job Match</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {analyses.slice(0, 5).map((scan) => (
                  <tr
                    key={scan._id}
                    onClick={() => navigate(`/results?id=${scan._id}`)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-4 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="truncate max-w-[220px] sm:max-w-xs">{scan.jobTitle}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-xs bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                        {scan.atsScore}/100
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          scan.matchScore >= 75
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : scan.matchScore >= 50
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                        }`}
                      >
                        {scan.matchScore}%
                      </span>
                    </td>
                    <td className="py-4 text-slate-500 dark:text-slate-400 text-xs">
                      {new Date(scan.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => handleDeleteAnalysis(scan._id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No analyses saved yet
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Scan your resume against a target job description to compute your ATS score and skill gaps.
            </p>
            <div className="pt-2">
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Start First Resume Scan
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
