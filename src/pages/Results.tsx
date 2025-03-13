
import React, { useEffect, useState } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { calculateScore, getQuizSetById } from '@/utils/quizData';
import { formatTime, getGrade } from '@/utils/formatters';
import AttendeeDetailsForm from '@/components/results/AttendeeDetailsForm';
import AutoSubmitWarning from '@/components/results/AutoSubmitWarning';
import emailjs from 'emailjs-com';
import { useToast } from '@/hooks/use-toast';

const Results = () => {
  const { toast } = useToast();
  const location = useLocation();
  const { quizSetId } = useParams<{ quizSetId: string }>();
  const { answers, timeSpent, autoSubmitted, attendeeDetails } = location.state || { 
    answers: {}, 
    timeSpent: 0, 
    autoSubmitted: false,
    attendeeDetails: null
  };
  
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
  
  useEffect(() => {
    if (!quizSetId) return;
    
    const quizSet = getQuizSetById(quizSetId);
    if (!quizSet) return;
    
    const calculatedScore = calculateScore(answers, quizSet.questions);
    const total = quizSet.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
    
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
  }, [quizSetId, answers]);
  
  const quizSet = quizSetId ? getQuizSetById(quizSetId) : null;
  const { score, totalMarks, sectionScores } = scoreData;
  const gradeInfo = getGrade(score, totalMarks);
  const percentage = Math.round((score / totalMarks) * 100) || 0;
  
  const formatAnswersForEmail = (answers, questions) => {
    if (!questions || !answers) return '';
    
    let formattedContent = '';
    
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      formattedContent += `\n\nQuestion ${question.id}: ${question.questionText}\n`;
      
      if (question.section === 'mcq' && question.options) {
        formattedContent += `Options:\n`;
        question.options.forEach((option, index) => {
          formattedContent += `  ${option}\n`;
        });
        
        if (userAnswer !== undefined) {
          const selectedOption = question.options[userAnswer];
          formattedContent += `Candidate's Answer: ${selectedOption}\n`;
        } else {
          formattedContent += `Candidate's Answer: Not answered\n`;
        }
        
        const correctOption = question.options[question.correctAnswer];
        formattedContent += `Correct Answer: ${correctOption}\n`;
      } else {
        if (userAnswer) {
          formattedContent += `Candidate's Answer:\n${userAnswer}\n`;
        } else {
          formattedContent += `Candidate's Answer: Not answered\n`;
        }
        
        if (question.correctAnswer) {
          formattedContent += `Suggested Answer/Solution:\n${question.correctAnswer}\n`;
        }
      }
      
      formattedContent += `Result: ${isCorrect ? 'Correct' : 'Incorrect'}\n`;
      formattedContent += `Marks: ${isCorrect ? question.marks : 0}/${question.marks}`;
    });
    
    return formattedContent;
  };
  
  const createEmailMessage = () => {
    if (!quizSet || !attendeeDetails) return '';
    
    const sections = [
      {
        title: 'CANDIDATE INFORMATION',
        content: `Name: ${attendeeDetails.fullName}
Employee ID: ${attendeeDetails.employeeId}
Job Title: ${attendeeDetails.jobTitle || 'Not provided'}
Phone Number: ${attendeeDetails.phoneNumber || 'Not provided'}`
      },
      {
        title: 'EXAM SUMMARY',
        content: `Quiz Title: ${quizSet.title}
Description: ${quizSet.description}
Total Score: ${score}/${totalMarks} (${percentage}%)
Grade: ${gradeInfo.grade} - ${gradeInfo.label}
Time Spent: ${formatTime(timeSpent)}
Auto Submitted: ${autoSubmitted ? 'Yes' : 'No'}`
      },
      {
        title: 'SECTION BREAKDOWN',
        content: `Multiple Choice: ${sectionScores.mcq.score}/${sectionScores.mcq.total}
Coding Questions: ${sectionScores.coding.score}/${sectionScores.coding.total}
Debugging Questions: ${sectionScores.debugging.score}/${sectionScores.debugging.total}`
      },
      {
        title: 'DETAILED RESPONSES',
        content: formatAnswersForEmail(answers, quizSet.questions)
      }
    ];
    
    let fullMessage = '';
    sections.forEach(section => {
      fullMessage += `\n\n=== ${section.title} ===\n${section.content}`;
    });
    
    return fullMessage;
  };
  
  const handleSubmitWithAttendeeDetails = async () => {
    if (!quizSet || !attendeeDetails) return;
    
    setSubmitting(true);
    
    try {
      const detailedMessage = createEmailMessage();
      
      const emailContent = {
        to_email: 'certifications@tegain.com',
        subject: `Certification Test Results: ${quizSet.title}`,
        message: detailedMessage,
        attendee_name: attendeeDetails.fullName,
        employee_id: attendeeDetails.employeeId,
        job_title: attendeeDetails.jobTitle || 'Not provided',
        phone_number: attendeeDetails.phoneNumber || 'Not provided',
        quiz_title: quizSet.title,
        score: score,
        total_marks: totalMarks,
        percentage: percentage,
        grade: gradeInfo.grade,
        grade_label: gradeInfo.label,
        time_spent: timeSpent,
        section_scores: JSON.stringify(sectionScores),
        answers: JSON.stringify(answers),
        questions: JSON.stringify(quizSet.questions)
      };
      
      console.log('Email content prepared:', emailContent);
      
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailContent,
        import.meta.env.VITE_EMAILJS_USER_ID
      );
      
      console.log('Email sent successfully:', result);
      
      toast({
        title: "Test Results Submitted",
        description: "Your test details have been sent to our certification team",
      });
      
      setDetailsSubmitted(true);
    } catch (error) {
      console.error('Error sending results:', error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your test results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
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
                  onClick={handleSubmitWithAttendeeDetails}
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
