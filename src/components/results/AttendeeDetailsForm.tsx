
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { QuizSet } from '@/utils/quizData';
import { Send } from 'lucide-react';

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
      // Simulate API request with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Prepare email content
      const emailContent = {
        to: 'certifications@tegain.com',
        subject: `Certification Test Results: ${quizSet.title}`,
        body: {
          attendee: attendeeDetails,
          quizTitle: quizSet.title,
          score: score,
          totalMarks: totalMarks,
          percentage: percentage,
          grade: gradeInfo.grade,
          gradeLabel: gradeInfo.label,
          timeSpent: timeSpent,
          sectionScores: sectionScores,
          answers: answers,
          questions: quizSet.questions
        }
      };
      
      // Log the email content to verify all data is included
      console.log('Email content prepared:', emailContent);
      
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
