import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ActivityChartProps {
  data: {
    date: string;
    day: string;
    received: number;
    analyzed: number;
    important: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg text-xs space-y-1.5 border border-slate-800">
        <p className="font-semibold text-slate-300">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-bold text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            dy={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
            dx={-6}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingBottom: '16px', fontSize: '12px', color: '#64748b' }}
          />
          <Bar
            name="Received"
            dataKey="received"
            fill="#94a3b8"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            name="AI Analyzed"
            dataKey="analyzed"
            fill="#6366f1"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            name="Important Flagged"
            dataKey="important"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
