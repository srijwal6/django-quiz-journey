
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Question } from '@/utils/quizData';
import { CheckCircle, Circle, ChevronRight, ChevronLeft } from 'lucide-react';

interface QuizCardProps {
  question: Question;
  onAnswer: (questionId: string, answer: string | number) => void;
  selectedAnswer?: string | number;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  onAnswer,
  selectedAnswer,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}) => {
  const handleSelectOption = (optionId: string) => {
    onAnswer(question.id, optionId);
  };
  
  return (
    <div className="glass-card rounded-2xl p-8 w-full max-w-3xl mx-auto animate-scale-in">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Question {question.id}
          </span>
          <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">
            {question.marks} Marks
          </span>
        </div>
        <h3 className="text-xl font-medium mt-2">{question.questionText || question.text}</h3>
      </div>

      {question.section === 'mcq' && question.options && (
        <div className="space-y-3 mt-6">
          {question.options.map((option, index) => {
            const optionId = typeof option === 'object' ? option.id : String(index);
            const optionText = typeof option === 'object' ? option.text : option;
            
            return (
              <button
                key={optionId}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center",
                  selectedAnswer === optionId
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary"
                )}
                onClick={() => handleSelectOption(optionId)}
              >
                {selectedAnswer === optionId ? (
                  <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                )}
                <span>{optionText}</span>
              </button>
            );
          })}
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={cn(
            "flex items-center px-4 py-2 rounded-lg transition-all",
            hasPrevious
              ? "text-foreground hover:bg-secondary"
              : "text-muted-foreground opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>
        
        <button
          onClick={onNext}
          disabled={!hasNext && selectedAnswer === undefined}
          className={cn(
            "flex items-center px-4 py-2 rounded-lg transition-all",
            (hasNext || selectedAnswer !== undefined)
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {hasNext ? (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          ) : (
            "Complete Section"
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
