
import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, className }) => {
  const progress = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-secondary', className)}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
