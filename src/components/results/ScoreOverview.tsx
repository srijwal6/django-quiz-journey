
import React from 'react';
import { Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreOverviewProps {
  score: number;
  totalMarks: number;
  percentage: number;
  gradeInfo: {
    grade: string;
    label: string;
  };
}

const ScoreOverview: React.FC<ScoreOverviewProps> = ({ 
  score, 
  totalMarks, 
  percentage, 
  gradeInfo 
}) => {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      <div className="mb-6">
        <div className="relative">
          <svg className="w-36 h-36">
            <circle
              className="text-gray-200"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r="64"
              cx="72"
              cy="72"
            />
            <circle
              className={cn({
                'text-green-500': percentage >= 70,
                'text-amber-500': percentage >= 50 && percentage < 70,
                'text-red-500': percentage < 50
              })}
              strokeWidth="6"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="64"
              cx="72"
              cy="72"
              strokeDasharray={`${percentage * 4.02} 402`}
              strokeDashoffset="0"
            />
          </svg>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
            <p className="text-4xl font-bold">{percentage}%</p>
            <p className="text-lg text-muted-foreground">Score</p>
          </div>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
      <p className="text-muted-foreground mb-4">
        You scored {score} out of {totalMarks} marks
      </p>
      
      <div className={cn("px-4 py-2 rounded-full text-white font-medium flex items-center", {
        'bg-green-500': percentage >= 70,
        'bg-amber-500': percentage >= 50 && percentage < 70,
        'bg-red-500': percentage < 50
      })}>
        <Award className="h-5 w-5 mr-2" />
        <span>Grade {gradeInfo.grade}: {gradeInfo.label}</span>
      </div>
    </div>
  );
};

export default ScoreOverview;
