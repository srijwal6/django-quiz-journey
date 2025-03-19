
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProgressBar from '@/components/ProgressBar';
import QuizCard from '@/components/QuizCard';
import CodeEditor from '@/components/CodeEditor';
import AttendeeForm from '@/components/AttendeeForm';
import { Question, getQuizSetById } from '@/utils/quizData';
import { useToast } from '@/hooks/use-toast';

// Define the QuizState interface locally since it's not exported from quizData
interface QuizState {
  quizSetId: string | null;
  currentSection: 'mcq' | 'coding' | 'debugging';
  currentQuestionIndex: number;
  answers: Record<string, any>;
  score: number;
  timeRemaining: number;
  isCompleted: boolean;
}

const Quiz = () => {
  const navigate = useNavigate();
  const { quizSetId } = useParams<{ quizSetId: string }>();
  const { toast } = useToast();
  
  const [attendeeDetails, setAttendeeDetails] = useState<{
    fullName: string;
    employeeId: string;
    jobTitle: string;
    phoneNumber: string;
  } | null>(null);
  
  const [quizSet, setQuizSet] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchQuizSet = async () => {
      if (!quizSetId) {
        navigate('/quizzes');
        return;
      }
      
      try {
        setLoading(true);
        const fetchedQuizSet = await getQuizSetById(quizSetId);
        
        if (!fetchedQuizSet) {
          toast({
            title: "Quiz Not Found",
            description: "The requested quiz could not be found.",
            variant: "destructive"
          });
          navigate('/quizzes');
          return;
        }
        
        setQuizSet(fetchedQuizSet);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast({
          title: "Error",
          description: "Failed to load the quiz. Please try again.",
          variant: "destructive"
        });
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizSet();
  }, [quizSetId, navigate, toast]);
  
  const [quizState, setQuizState] = useState<QuizState>({
    quizSetId: quizSetId || null,
    currentSection: 'mcq',
    currentQuestionIndex: 0,
    answers: {},
    score: 0,
    timeRemaining: 3 * 60 * 60,
    isCompleted: false
  });
  
  useEffect(() => {
    if (quizSet) {
      setQuizState(prev => ({
        ...prev,
        timeRemaining: quizSet.timeLimit
      }));
    }
  }, [quizSet]);
  
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  
  useEffect(() => {
    if (!quizSetId || !attendeeDetails || !quizSet) return;
    
    const timer = setInterval(() => {
      setQuizState(prevState => {
        if (prevState.timeRemaining <= 1) {
          clearInterval(timer);
          navigate(`/results/${quizSetId}`, { 
            state: { 
              answers: prevState.answers, 
              timeSpent: quizSet.timeLimit,
              autoSubmitted: true,
              attendeeDetails: attendeeDetails
            } 
          });
          return { ...prevState, timeRemaining: 0 };
        }
        
        return { ...prevState, timeRemaining: prevState.timeRemaining - 1 };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate, quizSetId, attendeeDetails, quizSet]);
  
  useEffect(() => {
    if (!quizSetId || !quizSet) return;
    
    const loadQuestions = async () => {
      try {
        const questions = quizSet.questions.filter(q => q.section === quizState.currentSection);
        setCurrentQuestions(questions);
      } catch (error) {
        console.error('Error loading questions:', error);
        toast({
          title: "Error",
          description: "Failed to load questions",
          variant: "destructive"
        });
      }
    };
    
    loadQuestions();
  }, [quizState.currentSection, quizSetId, quizSet, toast]);
  
  const handleAttendeeFormSubmit = (details: {
    fullName: string;
    employeeId: string;
    jobTitle: string;
    phoneNumber: string;
  }) => {
    setAttendeeDetails(details);
    toast({
      title: "Welcome to the quiz!",
      description: `Good luck, ${details.fullName}!`,
    });
  };
  
  const handleAnswerSubmit = (questionId: string, answer: string | number) => {
    setQuizState(prevState => ({
      ...prevState,
      answers: { ...prevState.answers, [questionId]: answer }
    }));
  };
  
  const handleNextQuestion = () => {
    if (quizState.currentQuestionIndex < currentQuestions.length - 1) {
      setQuizState(prevState => ({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex + 1
      }));
    } else {
      if (quizState.currentSection === 'mcq') {
        const codingQuestions = quizSet.questions.filter(q => q.section === 'coding');
        if (codingQuestions.length > 0) {
          toast({
            title: "Section Completed",
            description: "Moving to coding questions section",
          });
          setQuizState(prevState => ({
            ...prevState,
            currentSection: 'coding',
            currentQuestionIndex: 0
          }));
        } else {
          const debuggingQuestions = quizSet.questions.filter(q => q.section === 'debugging');
          if (debuggingQuestions.length > 0) {
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
            navigate(`/results/${quizSetId}`, { 
              state: { 
                answers: quizState.answers, 
                timeSpent: quizSet.timeLimit - quizState.timeRemaining,
                attendeeDetails: attendeeDetails
              } 
            });
          }
        }
      } else if (quizState.currentSection === 'coding') {
        const debuggingQuestions = quizSet.questions.filter(q => q.section === 'debugging');
        if (debuggingQuestions.length > 0) {
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
          navigate(`/results/${quizSetId}`, { 
            state: { 
              answers: quizState.answers, 
              timeSpent: quizSet.timeLimit - quizState.timeRemaining,
              attendeeDetails: attendeeDetails
            } 
          });
        }
      } else if (quizSetId) {
        navigate(`/results/${quizSetId}`, { 
          state: { 
            answers: quizState.answers, 
            timeSpent: quizSet.timeLimit - quizState.timeRemaining,
            attendeeDetails: attendeeDetails
          } 
        });
      }
    }
  };
  
  const handlePreviousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState(prevState => ({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex - 1
      }));
    } else if (quizSetId && quizSet) {
      if (quizState.currentSection === 'coding') {
        const mcqQuestions = quizSet.questions.filter(q => q.section === 'mcq');
        if (mcqQuestions.length > 0) {
          setQuizState(prevState => ({
            ...prevState,
            currentSection: 'mcq',
            currentQuestionIndex: mcqQuestions.length - 1
          }));
        }
      } else if (quizState.currentSection === 'debugging') {
        const codingQuestions = quizSet.questions.filter(q => q.section === 'coding');
        if (codingQuestions.length > 0) {
          setQuizState(prevState => ({
            ...prevState,
            currentSection: 'coding',
            currentQuestionIndex: codingQuestions.length - 1
          }));
        } else {
          const mcqQuestions = quizSet.questions.filter(q => q.section === 'mcq');
          if (mcqQuestions.length > 0) {
            setQuizState(prevState => ({
              ...prevState,
              currentSection: 'mcq',
              currentQuestionIndex: mcqQuestions.length - 1
            }));
          }
        }
      }
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-20 h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!attendeeDetails) {
    return (
      <div className="min-h-screen bg-background pb-16">
        <Navbar />
        <main className="pt-20 px-4">
          <AttendeeForm onSubmit={handleAttendeeFormSubmit} />
        </main>
      </div>
    );
  }
  
  const currentQuestion = currentQuestions[quizState.currentQuestionIndex];
  
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-20 h-screen">
          <p>No questions available for this section.</p>
        </div>
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
            selectedAnswer={quizState.answers[currentQuestion.id]}
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
