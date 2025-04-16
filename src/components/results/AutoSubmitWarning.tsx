
import React from 'react';
import { Clock } from 'lucide-react';

interface AutoSubmitWarningProps {
  autoSubmitted: boolean;
  formattedResults?: string;
}

const AutoSubmitWarning: React.FC<AutoSubmitWarningProps> = ({ 
  autoSubmitted, 
  formattedResults 
}) => {
  if (!autoSubmitted && !formattedResults) return null;
  
  return (
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
      {autoSubmitted && (
        <p className="flex items-center mb-4">
          <Clock className="h-5 w-5 mr-2" />
          <span>Your test was automatically submitted as the time limit was reached.</span>
        </p>
      )}
      
      {formattedResults && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-[500px] font-mono p-3 bg-amber-100/50 rounded">
            {formattedResults}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AutoSubmitWarning;
