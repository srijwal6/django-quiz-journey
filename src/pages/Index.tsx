
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Check, Code, BrainCircuit, Hourglass } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      
      <main className="pt-20 pb-16 px-4 md:px-6">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto pt-12 pb-20 flex flex-col items-center text-center">
          <div className="relative animate-fade-in">
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full transform -translate-y-1/4"></div>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4 animate-slide-up">
              Technical Assessment
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-up [animation-delay:100ms]">
            Django Quiz Journey
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up [animation-delay:200ms]">
            Test your Django knowledge with our comprehensive quiz covering multiple choice questions, coding challenges, and debugging tasks.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-slide-up [animation-delay:300ms]">
            <Link to="/quiz" className="btn-primary">
              Start the Quiz
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <div className="glass-card p-6 rounded-xl card-hover animate-scale-in [animation-delay:400ms]">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Multiple Choice</h3>
              <p className="text-muted-foreground">
                10 questions to test your Django fundamentals with 2 marks each.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl card-hover animate-scale-in [animation-delay:500ms]">
              <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Coding Questions</h3>
              <p className="text-muted-foreground">
                3 hands-on coding tasks to demonstrate your Django development skills.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl card-hover animate-scale-in [animation-delay:600ms]">
              <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Debugging Challenges</h3>
              <p className="text-muted-foreground">
                2 debugging tasks to fix common Django code issues.
              </p>
            </div>
          </div>
        </section>
        
        {/* Info Section */}
        <section className="max-w-4xl mx-auto py-12 px-4">
          <div className="glass-panel rounded-2xl p-8 animate-scale-in">
            <div className="flex items-start gap-4 mb-6">
              <Hourglass className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Quiz Information</h2>
                <p className="text-muted-foreground">
                  Complete all sections within the time limit to test your Django expertise.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Total Marks</h3>
                <p className="text-3xl font-bold">100</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Time Limit</h3>
                <p className="text-3xl font-bold">3 Hours</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Section Breakdown</h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="bg-secondary p-3 rounded-lg">
                  <p className="font-medium">Section 1</p>
                  <p className="text-muted-foreground">MCQs (20 Marks)</p>
                </div>
                <div className="bg-secondary p-3 rounded-lg">
                  <p className="font-medium">Section 2</p>
                  <p className="text-muted-foreground">Coding (50 Marks)</p>
                </div>
                <div className="bg-secondary p-3 rounded-lg">
                  <p className="font-medium">Section 3</p>
                  <p className="text-muted-foreground">Debugging (30 Marks)</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="text-center py-6 text-muted-foreground text-sm border-t">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Django Quiz Journey. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
