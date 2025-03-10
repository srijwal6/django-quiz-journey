
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProgressBar from '@/components/ProgressBar';
import QuizCard from '@/components/QuizCard';
import CodeEditor from '@/components/CodeEditor';
import { Question, QuizState, getQuestionsForSection } from '@/utils/quizData';
import { useToast } from '@/components/ui/use-toast';

const Quiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quizState, setQuizState] = useState<QuizState>({
    currentSection: 'mcq',
    currentQuestionIndex: 0,
    answers: {},
    score: 0,
    timeRemaining: 3 * 60 * 60, // 3 hours in seconds
    isCompleted: false
  });
  
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(
    getQuestionsForSection('mcq')
  );
  
  // Initialize timer
  useEffect(() => {
    const timer = setInterval(() => {
      setQuizState(prevState => {
        // If time ran out
        if (prevState.timeRemaining <= 1) {
          clearInterval(timer);
          navigate('/results', { 
            state: { 
              answers: prevState.answers, 
              timeSpent: 3 * 60 * 60 - 0,
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
  }, [navigate]);
  
  // When section changes, update questions
  useEffect(() => {
    setCurrentQuestions(getQuestionsForSection(quizState.currentSection));
  }, [quizState.currentSection]);
  
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
      } else {
        // Quiz completed
        navigate('/results', { 
          state: { 
            answers: quizState.answers, 
            timeSpent: 3 * 60 * 60 - quizState.timeRemaining
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
    } else {
      // Move to previous section
      if (quizState.currentSection === 'coding') {
        const mcqQuestions = getQuestionsForSection('mcq');
        setQuizState(prevState => ({
          ...prevState,
          currentSection: 'mcq',
          currentQuestionIndex: mcqQuestions.length - 1
        }));
      } else if (quizState.currentSection === 'debugging') {
        const codingQuestions = getQuestionsForSection('coding');
        setQuizState(prevState => ({
          ...prevState,
          currentSection: 'coding',
          currentQuestionIndex: codingQuestions.length - 1
        }));
      }
    }
  };
  
  const currentQuestion = currentQuestions[quizState.currentQuestionIndex];
  
  if (!currentQuestion) {
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
