
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { QuizSet } from '@/utils/quizData';
import { Send } from 'lucide-react';
import emailjs from 'emailjs-com';
import { formatTime, getGrade } from '@/utils/formatters';

interface AttendeeDetailsFormProps {
  quizSet: QuizSet;
  score: number;
  totalMarks: number;
  timeSpent: number;
  percentage: number;
  gradeInfo: { grade: string; label: string };
  sectionScores: {
    mcq: { score: number; total: number };
    coding: { score: number; total: number };
    debugging: { score: number; total: number };
  };
  answers: Record<string, any>;
  onSubmitSuccess: () => void;
}

const AttendeeDetailsForm: React.FC<AttendeeDetailsFormProps> = ({
  quizSet,
  score,
  totalMarks,
  timeSpent,
  percentage,
  gradeInfo,
  sectionScores,
  answers,
  onSubmitSuccess,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendeeDetails, setAttendeeDetails] = useState({
    fullName: '',
    employeeId: '',
    jobTitle: '',
    phoneNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAttendeeDetails(prev => ({ ...prev, [name]: value }));
  };

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
Time Spent: ${formatTime(timeSpent)}`
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!attendeeDetails.fullName || !attendeeDetails.employeeId) {
      toast({
        title: "Missing Information",
        description: "Please provide your full name and employee ID",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create detailed message for email body
      const detailedMessage = createEmailMessage();
      
      // Prepare email content
      const emailContent = {
        to_email: 'certifications@tegain.com',
        subject: `Certification Test Results: ${quizSet.title}`,
        message: detailedMessage, // Add the formatted message to the email
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
        // Convert complex objects to JSON strings
        section_scores: JSON.stringify(sectionScores),
        answers: JSON.stringify(answers),
        questions: JSON.stringify(quizSet.questions)
      };
      
      // Log the email content to verify all data is included
      console.log('Email content prepared:', emailContent);
      
      // Send email using EmailJS
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailContent,
        import.meta.env.VITE_EMAILJS_USER_ID
      );
      
      console.log('Email sent successfully:', result);
      
      // Show success toast
      toast({
        title: "Test Results Submitted",
        description: "Your test details have been sent to our certification team",
      });
      
      // Notify parent component that submission was successful
      onSubmitSuccess();
    } catch (error) {
      console.error('Error sending results:', error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your test results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-8 mb-8 animate-fade-in">
      <h2 className="text-xl font-bold mb-4">Submit Your Test Details</h2>
      
      <p className="text-muted-foreground mb-6">
        Please provide your information below. Your test results and responses will be sent to our certification team for review.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={attendeeDetails.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID *</Label>
            <Input
              id="employeeId"
              name="employeeId"
              value={attendeeDetails.employeeId}
              onChange={handleChange}
              placeholder="EMP123456"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              value={attendeeDetails.jobTitle}
              onChange={handleChange}
              placeholder="Software Engineer"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={attendeeDetails.phoneNumber}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              type="tel"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting ? (
              <>Submitting...</>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Test Results
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AttendeeDetailsForm;
