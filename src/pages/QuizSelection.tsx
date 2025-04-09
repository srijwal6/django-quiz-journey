
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { QuizSet, fetchQuizSets } from '@/utils/quizData';
import { Clock, FileText, FileCode, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const QuizSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizSets = async () => {
      try {
        setLoading(true);
        const sets = await fetchQuizSets();
        setQuizSets(sets);
      } catch (error) {
        console.error('Error loading test sets:', error);
        toast({
          title: 'Error',
          description: 'Failed to load test sets',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuizSets();
  }, [toast]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${hours}h ${minutes > 0 ? minutes + 'm' : ''}`;
  };

  const handleSelectQuiz = (quizSetId: string) => {
    navigate(`/quiz/${quizSetId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 px-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center my-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Select a Test</h1>
            <p className="text-muted-foreground">
              Choose from one of our technical tests to assess your skills
            </p>
          </div>
          
          {isAuthenticated && (
            <Button 
              onClick={() => navigate('/add-quiz')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Test
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : quizSets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No test sets available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {quizSets.map(quizSet => (
              <div 
                key={quizSet.id} 
                className="glass-card h-full rounded-2xl p-6 cursor-pointer transition-transform hover:scale-[1.01] hover:shadow-lg"
                onClick={() => handleSelectQuiz(quizSet.id)}
              >
                <div className="flex flex-col h-full">
                  <h3 className="text-xl font-medium mb-6">{quizSet.title}</h3>
                  
                  <div className="border-t pt-4 mt-auto">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                        <span>{formatTime(quizSet.timeLimit)}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <FileText className="h-4 w-4 mr-1.5 text-muted-foreground" />
                        <span>{quizSet.totalMarks} Points</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <FileCode className="h-4 w-4 mr-1.5 text-muted-foreground" />
                        <span>{quizSet.questions.length} Questions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizSelection;
