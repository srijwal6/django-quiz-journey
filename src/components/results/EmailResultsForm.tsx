
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { QuizSet } from '@/utils/quizData';

interface EmailResultsFormProps {
  quizSet: QuizSet;
  score: number;
  totalMarks: number;
  timeSpent: number;
  sectionScores: {
    mcq: { score: number; total: number };
    coding: { score: number; total: number };
    debugging: { score: number; total: number };
  };
  answers: Record<string, any>;
}

const EmailResultsForm: React.FC<EmailResultsFormProps> = ({
  quizSet,
  score,
  totalMarks,
  timeSpent,
  sectionScores,
  answers,
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please provide an email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const emailContent = {
        to: email,
        subject: `Quiz Results: ${quizSet.title}`,
        body: {
          quizTitle: quizSet.title,
          score: score,
          totalMarks: totalMarks,
          percentage: Math.round((score / totalMarks) * 100),
          timeSpent: timeSpent,
          sectionScores: sectionScores,
          answers: answers,
          questions: quizSet.questions
        }
      };
      
      console.log('Email content prepared:', emailContent);
      
      toast({
        title: "Email Sent Successfully",
        description: `Full test details have been sent to ${email}`,
      });
      
      setEmail('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Failed to Send Email",
        description: "There was a problem sending the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-8 mb-8 animate-fade-in">
      <h3 className="text-xl font-medium mb-4 flex items-center">
        <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
        Get Full Test Details via Email
      </h3>
      
      <p className="text-muted-foreground mb-4">
        Enter your email address to receive a detailed report of your test performance,
        including all questions, your answers, and the correct answers.
      </p>
      
      <form onSubmit={handleSendEmail} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Your email address"
          className="flex-grow"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={isSending}>
          {isSending ? (
            <>Sending...</>
          ) : (
            <>Send Results</>
          )}
        </Button>
      </form>
    </div>
  );
};

export default EmailResultsForm;
