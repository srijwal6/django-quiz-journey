
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProgressBar from '@/components/ProgressBar';
import QuizCard from '@/components/QuizCard';
import CodeEditor from '@/components/CodeEditor';
import { Question, QuizState, getQuestionsForSection, getQuizSetById } from '@/utils/quizData';
import { useToast } from '@/components/ui/use-toast';

const Quiz = () => {
  const navigate = useNavigate();
  const { quizSetId } = useParams<{ quizSetId: string }>();
  const { toast } = useToast();
  
  // Redirect to quiz selection if no quiz set ID is provided
  useEffect(() => {
    if (!quizSetId) {
      navigate('/quizzes');
      return;
    }
    
    const quizSet = getQuizSetById(quizSetId);
    if (!quizSet) {
      toast({
        title: "Quiz Not Found",
        description: "The requested quiz could not be found.",
        variant: "destructive"
      });
      navigate('/quizzes');
      return;
    }
  }, [quizSetId, navigate, toast]);
  
  const [quizState, setQuizState] = useState<QuizState>({
    quizSetId: quizSetId || null,
    currentSection: 'mcq',
    currentQuestionIndex: 0,
    answers: {},
    score: 0,
    timeRemaining: quizSetId ? getQuizSetById(quizSetId)?.timeLimit || 3 * 60 * 60 : 3 * 60 * 60,
    isCompleted: false
  });
  
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(
    quizSetId ? getQuestionsForSection(quizSetId, 'mcq') : []
  );
  
  // Initialize timer
  useEffect(() => {
    if (!quizSetId) return;
    
    const timer = setInterval(() => {
      setQuizState(prevState => {
        // If time ran out
        if (prevState.timeRemaining <= 1) {
          clearInterval(timer);
          navigate(`/results/${quizSetId}`, { 
            state: { 
              answers: prevState.answers, 
              timeSpent: getQuizSetById(quizSetId)?.timeLimit || 3 * 60 * 60,
              autoSubmitted: true
            } 
          });
          return { ...prevState, timeRemaining: 0 };
        }
        
        return { ...prevState, timeRemaining: prevState.timeRemaining - 1 };
      });
    }, 1000);
    
    // Cleanup timer
    return () => clearInterval(timer);
  }, [navigate, quizSetId]);
  
  // When section or quizSetId changes, update questions
  useEffect(() => {
    if (!quizSetId) return;
    
    setCurrentQuestions(getQuestionsForSection(quizSetId, quizState.currentSection));
  }, [quizState.currentSection, quizSetId]);
  
  const handleAnswerSubmit = (questionId: number, answer: string | number) => {
    setQuizState(prevState => ({
      ...prevState,
      answers: { ...prevState.answers, [questionId]: answer }
    }));
  };
  
  const handleNextQuestion = () => {
    if (quizState.currentQuestionIndex < currentQuestions.length - 1) {
      // Move to next question in current section
      setQuizState(prevState => ({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex + 1
      }));
    } else {
      // Move to next section or complete quiz
      if (quizState.currentSection === 'mcq') {
        toast({
          title: "Section Completed",
          description: "Moving to coding questions section",
        });
        setQuizState(prevState => ({
          ...prevState,
          currentSection: 'coding',
          currentQuestionIndex: 0
        }));
      } else if (quizState.currentSection === 'coding') {
        toast({
          title: "Section Completed",
          description: "Moving to debugging questions section",
        });
        setQuizState(prevState => ({
          ...prevState,
          currentSection: 'debugging',
          currentQuestionIndex: 0
        }));
      } else if (quizSetId) {
        // Quiz completed
        navigate(`/results/${quizSetId}`, { 
          state: { 
            answers: quizState.answers, 
            timeSpent: getQuizSetById(quizSetId)?.timeLimit || 3 * 60 * 60 - quizState.timeRemaining
          } 
        });
      }
    }
  };
  
  const handlePreviousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      // Move to previous question in current section
      setQuizState(prevState => ({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex - 1
      }));
    } else if (quizSetId) {
      // Move to previous section
      if (quizState.currentSection === 'coding') {
        const mcqQuestions = getQuestionsForSection(quizSetId, 'mcq');
        setQuizState(prevState => ({
          ...prevState,
          currentSection: 'mcq',
          currentQuestionIndex: mcqQuestions.length - 1
        }));
      } else if (quizState.currentSection === 'debugging') {
        const codingQuestions = getQuestionsForSection(quizSetId, 'coding');
        setQuizState(prevState => ({
          ...prevState,
          currentSection: 'coding',
          currentQuestionIndex: codingQuestions.length - 1
        }));
      }
    }
  };
  
  const currentQuestion = currentQuestions[quizState.currentQuestionIndex];
  
  if (!quizSetId || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading questions...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background pb-16">
      <Navbar timeRemaining={quizState.timeRemaining} isQuizActive={true} />
      
      <main className="pt-20 px-4 max-w-4xl mx-auto">
        <div className="mt-8 mb-10">
          <ProgressBar 
            currentQuestion={quizState.currentQuestionIndex + 1} 
            totalQuestions={currentQuestions.length}
            section={quizState.currentSection}
          />
        </div>
        
        {currentQuestion.section === 'mcq' ? (
          <QuizCard 
            question={currentQuestion}
            onAnswer={handleAnswerSubmit}
            selectedAnswer={quizState.answers[currentQuestion.id] as number}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
            hasNext={quizState.currentQuestionIndex < currentQuestions.length - 1 || quizState.currentSection !== 'debugging'}
            hasPrevious={quizState.currentQuestionIndex > 0 || quizState.currentSection !== 'mcq'}
          />
        ) : (
          <CodeEditor 
            question={currentQuestion}
            onAnswer={handleAnswerSubmit}
            currentAnswer={quizState.answers[currentQuestion.id] as string}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
            hasNext={quizState.currentQuestionIndex < currentQuestions.length - 1 || quizState.currentSection !== 'debugging'}
            hasPrevious={quizState.currentQuestionIndex > 0 || quizState.currentSection !== 'mcq'}
          />
        )}
      </main>
    </div>
  );
};

export default Quiz;
