import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CircularGauge({
  value = 0,
  maxValue = 100,
  label = 'Score',
  subtitle = '',
  size = 180,
  strokeWidth = 14,
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Smooth counter animation
    let start = 0;
    const end = Math.min(maxValue, Math.max(0, value));
    if (end === 0) {
      setDisplayValue(0);
      return;
    }
    const duration = 1000;
    const incrementTime = 20;
    const step = Math.ceil(end / (duration / incrementTime));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, maxValue]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / maxValue) * circumference;
  const strokeDashoffset = circumference - progress;

  // Color thresholds
  let strokeColor = '#10b981'; // Emerald
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
  let badgeText = 'Strong Match';

  if (value < 50) {
    strokeColor = '#f43f5e'; // Rose
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    badgeText = 'Needs Optimization';
  } else if (value < 75) {
    strokeColor = '#f59e0b'; // Amber
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    badgeText = 'Moderate Match';
  } else if (value >= 88) {
    strokeColor = '#8b5cf6'; // Violet
    badgeColor = 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-800';
    badgeText = 'Exceptional Alignment';
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax={maxValue}
          aria-label={`${label}: ${value} out of ${maxValue}`}
        >
          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            {displayValue}
            <span className="text-sm sm:text-base font-semibold text-slate-400">
              {maxValue === 100 ? '%' : ''}
            </span>
          </span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
            {label}
          </span>
        </div>
      </div>

      {/* Subtitle & Badge */}
      <div className="mt-4 space-y-1.5">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
          {badgeText}
        </span>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] leading-snug">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
