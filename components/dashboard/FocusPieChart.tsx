import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { TimerCategory } from '../../types';
import { formatDuration } from '../../lib/time';

interface PieChartData {
  name: TimerCategory;
  value: number; // in seconds
}

interface FocusPieChartProps {
  data: PieChartData[];
}

const COLORS = {
  [TimerCategory.STUDY]: '#8884d8',
  [TimerCategory.CODING]: '#82ca9d',
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent === 0) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-background border border-border rounded-md shadow-lg text-sm">
        <p className="label text-foreground">{`${data.name} : ${formatDuration(data.value)}`}</p>
      </div>
    );
  }
  return null;
};

const FocusPieChart: React.FC<FocusPieChartProps> = ({ data }) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  if (total === 0) {
      return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No focus data for this period.</p>
          </div>
      );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value, entry) => {
            const { payload } = entry;
            return <span style={{ color: 'hsl(var(--foreground))' }}>{value} ({formatDuration(payload?.value || 0)})</span>;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default FocusPieChart;
