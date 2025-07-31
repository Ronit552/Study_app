
import React from 'react';
import { formatDuration } from '../../lib/time';
import { TimerCategory } from '../../types';

interface TimerDisplayProps {
  category: TimerCategory | 'Break';
  elapsedSeconds: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ category, elapsedSeconds }) => {
    const categoryColor =
        category === 'Break'
        ? 'text-cyan-400'
        : category === TimerCategory.STUDY
        ? 'text-indigo-400'
        : 'text-emerald-400';

    const title = category === 'Break' ? 'On a Break' : `${category} Timer`;

    return (
        <div className="flex flex-col items-center justify-center">
            <h2 className={`text-2xl font-bold mb-4 ${categoryColor}`}>{title}</h2>
            <div className="font-mono text-7xl md:text-8xl lg:text-9xl tracking-tighter text-foreground">
                {formatDuration(elapsedSeconds)}
            </div>
        </div>
    );
};

export default TimerDisplay;
