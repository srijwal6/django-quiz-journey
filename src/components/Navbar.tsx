
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock } from 'lucide-react';

interface NavbarProps {
  timeRemaining?: number;
  isQuizActive?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ timeRemaining, isQuizActive }) => {
  const location = useLocation();
  
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel py-3 px-6 flex items-center justify-between animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">DQ</span>
        </div>
        <Link to="/" className="text-lg font-medium transition hover:opacity-80">
          Django Quiz Journey
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {isQuizActive && timeRemaining !== undefined && (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{formatTime(timeRemaining)}</span>
          </div>
        )}
        
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
          >
            Home
          </Link>
          {location.pathname !== '/quiz' && (
            <Link
              to="/quiz"
              className="btn-primary"
            >
              Start Quiz
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
