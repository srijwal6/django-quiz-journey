
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { quizQuestions, calculateScore } from '@/utils/quizData';
import { CheckCircle, XCircle, Clock, Award, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';

const Results = () => {
  const location = useLocation();
  const { answers, timeSpent, autoSubmitted } = location.state || { answers: {}, timeSpent: 0, autoSubmitted: false };
  
  const [score, setScore] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [sectionScores, setSectionScores] = useState({
    mcq: { score: 0, total: 0 },
    coding: { score: 0, total: 0 },
    debugging: { score: 0, total: 0 }
  });
  
  useEffect(() => {
    // Calculate total score
    const calculatedScore = calculateScore(answers, quizQuestions);
    setScore(calculatedScore);
    
    // Calculate total marks available
    const total = quizQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);
    setTotalMarks(total);
    
    // Calculate section scores
    const mcqQuestions = quizQuestions.filter(q => q.section === 'mcq');
    const codingQuestions = quizQuestions.filter(q => q.section === 'coding');
    const debuggingQuestions = quizQuestions.filter(q => q.section === 'debugging');
    
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
  }, [answers]);
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    const parts = [];
    if (hours > 0) parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds} sec${remainingSeconds !== 1 ? 's' : ''}`);
    
    return parts.join(' ');
  };
  
  const getGrade = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return { grade: 'A', label: 'Excellent' };
    if (percentage >= 80) return { grade: 'B', label: 'Good' };
    if (percentage >= 70) return { grade: 'C', label: 'Satisfactory' };
    if (percentage >= 60) return { grade: 'D', label: 'Pass' };
    return { grade: 'F', label: 'Needs Improvement' };
  };
  
  const gradeInfo = getGrade(score, totalMarks);
  const percentage = Math.round((score / totalMarks) * 100);
  
  return (
    <div className="min-h-screen bg-background pb-16">
      <Navbar />
      
      <main className="pt-20 px-4">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {autoSubmitted && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
              <p className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Your quiz was automatically submitted as the time limit was reached.</span>
              </p>
            </div>
          )}
          
          <div className="glass-panel rounded-2xl p-8 mb-8">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="mb-6">
                <div className="relative">
                  <svg className="w-36 h-36">
                    <circle
                      className="text-gray-200"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                      r="64"
                      cx="72"
                      cy="72"
                    />
                    <circle
                      className={cn({
                        'text-green-500': percentage >= 70,
                        'text-amber-500': percentage >= 50 && percentage < 70,
                        'text-red-500': percentage < 50
                      })}
                      strokeWidth="6"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="64"
                      cx="72"
                      cy="72"
                      strokeDasharray={`${percentage * 4.02} 402`}
                      strokeDashoffset="0"
                    />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                    <p className="text-4xl font-bold">{percentage}%</p>
                    <p className="text-lg text-muted-foreground">Score</p>
                  </div>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
              <p className="text-muted-foreground mb-4">
                You scored {score} out of {totalMarks} marks
              </p>
              
              <div className={cn("px-4 py-2 rounded-full text-white font-medium flex items-center", {
                'bg-green-500': percentage >= 70,
                'bg-amber-500': percentage >= 50 && percentage < 70,
                'bg-red-500': percentage < 50
              })}>
                <Award className="h-5 w-5 mr-2" />
                <span>Grade {gradeInfo.grade}: {gradeInfo.label}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-secondary/50 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  Time Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time spent</span>
                    <span className="font-medium">{formatTime(timeSpent)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time limit</span>
                    <span className="font-medium">3 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium">{Math.round((timeSpent / (3 * 60 * 60)) * 100)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary/50 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-muted-foreground" />
                  Section Breakdown
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">MCQ Section</span>
                      <span className="font-medium">{sectionScores.mcq.score}/{sectionScores.mcq.total}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(sectionScores.mcq.score / sectionScores.mcq.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Coding Section</span>
                      <span className="font-medium">{sectionScores.coding.score}/{sectionScores.coding.total}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${(sectionScores.coding.score / sectionScores.coding.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Debugging Section</span>
                      <span className="font-medium">{sectionScores.debugging.score}/{sectionScores.debugging.total}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(sectionScores.debugging.score / sectionScores.debugging.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Link 
              to="/" 
              className="btn-secondary"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
