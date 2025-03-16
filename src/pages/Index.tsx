
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 px-4">
        <div className="max-w-6xl mx-auto py-12 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Tegain Certification Tests</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10">
            Test your technical skills with our comprehensive certification assessments for developers of all levels.
          </p>
          
          <Link to="/quizzes" className="group btn-primary">
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="glass-card rounded-2xl p-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Multiple Quiz Sets</h3>
              <p className="text-muted-foreground">
                Choose from a variety of technical tests covering different aspects of development.
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Varied Question Types</h3>
              <p className="text-muted-foreground">
                Practice with multiple-choice, coding, and debugging questions to improve your skills.
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Detailed Results</h3>
              <p className="text-muted-foreground">
                Get comprehensive feedback on your performance with section-by-section breakdowns.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
