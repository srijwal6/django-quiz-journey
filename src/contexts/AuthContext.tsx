
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for session on initial load
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      return !!data.session;
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Signup error:', error.message);
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (!data.session) {
        // Email confirmation might be required
        toast({
          title: "Verification Required",
          description: "Please check your email for a confirmation link",
        });
      }

      return !!data.session;
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      toast({
        title: "Signup Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    // You could add a loading spinner or component here
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
