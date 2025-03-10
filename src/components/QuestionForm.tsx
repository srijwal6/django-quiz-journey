
import React from 'react';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Question } from '@/utils/quizData';

interface QuestionFormProps {
  question: Omit<Question, 'id'> & { tempId: string };
  questionNumber: number;
  onChange: (updates: Partial<Omit<Question, 'id'> & { tempId: string }>) => void;
  onRemove: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ 
  question, 
  questionNumber, 
  onChange, 
  onRemove 
}) => {
  const handleOptionChange = (index: number, value: string) => {
    if (!question.options) return;
    
    const newOptions = [...question.options];
    newOptions[index] = value;
    onChange({ options: newOptions });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Question {questionNumber}</CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRemove}
          className="h-8 w-8 text-destructive"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Question Type</Label>
          <Select 
            value={question.section} 
            onValueChange={(value) => onChange({ 
              section: value as 'mcq' | 'coding' | 'debugging',
              // Reset options for non-MCQ types
              ...((value !== 'mcq' && question.section === 'mcq') ? { 
                options: undefined, 
                correctAnswer: undefined,
                codeSnippet: ''
              } : {}),
              // Add options for MCQ type
              ...((value === 'mcq' && question.section !== 'mcq') ? { 
                options: ['', '', '', ''],
                correctAnswer: 0,
                codeSnippet: undefined
              } : {}),
              // Add codeSnippet for coding/debugging
              ...((value === 'coding' || value === 'debugging') && 
                (question.section !== 'coding' && question.section !== 'debugging') ? { 
                codeSnippet: '',
                correctAnswer: '',
                options: undefined
              } : {})
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mcq">Multiple Choice</SelectItem>
              <SelectItem value="coding">Coding</SelectItem>
              <SelectItem value="debugging">Debugging</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`q${questionNumber}-text`}>Question Text</Label>
          <Textarea 
            id={`q${questionNumber}-text`}
            value={question.questionText}
            onChange={(e) => onChange({ questionText: e.target.value })}
            placeholder="Enter your question text here"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`q${questionNumber}-marks`}>Marks</Label>
          <Input 
            id={`q${questionNumber}-marks`}
            type="number"
            min="1"
            value={question.marks || 2}
            onChange={(e) => onChange({ marks: Number(e.target.value) })}
          />
        </div>
        
        {question.section === 'mcq' && question.options && (
          <div className="space-y-4">
            <Label>Options</Label>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full">
                  {String.fromCharCode(97 + index)}
                </div>
                <Input 
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(97 + index)}`}
                />
              </div>
            ))}
            
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <Select 
                value={String(question.correctAnswer ?? 0)} 
                onValueChange={(value) => onChange({ correctAnswer: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>
                <SelectContent>
                  {question.options.map((_, index) => (
                    <SelectItem key={index} value={String(index)}>
                      Option {String.fromCharCode(97 + index)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {(question.section === 'coding' || question.section === 'debugging') && (
          <div className="space-y-2">
            <Label htmlFor={`q${questionNumber}-code`}>Code Snippet</Label>
            <Textarea 
              id={`q${questionNumber}-code`}
              value={question.codeSnippet || ''}
              onChange={(e) => onChange({ codeSnippet: e.target.value })}
              placeholder="Enter code snippet here"
              rows={6}
              className="font-mono text-sm"
            />
            
            <div className="mt-4">
              <Label htmlFor={`q${questionNumber}-answer`}>Correct Answer</Label>
              <Textarea 
                id={`q${questionNumber}-answer`}
                value={question.correctAnswer as string || ''}
                onChange={(e) => onChange({ correctAnswer: e.target.value })}
                placeholder="Enter the correct solution"
                rows={6}
                className="font-mono text-sm"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionForm;
