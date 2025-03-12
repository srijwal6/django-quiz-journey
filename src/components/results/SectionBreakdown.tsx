
import React from 'react';
import { BarChart } from 'lucide-react';

interface SectionScores {
  mcq: { score: number; total: number };
  coding: { score: number; total: number };
  debugging: { score: number; total: number };
}

interface SectionBreakdownProps {
  sectionScores: SectionScores;
}

const SectionBreakdown: React.FC<SectionBreakdownProps> = ({ sectionScores }) => {
  return (
    <div className="bg-secondary/50 rounded-xl p-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <BarChart className="h-5 w-5 mr-2 text-muted-foreground" />
        Section Breakdown
      </h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">MCQ Section</span>
            <span className="font-medium">{sectionScores.mcq.score}/{sectionScores.mcq.total}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${(sectionScores.mcq.score / sectionScores.mcq.total) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Coding Section</span>
            <span className="font-medium">{sectionScores.coding.score}/{sectionScores.coding.total}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full"
              style={{ width: `${(sectionScores.coding.score / sectionScores.coding.total) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Debugging Section</span>
            <span className="font-medium">{sectionScores.debugging.score}/{sectionScores.debugging.total}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${(sectionScores.debugging.score / sectionScores.debugging.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionBreakdown;
