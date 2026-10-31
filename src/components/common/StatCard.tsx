import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  description?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  description,
  icon: Icon,
  iconBgColor = 'bg-indigo-50',
  iconTextColor = 'text-indigo-600',
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mt-1.5 font-mono tabular-nums">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor} ${iconTextColor} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {change && (
          <span
            className={`font-semibold inline-flex items-center gap-1 font-mono ${
              changeType === 'positive'
                ? 'text-emerald-600'
                : changeType === 'negative'
                ? 'text-rose-600'
                : 'text-slate-600'
            }`}
          >
            {change.startsWith('+') || change.startsWith('-') ? '' : '+'}{change}
          </span>
        )}
        {description && <span className="text-slate-500 truncate">{description}</span>}
      </div>
    </div>
  );
};
