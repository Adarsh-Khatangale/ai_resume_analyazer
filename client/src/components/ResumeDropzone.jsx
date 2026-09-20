import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle, X, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ResumeDropzone({ file, onFileSelect, onFileRemove }) {
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setErrorMessage('');

      if (rejectedFiles && rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors.some((e) => e.code === 'file-too-large')) {
          setErrorMessage('File size exceeds the 5MB limit. Please upload a smaller document.');
        } else if (rejection.errors.some((e) => e.code === 'file-invalid-type')) {
          setErrorMessage('Unsupported file format. Please upload a PDF, DOC, or DOCX resume.');
        } else {
          setErrorMessage(rejection.errors[0]?.message || 'File upload failed. Please try again.');
        }
        return;
      }

      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-3">
      {file ? (
        /* Selected File Card */
        <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/30 border-2 border-brand-300 dark:border-brand-800 flex items-center justify-between animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {file.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatFileSize(file.size)} • Ready for zero-retention analysis
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onFileRemove}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Remove selected file"
            aria-label="Remove uploaded file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* Dropzone Active Area */
        <div
          {...getRootProps()}
          className={`relative p-8 sm:p-10 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center group ${
            isDragActive
              ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/40 scale-[1.01]'
              : 'border-slate-300 hover:border-brand-400 dark:border-slate-700 dark:hover:border-brand-600 bg-slate-50/50 hover:bg-brand-50/30 dark:bg-slate-900/40'
          }`}
        >
          <input {...getInputProps()} aria-label="Upload Resume File" />

          <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">
            {isDragActive ? 'Drop your resume file here' : 'Drag & drop your resume here, or browse'}
          </h4>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Supports PDF, DOC, DOCX up to 5MB (Layout-aware 2-column support)
          </p>

          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero-Retention: File destroyed from memory immediately after text extraction
          </div>
        </div>
      )}

      {/* Error Message Box */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
