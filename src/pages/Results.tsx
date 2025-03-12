
import React, { useEffect, useState } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { calculateScore, getQuizSetById } from '@/utils/quizData';
import { formatTime, getGrade } from '@/utils/formatters';

// Components
import ScoreOverview from '@/components/results/ScoreOverview';
import TimeStats from '@/components/results/TimeStats';
import SectionBreakdown from '@/components/results/SectionBreakdown';
import EmailResultsForm from '@/components/results/EmailResultsForm';
import AutoSubmitWarning from '@/components/results/AutoSubmitWarning';

const Results = () => {
  const location = useLocation();
  const { quizSetId } = useParams<{ quizSetId: string }>();
  const { answers, timeSpent, autoSubmitted } = location.state || { answers: {}, timeSpent: 0, autoSubmitted: false };
  
  const [score, setScore] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [sectionScores, setSectionScores] = useState({
    mcq: { score: 0, total: 0 },
    coding: { score: 0, total: 0 },
    debugging: { score: 0, total: 0 }
  });
  
  useEffect(() => {
    if (!quizSetId) return;
    
    const quizSet = getQuizSetById(quizSetId);
    if (!quizSet) return;
    
    // Calculate total score
    const calculatedScore = calculateScore(answers, quizSet.questions);
    setScore(calculatedScore);
    
    // Calculate total marks available
    const total = quizSet.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
    setTotalMarks(total);
    
    // Calculate section scores
    const mcqQuestions = quizSet.questions.filter(q => q.section === 'mcq');
    const codingQuestions = quizSet.questions.filter(q => q.section === 'coding');
    const debuggingQuestions = quizSet.questions.filter(q => q.section === 'debugging');
    
    setSectionScores({
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
    });
  }, [answers, quizSetId]);
  
  const quizSet = quizSetId ? getQuizSetById(quizSetId) : null;
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
          
          <div className="glass-panel rounded-2xl p-8 mb-8">
            <ScoreOverview 
              score={score}
              totalMarks={totalMarks}
              percentage={percentage}
              gradeInfo={gradeInfo}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TimeStats 
                timeSpent={timeSpent}
                timeLimit={quizSet.timeLimit}
                formatTime={formatTime}
              />
              
              <SectionBreakdown sectionScores={sectionScores} />
            </div>
          </div>
          
          <EmailResultsForm 
            quizSet={quizSet}
            score={score}
            totalMarks={totalMarks}
            timeSpent={timeSpent}
            sectionScores={sectionScores}
            answers={answers}
          />
          
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
