
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { quizSets } from '@/utils/quizData';
import { Clock, FileText, FileCode, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QuizSelection = () => {
  const navigate = useNavigate();

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
            <h1 className="text-3xl font-bold mb-2">Select a Quiz</h1>
            <p className="text-muted-foreground">
              Choose from one of our technical tests to assess your skills
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/add-quiz')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Quiz
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {quizSets.map(quizSet => (
            <div 
              key={quizSet.id} 
              className="glass-card h-full rounded-2xl p-6 cursor-pointer transition-transform hover:scale-[1.01] hover:shadow-lg"
              onClick={() => handleSelectQuiz(quizSet.id)}
            >
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-medium mb-2">{quizSet.title}</h3>
                <p className="text-muted-foreground mb-6 flex-grow">
                  {quizSet.description}
                </p>
                
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
      </main>
    </div>
  );
};

export default QuizSelection;
