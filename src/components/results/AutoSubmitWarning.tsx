
import React from 'react';
import { Clock } from 'lucide-react';

interface AutoSubmitWarningProps {
  autoSubmitted: boolean;
}

const AutoSubmitWarning: React.FC<AutoSubmitWarningProps> = ({ autoSubmitted }) => {
  if (!autoSubmitted) return null;
  
  return (
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
      <p className="flex items-center">
        <Clock className="h-5 w-5 mr-2" />
        <span>Your test was automatically submitted as the time limit was reached.</span>
      </p>
    </div>
  );
};

export default AutoSubmitWarning;
