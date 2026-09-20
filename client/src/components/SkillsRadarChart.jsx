import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';

export default function SkillsRadarChart({ categoryScores = [] }) {
  if (!categoryScores || categoryScores.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-400">
        No category breakdown available for this analysis.
      </div>
    );
  }

  // Format data for Recharts Radar
  const chartData = categoryScores.map((item) => ({
    category: item.category,
    'Your Skills': item.candidateScore,
    'Target Job Need': item.requiredScore,
    fullMark: 100,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl p-3 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-lg text-xs space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">{payload[0].payload.category}</p>
          <p className="text-brand-600 dark:text-brand-400 font-semibold">
            Your Alignment: {payload[0].value}%
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Target Demand: {payload[1]?.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white mb-1">
          Skill Alignment by Category
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Radar comparison of candidate proficiencies vs. target role expectations
        </p>
      </div>

      <div className="w-full h-72 sm:h-80 -my-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#94a3b8" strokeOpacity={0.25} />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 9 }}
              strokeOpacity={0.2}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Your Skills"
              dataKey="Your Skills"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.45}
            />
            <Radar
              name="Target Job Need"
              dataKey="Target Job Need"
              stroke="#0ea5e9"
              fill="#0ea5e9"
              fillOpacity={0.15}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>Balanced profile across technical & soft disciplines</span>
        <span className="font-semibold text-brand-600 dark:text-brand-400">Scale: 0 - 100%</span>
      </div>
    </div>
  );
}
