
import React, { useEffect, useState } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { calculateScore, getQuizSetById, saveQuizResult } from '@/utils/quizData';
import { formatTime, getGrade } from '@/utils/formatters';
import AttendeeDetailsForm from '@/components/results/AttendeeDetailsForm';
import AutoSubmitWarning from '@/components/results/AutoSubmitWarning';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Results = () => {
  const { toast } = useToast();
  const location = useLocation();
  const { quizSetId } = useParams<{ quizSetId: string }>();
  const { isAuthenticated } = useAuth();
  const { answers, timeSpent, autoSubmitted, attendeeDetails } = location.state || { 
    answers: {}, 
    timeSpent: 0, 
    autoSubmitted: false,
    attendeeDetails: null
  };
  
  const [quizSet, setQuizSet] = useState(null);
  const [scoreData, setScoreData] = useState({
    score: 0,
    totalMarks: 0,
    sectionScores: {
      mcq: { score: 0, total: 0 },
      coding: { score: 0, total: 0 },
      debugging: { score: 0, total: 0 }
    }
  });
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchQuizSet = async () => {
      if (!quizSetId) return;
      
      try {
        setLoading(true);
        const fetchedQuizSet = await getQuizSetById(quizSetId);
        setQuizSet(fetchedQuizSet);
        
        if (fetchedQuizSet) {
          const calculatedScore = calculateScore(answers, fetchedQuizSet.questions);
          const total = fetchedQuizSet.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
          
          const mcqQuestions = fetchedQuizSet.questions.filter(q => q.section === 'mcq');
          const codingQuestions = fetchedQuizSet.questions.filter(q => q.section === 'coding');
          const debuggingQuestions = fetchedQuizSet.questions.filter(q => q.section === 'debugging');
          
          setScoreData({
            score: calculatedScore,
            totalMarks: total,
            sectionScores: {
              mcq: {
                score: calculateScore(answers, mcqQuestions),
                total: mcqQuestions.reduce((sum, q) => sum + (q.marks || 0), 0)
              },
              coding: {
                score: calculateScore(answers, codingQuestions),
                total: codingQuestions.reduce((sum, q) => sum + (q.marks || 0), 0)
              },
              debugging: {
                score: calculateScore(answers, debuggingQuestions),
                total: debuggingQuestions.reduce((sum, q) => sum + (q.marks || 0), 0)
              }
            }
          });
        }
      } catch (error) {
        console.error('Error fetching quiz set:', error);
        toast({
          title: 'Error',
          description: 'Failed to load quiz data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizSet();
  }, [quizSetId, answers, toast]);
  
  const { score, totalMarks, sectionScores } = scoreData;
  const gradeInfo = getGrade(score, totalMarks);
  const percentage = Math.round((score / totalMarks) * 100) || 0;
  
  const handleSubmitResults = async (details) => {
    if (!quizSetId || !isAuthenticated) return;
    
    setSubmitting(true);
    
    try {
      // Save quiz results to database
      const success = await saveQuizResult(
        quizSetId,
        score,
        totalMarks,
        timeSpent,
        answers,
        sectionScores,
        details
      );
      
      if (success) {
        toast({
          title: 'Results Saved',
          description: 'Your test results have been saved successfully'
        });
        setDetailsSubmitted(true);
      } else {
        throw new Error('Failed to save results');
      }
    } catch (error) {
      console.error('Error saving results:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was a problem saving your test results',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
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
  
  if (!quizSet) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Results Not Found</h2>
            <Link 
              to="/quizzes" 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background pb-16">
      <Navbar />
      
      <main className="pt-20 px-4">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{quizSet.title}</h1>
            <p className="text-muted-foreground">{quizSet.description}</p>
          </div>
          
          <AutoSubmitWarning autoSubmitted={autoSubmitted} />
          
          {!detailsSubmitted ? (
            attendeeDetails ? (
              <div className="glass-panel rounded-2xl p-8 mb-8">
                <h2 className="text-xl font-bold mb-4">Submit Your Test Results</h2>
                <p className="text-muted-foreground mb-4">
                  Please review your information below before submitting your test results.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="font-semibold">Full Name:</p>
                    <p className="text-muted-foreground">{attendeeDetails.fullName}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Employee ID:</p>
                    <p className="text-muted-foreground">{attendeeDetails.employeeId}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Job Title:</p>
                    <p className="text-muted-foreground">{attendeeDetails.jobTitle || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Phone Number:</p>
                    <p className="text-muted-foreground">{attendeeDetails.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleSubmitResults(attendeeDetails)}
                  disabled={submitting}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit Test Results'}
                </Button>
              </div>
            ) : (
              <AttendeeDetailsForm
                quizSet={quizSet}
                score={score}
                totalMarks={totalMarks}
                timeSpent={timeSpent}
                sectionScores={sectionScores}
                answers={answers}
                percentage={percentage}
                gradeInfo={gradeInfo}
                onSubmitSuccess={(details) => handleSubmitResults(details)}
              />
            )
          ) : (
            <div className="glass-panel rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold mb-4">Thank You!</h2>
              <p className="text-muted-foreground mb-4">
                Your test details have been saved. You can view your results and past quiz attempts in your account.
              </p>
            </div>
          )}
          
          <div className="flex justify-center gap-4 mt-8">
            <Link 
              to="/quizzes"
              className="bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Back to Quizzes
            </Link>
            
            <Link 
              to="/" 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
