
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing user in localStorage on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, you would validate against a backend
    // For this demo, we'll accept any non-empty username/password
    if (!username || !password) {
      return false;
    }

    // Simulate backend validation
    if (username.length < 3 || password.length < 6) {
      return false;
    }

    const newUser: User = { id: crypto.randomUUID(), username };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const signup = async (username: string, password: string): Promise<boolean> => {
    // In a real app, you would register against a backend
    // For this demo implementation, signup is similar to login
    if (!username || !password) {
      return false;
    }

    if (username.length < 3 || password.length < 6) {
      return false;
    }

    const newUser: User = { id: crypto.randomUUID(), username };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

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
