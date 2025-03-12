
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface AttendeeFormProps {
  onSubmit: (details: {
    fullName: string;
    employeeId: string;
    jobTitle: string;
    phoneNumber: string;
  }) => void;
}

const AttendeeForm: React.FC<AttendeeFormProps> = ({ onSubmit }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
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
    
    // Simulate a short delay
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(attendeeDetails);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-8 mb-8 animate-fade-in">
      <h2 className="text-xl font-bold mb-4">Before You Start</h2>
      
      <p className="text-muted-foreground mb-6">
        Please provide your details below before starting the quiz. This information will be included with your test results.
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
              <>Processing...</>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Start Quiz
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AttendeeForm;
