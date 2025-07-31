
import React from 'react';
import { TimerCategory, Goal, DailySummary } from '../../types';
import ProgressBar from '../ui/ProgressBar';
import { formatDuration } from '../../lib/time';

interface GoalProgressProps {
  goals: Goal;
  summary: DailySummary;
  category: TimerCategory;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goals, summary, category }) => {
  const goalMinutes = goals[category];
  const achievedSeconds = summary[category];
  const progress = goalMinutes > 0 ? (achievedSeconds / (goalMinutes * 60)) * 100 : 0;

  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className="font-medium text-sm text-foreground">{category}</span>
        <span className="text-sm text-muted-foreground">
          {formatDuration(achievedSeconds)} / {formatDuration(goalMinutes * 60)}
        </span>
      </div>
      <ProgressBar value={progress} />
    </div>
  );
};

export default GoalProgress;
