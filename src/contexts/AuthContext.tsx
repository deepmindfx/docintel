import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Mock user data for demo
const mockUser: User = {
  id: '1',
  email: 'admin@docintel.com',
  name: 'John Doe',
  role: 'admin',
  avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
  lastActive: new Date(),
  canUseAI: true,
  permissions: ['upload', 'chat', 'admin', 'approve']
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token on mount
    const token = localStorage.getItem('docintel_token')
    if (token) {
      // In real app, verify token with backend
      setTimeout(() => {
        setUser(mockUser)
        setLoading(false)
      }, 500)
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    // Mock login - in real app, call backend API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email === 'admin@docintel.com' && password === 'password') {
      const token = 'mock-jwt-token'
      localStorage.setItem('docintel_token', token)
      setUser(mockUser)
    } else {
      throw new Error('Invalid credentials')
    }
    setLoading(false)
  }

  const logout = () => {
    localStorage.removeItem('docintel_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}