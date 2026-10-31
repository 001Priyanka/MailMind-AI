import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-slate-50/70 rounded-lg border border-slate-100">
          <div className="w-8 h-8 bg-slate-200 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-3 bg-slate-100 rounded w-3/4" />
          </div>
          <div className="w-20 h-5 bg-slate-200 rounded shrink-0" />
          <div className="w-16 h-5 bg-slate-200 rounded shrink-0" />
          <div className="w-24 h-4 bg-slate-100 rounded shrink-0" />
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200 animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="w-9 h-9 bg-slate-200 rounded-lg" />
      </div>
      <div className="h-8 bg-slate-200 rounded w-1/2" />
      <div className="h-4 bg-slate-100 rounded w-2/3 pt-2" />
    </div>
  );
};
