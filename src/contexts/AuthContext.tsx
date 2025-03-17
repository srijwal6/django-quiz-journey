
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

// Store users in localStorage
const getStoredUsers = (): Record<string, { id: string; username: string; password: string }> => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : {};
};

// Save users to localStorage
const saveUsers = (users: Record<string, { id: string; username: string; password: string }>) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing user session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (!username || !password) {
      return false;
    }

    const users = getStoredUsers();
    
    // Find user by username
    const userEntry = Object.values(users).find(u => u.username === username);
    
    if (!userEntry || userEntry.password !== password) {
      return false;
    }
    
    const loggedInUser: User = { id: userEntry.id, username: userEntry.username };
    setUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
    return true;
  };

  const signup = async (username: string, password: string): Promise<boolean> => {
    if (!username || !password) {
      return false;
    }

    const users = getStoredUsers();
    
    // Check if username already exists
    if (Object.values(users).some(u => u.username === username)) {
      return false;
    }

    const newUserId = crypto.randomUUID();
    users[newUserId] = {
      id: newUserId,
      username,
      password, // In a real app, this would be hashed
    };
    
    saveUsers(users);
    
    const newUser: User = { id: newUserId, username };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
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
