
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailySummary, TimerCategory } from '../../types';
import { formatDuration } from '../../lib/time';
import { useTheme } from '../../contexts/ThemeContext';

interface HistoryChartProps {
  data: DailySummary[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#A1A1AA' : '#71717A'; // zinc-400 : zinc-500

  const chartData = data.map(summary => ({
    name: summary.date.substring(5), // "MM-DD"
    Study: summary[TimerCategory.STUDY] / 3600, // hours
    Coding: summary[TimerCategory.CODING] / 3600, // hours
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "hsl(var(--border))" : "hsl(var(--border))"} />
        <XAxis dataKey="name" stroke={tickColor} />
        <YAxis 
          stroke={tickColor}
          tickFormatter={(value) => `${value}h`}
        />
        <Tooltip
          formatter={(value: number) => formatDuration(value * 3600)}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))'
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Legend wrapperStyle={{color: 'hsl(var(--foreground))'}}/>
        <Bar dataKey="Study" stackId="a" fill="#8884d8" name="Study" />
        <Bar dataKey="Coding" stackId="a" fill="#82ca9d" name="Coding" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HistoryChart;
