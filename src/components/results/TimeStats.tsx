
import React from 'react';
import { Clock } from 'lucide-react';

interface TimeStatsProps {
  timeSpent: number;
  timeLimit: number;
  formatTime: (seconds: number) => string;
}

const TimeStats: React.FC<TimeStatsProps> = ({ timeSpent, timeLimit, formatTime }) => {
  return (
    <div className="bg-secondary/50 rounded-xl p-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
        Time Statistics
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Time spent</span>
          <span className="font-medium">{formatTime(timeSpent)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Time limit</span>
          <span className="font-medium">{formatTime(timeLimit)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Completion</span>
          <span className="font-medium">{Math.round((timeSpent / timeLimit) * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default TimeStats;
