import React from 'react';
import { EmailCategory, EmailPriority, EmailStatus } from '../../services/types';

interface PriorityBadgeProps {
  priority: EmailPriority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  switch (priority) {
    case 'High':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" />
          High Priority
        </span>
      );
    case 'Medium':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
          Medium Priority
        </span>
      );
    case 'Low':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200/80 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />
          Low Priority
        </span>
      );
  }
};

interface CategoryBadgeProps {
  category: EmailCategory;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className = '' }) => {
  const styles: Record<EmailCategory, string> = {
    Important: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    Work: 'bg-blue-50 text-blue-700 border-blue-200/80',
    Personal: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    Promotional: 'bg-orange-50 text-orange-700 border-orange-200/80',
    Finance: 'bg-violet-50 text-violet-700 border-violet-200/80',
    Updates: 'bg-slate-50 text-slate-700 border-slate-200/80',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[category] || 'bg-slate-100 text-slate-700 border-slate-200'} ${className}`}
    >
      {category}
    </span>
  );
};

interface StatusBadgeProps {
  status: EmailStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'Action Required':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200/60 ${className}`}>
          Action Needed
        </span>
      );
    case 'Summary Generated':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200/60 ${className}`}>
          Summarized
        </span>
      );
    case 'Analyzed':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 ${className}`}>
          Analyzed
        </span>
      );
    case 'Archived':
    default:
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 ${className}`}>
          Archived
        </span>
      );
  }
};
