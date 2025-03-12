
import React, { useEffect, useState } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { calculateScore, getQuizSetById } from '@/utils/quizData';
import { formatTime, getGrade } from '@/utils/formatters';
import AttendeeDetailsForm from '@/components/results/AttendeeDetailsForm';
import AutoSubmitWarning from '@/components/results/AutoSubmitWarning';

const Results = () => {
  const location = useLocation();
  const { quizSetId } = useParams<{ quizSetId: string }>();
  const { answers, timeSpent, autoSubmitted, attendeeDetails } = location.state || { 
    answers: {}, 
    timeSpent: 0, 
    autoSubmitted: false,
    attendeeDetails: null
  };
  
  // Using useState with default values to avoid recalculations in useEffect
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
  
  // Calculate scores only once when component mounts or quizSetId/answers change
  useEffect(() => {
    if (!quizSetId) return;
    
    const quizSet = getQuizSetById(quizSetId);
    if (!quizSet) return;
    
    // Calculate total score
    const calculatedScore = calculateScore(answers, quizSet.questions);
    
    // Calculate total marks available
    const total = quizSet.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
    
    // Calculate section scores
    const mcqQuestions = quizSet.questions.filter(q => q.section === 'mcq');
    const codingQuestions = quizSet.questions.filter(q => q.section === 'coding');
    const debuggingQuestions = quizSet.questions.filter(q => q.section === 'debugging');
    
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
  }, [quizSetId, answers]); // Only recalculate when these change
  
  const quizSet = quizSetId ? getQuizSetById(quizSetId) : null;
  const { score, totalMarks, sectionScores } = scoreData;
  const gradeInfo = getGrade(score, totalMarks);
  const percentage = Math.round((score / totalMarks) * 100) || 0;
  
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
            // If we have attendee details from the beginning of the quiz, use them
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
                
                <button 
                  onClick={() => {
                    // Prepare email content
                    const emailContent = {
                      to: 'certifications@tegain.com',
                      subject: `Certification Test Results: ${quizSet.title}`,
                      body: {
                        attendee: attendeeDetails,
                        quizTitle: quizSet.title,
                        score,
                        totalMarks,
                        percentage,
                        grade: gradeInfo.grade,
                        gradeLabel: gradeInfo.label,
                        timeSpent,
                        sectionScores,
                        answers,
                        questions: quizSet.questions
                      }
                    };
                    
                    // Log email to verify it has all data
                    console.log('Email content prepared:', emailContent);
                    
                    // Set as submitted
                    setDetailsSubmitted(true);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Submit Test Results
                </button>
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
                onSubmitSuccess={() => setDetailsSubmitted(true)}
              />
            )
          ) : (
            <div className="glass-panel rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold mb-4">Thank You!</h2>
              <p className="text-muted-foreground mb-4">
                Your test details have been sent to our certification team. You will receive 
                your official certification status via email shortly.
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
