
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  timeRemaining?: number;
  isQuizActive?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ timeRemaining, isQuizActive }) => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel py-3 px-6 flex items-center justify-between animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">TC</span>
        </div>
        <Link to="/" className="text-lg font-medium transition hover:opacity-80">
          Tegain Certification Test
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
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/quizzes" 
                className={`text-sm transition-colors hover:text-primary ${location.pathname === '/quizzes' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
              >
                Quizzes
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <span>{user?.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="btn-primary flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                <span>Sign up</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
