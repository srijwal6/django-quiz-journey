
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, Trash } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import QuestionForm, { FormQuestion } from '@/components/QuestionForm';
import { saveQuizSet } from '@/utils/quizData';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const AddQuizSet = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalMarks, setTotalMarks] = useState(100);
  const [timeLimit, setTimeLimit] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<FormQuestion[]>([
    {
      tempId: crypto.randomUUID(),
      type: 'multiple-choice',
      section: 'mcq',
      questionText: '',
      text: '',
      options: [
        { id: 'a', text: '', isCorrect: false },
        { id: 'b', text: '', isCorrect: false },
        { id: 'c', text: '', isCorrect: false },
        { id: 'd', text: '', isCorrect: false }
      ],
      correctAnswer: 'a',
      marks: 2
    }
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        tempId: crypto.randomUUID(),
        type: 'multiple-choice',
        section: 'mcq',
        questionText: '',
        text: '',
        options: [
          { id: 'a', text: '', isCorrect: false },
          { id: 'b', text: '', isCorrect: false },
          { id: 'c', text: '', isCorrect: false },
          { id: 'd', text: '', isCorrect: false }
        ],
        correctAnswer: 'a',
        marks: 2
      }
    ]);
  };

  const handleRemoveQuestion = (tempId: string) => {
    setQuestions(questions.filter(q => q.tempId !== tempId));
  };

  const handleQuestionChange = (tempId: string, updatedQuestion: Partial<FormQuestion>) => {
    setQuestions(questions.map(q => 
      q.tempId === tempId ? { ...q, ...updatedQuestion } : q
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }
    
    if (!description.trim()) {
      toast.error('Please enter a quiz description');
      return;
    }
    
    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }
    
    // Check if all questions have text
    const incompleteQuestion = questions.find(q => !q.questionText.trim());
    if (incompleteQuestion) {
      toast.error('All questions must have text');
      return;
    }
    
    // For MCQ questions, check if all have options and a correct answer
    const incompleteMcq = questions.find(q => 
      q.section === 'mcq' && 
      q.options && q.options.some(opt => {
        const optionText = typeof opt === 'string' ? opt : opt.text;
        return !optionText.trim();
      })
    );
    if (incompleteMcq) {
      toast.error('All multiple choice questions must have complete options and a correct answer');
      return;
    }

    // Transform the questions to the final format
    const finalQuestions = questions.map((q, index) => ({
      id: `${index + 1}`,
      type: q.type,
      section: q.section,
      text: q.questionText, // Use the text field for the API
      questionText: q.questionText, // Keep questionText for UI components
      marks: q.marks,
      ...(q.section === 'mcq' && q.options ? { 
        options: q.options,
        correctAnswer: q.correctAnswer 
      } : {}),
      ...(q.section === 'coding' || q.section === 'debugging' ? { 
        code: q.codeSnippet,
        codeSnippet: q.codeSnippet,
        correctAnswer: q.correctAnswer 
      } : {})
    }));

    // Create the quiz set ID from the title
    const id = title.toLowerCase().replace(/\s+/g, '-');
    
    // Calculate total time in seconds
    const timeLimitInSeconds = timeLimit * 60 * 60;
    
    try {
      setIsSubmitting(true);
      
      // Add the quiz set to both local state and database
      const result = await saveQuizSet({
        id,
        title,
        description,
        totalMarks,
        timeLimit: timeLimitInSeconds,
        questions: finalQuestions
      });
      
      if (result) {
        toast.success('Quiz set added successfully');
        navigate('/quizzes');
      } else {
        throw new Error('Failed to save quiz set');
      }
    } catch (error) {
      console.error('Error adding quiz set:', error);
      toast.error('Failed to add quiz set');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-20 px-4 max-w-4xl mx-auto">
          <div className="my-10">
            <h1 className="text-3xl font-bold mb-2">Add New Quiz Set</h1>
            <p className="text-muted-foreground">
              Create a new quiz set with multiple choice, coding, and debugging questions
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Set Details</CardTitle>
                <CardDescription>
                  Enter the basic information for your quiz set
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Django Technical Test - Set 3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Enter a brief description of the quiz"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="totalMarks">Total Marks</Label>
                    <Input 
                      id="totalMarks" 
                      type="number"
                      min="1"
                      value={totalMarks} 
                      onChange={e => setTotalMarks(Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (hours)</Label>
                    <Input 
                      id="timeLimit" 
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={timeLimit} 
                      onChange={e => setTimeLimit(Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Questions</h2>
                <Button 
                  type="button" 
                  onClick={handleAddQuestion} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>
              
              {questions.map((question, index) => (
                <QuestionForm
                  key={question.tempId}
                  question={question}
                  questionNumber={index + 1}
                  onChange={(updates) => handleQuestionChange(question.tempId, updates)}
                  onRemove={() => handleRemoveQuestion(question.tempId)}
                />
              ))}
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                size="lg"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-current rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Quiz Set
                  </>
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AddQuizSet;
