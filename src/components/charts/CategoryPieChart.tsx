import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface CategoryPieChartProps {
  data: {
    name: string;
    value: number;
    color: string;
    count: number;
  }[];
}

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-semibold text-slate-200">{data.name}</span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-4 font-mono text-[11px] text-slate-400">
          <span>{data.count} emails</span>
          <span className="text-white font-bold">{data.value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full h-72">
      <div className="w-full md:w-1/2 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomPieTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Structured Category Legend with Metrics */}
      <div className="w-full md:w-1/2 space-y-2 pr-2">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0"
          >
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-slate-700 truncate">{item.name}</span>
            </div>
            <div className="flex items-center gap-2 font-mono tabular-nums text-slate-500 shrink-0">
              <span>{item.count}</span>
              <span className="font-bold text-slate-900 w-9 text-right">{item.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
