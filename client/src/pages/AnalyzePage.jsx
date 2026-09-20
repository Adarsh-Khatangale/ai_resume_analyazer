import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analysisAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  Sparkles,
  FileText,
  Briefcase,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import ResumeDropzone from '../components/ResumeDropzone';
import SkeletonLoader from '../components/SkeletonLoader';
import {
  SAMPLE_JOB_TITLE,
  SAMPLE_JOB_DESCRIPTION,
  SAMPLE_RESUME_TEXT,
} from '../utils/sampleData';

export default function AnalyzePage() {
  const { isAuthenticated, saveGuestAnalysis } = useAuth();
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);
  const [pasteResumeOpen, setPasteResumeOpen] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoadSample = () => {
    setJobTitle(SAMPLE_JOB_TITLE);
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setResumeText(SAMPLE_RESUME_TEXT);
    setFile(null);
    setPasteResumeOpen(true);
    toast.info('Sample Full-Stack Engineer Resume & JD loaded! Click "Analyze Resume" to test.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobTitle.trim()) {
      toast.error('Please specify the target job title.');
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 40) {
      toast.error('Please paste a complete job description (at least 40 characters).');
      return;
    }

    if (!file && (!resumeText || resumeText.trim().length < 50)) {
      toast.error('Please upload a resume file (.pdf, .doc, .docx) or paste your resume text.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('jobTitle', jobTitle);
      formData.append('jobDescription', jobDescription);

      if (file) {
        formData.append('resume', file);
      } else {
        formData.append('resumeText', resumeText);
      }

      let res;
      if (isAuthenticated) {
        res = await analysisAPI.analyze(formData);
      } else {
        res = await analysisAPI.guestAnalyze(formData);
        if (res.data?.analysis) {
          saveGuestAnalysis(res.data.analysis);
        }
      }

      toast.success('Analysis completed successfully!');

      const result = res.data.analysis;
      navigate('/results', { state: { analysis: result } });
    } catch (err) {
      console.error('Analysis error:', err);
      toast.error(err.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            Targeted Resume Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare your resume against a specific job posting to uncover ATS compatibility and missing keywords.
          </p>
        </div>

        {/* 1-Click Sample Pre-Fill Button */}
        <button
          type="button"
          onClick={handleLoadSample}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 transition-colors self-start sm:self-auto shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-brand-500" />
          Load Sample Full-Stack Resume & JD
        </button>
      </div>

      {/* Main Analysis Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Target Role Title */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <label
            htmlFor="jobTitle"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4 text-brand-500" />
            1. Target Job Title
          </label>
          <input
            id="jobTitle"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Full-Stack Engineer, Frontend Developer, DevOps Specialist..."
            required
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-900 dark:text-white"
          />
        </div>

        {/* Step 2: Paste Job Description */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="jobDescription"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-brand-500" />
              2. Complete Job Description
            </label>
            <span className="text-[11px] text-slate-400">
              {jobDescription.length} characters
            </span>
          </div>
          <textarea
            id="jobDescription"
            rows={7}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job posting here (including Responsibilities, Requirements, Tech Stack, and Qualifications)..."
            required
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm font-mono text-slate-900 dark:text-white leading-relaxed resize-y"
          />
        </div>

        {/* Step 3: Drag and Drop Resume File */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <UploadCloud className="w-4 h-4 text-brand-500" />
            3. Upload Resume (.pdf, .doc, .docx - max 5MB)
          </label>

          <ResumeDropzone
            file={file}
            onFileSelect={(selectedFile) => {
              setFile(selectedFile);
              setResumeText(''); // clear text if file uploaded
            }}
            onFileRemove={() => setFile(null)}
          />

          {/* Alternative direct text paste option */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={() => setPasteResumeOpen(!pasteResumeOpen)}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              {pasteResumeOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {pasteResumeOpen ? 'Hide raw text input' : 'Or paste resume text directly instead of file'}
            </button>

            {pasteResumeOpen && (
              <div className="mt-3 space-y-1.5 animate-in fade-in">
                <textarea
                  rows={6}
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value);
                    if (e.target.value) setFile(null); // clear file if text entered
                  }}
                  placeholder="Paste your plain resume text here..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-mono text-slate-900 dark:text-white leading-relaxed resize-y"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Zero-Retention Policy: In-memory parsing only. Raw file destroyed post-scan.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-lg shadow-brand-500/25 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            Analyze Resume & Match Job
          </button>
        </div>
      </form>
    </div>
  );
}
