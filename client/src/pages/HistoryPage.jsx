import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { analysisAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  History as HistoryIcon,
  Search,
  FileText,
  Trash2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function HistoryPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'ats' | 'match'

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/analyze');
      return;
    }

    setLoading(true);
    analysisAPI
      .getAll()
      .then((res) => {
        if (res.data?.analyses) {
          setAnalyses(res.data.analyses);
        }
      })
      .catch((err) => {
        toast.error('Failed to load history: ' + err.message);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this resume scan from your history?')) return;

    try {
      await analysisAPI.delete(id);
      toast.success('Scan removed from history.');
      setAnalyses((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      toast.error('Failed to delete: ' + err.message);
    }
  };

  // Filter and sort
  const filtered = analyses.filter((a) =>
    a.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  filtered.sort((a, b) => {
    if (sortBy === 'ats') return b.atsScore - a.atsScore;
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2.5">
            <HistoryIcon className="w-7 h-7 text-brand-500" />
            Resume Scan History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access previous ATS assessments, skill audits, and optimization recommendations.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all hover:scale-105 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          New Resume Scan
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role title..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          >
            <option value="date">Most Recent</option>
            <option value="ats">Highest ATS Score</option>
            <option value="match">Highest Job Match</option>
          </select>
        </div>
      </div>

      {/* Scan Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          Loading scan archive...
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/results?id=${item._id}`)}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => handleDelete(item._id, e)}
                    className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {item.jobTitle}
                </h3>
              </div>

              {/* Score Badges */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    ATS Score
                  </span>
                  <span className="text-sm font-extrabold text-brand-600 dark:text-brand-400">
                    {item.atsScore}/100
                  </span>
                </div>

                <div className="space-y-0.5 text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Job Match
                  </span>
                  <span
                    className={`text-sm font-extrabold ${
                      item.matchScore >= 75
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : item.matchScore >= 50
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {item.matchScore}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No scans match your criteria
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Try adjusting your search query or run a new scan.
          </p>
        </div>
      )}
    </div>
  );
}
