import React, { useState } from 'react';
import { Download, FileCheck, Loader2 } from 'lucide-react';
import { exportAnalysisToPdf } from '../services/pdfExport';
import { toast } from 'react-toastify';

export default function ReportDownloadButton({ analysis, className = '' }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!analysis) {
      toast.error('No analysis data available to download.');
      return;
    }

    try {
      setDownloading(true);
      // Small timeout for user interaction response
      setTimeout(() => {
        exportAnalysisToPdf(analysis);
        toast.success('Executive PDF report downloaded successfully!');
        setDownloading(false);
      }, 300);
    } catch (err) {
      console.error('PDF export failed:', err);
      toast.error('Failed to generate PDF report: ' + err.message);
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 ${className}`}
      title="Download complete analysis report as an Executive PDF"
    >
      {downloading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Download PDF Report</span>
        </>
      )}
    </button>
  );
}
