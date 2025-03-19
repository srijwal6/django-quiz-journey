
import React, { useState, useEffect } from 'react';
import { Question } from '@/utils/quizData';
import { ChevronRight, ChevronLeft, Code, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  question: Question;
  onAnswer: (questionId: string, answer: string) => void;
  currentAnswer?: string;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  question,
  onAnswer,
  currentAnswer,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}) => {
  const [code, setCode] = useState(currentAnswer || question.codeSnippet || question.code || '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  useEffect(() => {
    if (currentAnswer) {
      setCode(currentAnswer);
      setIsSubmitted(true);
    } else {
      setCode(question.codeSnippet || question.code || '');
      setIsSubmitted(false);
    }
  }, [question.id, currentAnswer, question.codeSnippet, question.code]);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };
  
  const handleSubmit = () => {
    onAnswer(question.id, code);
    setIsSubmitted(true);
  };
  
  return (
    <div className="glass-card rounded-2xl p-8 w-full max-w-4xl mx-auto animate-scale-in">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {question.section === 'coding' ? 'Coding Question' : 'Debugging Challenge'} {question.id}
          </span>
          <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">
            {question.marks} Marks
          </span>
        </div>
        <h3 className="text-xl font-medium mt-2">{question.questionText || question.text}</h3>
      </div>
      
      <div className="mt-6 border rounded-lg overflow-hidden bg-slate-950">
        <div className="bg-slate-900 px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <Code className="h-4 w-4 text-slate-400 mr-2" />
            <span className="text-sm text-slate-300 font-mono">
              {question.section === 'coding' ? 'Python Code' : 'Debug This Code'}
            </span>
          </div>
          {isSubmitted && (
            <div className="flex items-center text-green-400 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Submitted</span>
            </div>
          )}
        </div>
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="w-full bg-slate-950 text-slate-200 p-4 font-mono text-sm min-h-[300px] resize-none focus:outline-none"
          spellCheck="false"
          disabled={isSubmitted}
        />
      </div>
      
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
        
        <div className="flex gap-2">
          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all"
            >
              Submit Answer
            </button>
          )}
          
          <button
            onClick={onNext}
            disabled={!hasNext && !isSubmitted}
            className={cn(
              "flex items-center px-4 py-2 rounded-lg transition-all",
              (hasNext || isSubmitted)
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
    </div>
  );
};

export default CodeEditor;
