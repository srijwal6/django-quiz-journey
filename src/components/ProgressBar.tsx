
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  section: 'mcq' | 'coding' | 'debugging';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentQuestion, 
  totalQuestions, 
  section 
}) => {
  const progress = (currentQuestion / totalQuestions) * 100;
  
  const getSectionTitle = (section: string) => {
    switch(section) {
      case 'mcq':
        return 'Multiple Choice';
      case 'coding':
        return 'Coding Questions';
      case 'debugging':
        return 'Debugging Questions';
      default:
        return section;
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {getSectionTitle(section)}
          </span>
          <span className="ml-2 px-2 py-0.5 text-xs bg-secondary rounded-full">
            {currentQuestion} of {totalQuestions}
          </span>
        </div>
        <span className="text-sm font-medium">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500 ease-out rounded-full", {
            "bg-blue-500": section === 'mcq',
            "bg-amber-500": section === 'coding',
            "bg-purple-500": section === 'debugging',
          })}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
