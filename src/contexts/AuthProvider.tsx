import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mockUser: User = {
  id: '1',
  email: 'admin@docintel.com',
  name: 'Aliyu Wada',
  role: 'admin',
  title: '',
  avatar: '',
  lastActive: new Date(),
  canUseAI: true,
  permissions: ['upload', 'chat', 'admin', 'approve'],
  joinedAt: new Date('2023-01-15'),
  status: 'active'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('docintel_token');
    if (token) {
      setTimeout(() => {
        setUser(mockUser);
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (email === 'admin@docintel.com' && password === 'password') {
      const token = 'mock-jwt-token';
      localStorage.setItem('docintel_token', token);
      setUser(mockUser);
    } else {
      throw new Error('Invalid credentials');
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('docintel_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};