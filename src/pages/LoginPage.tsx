import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Brain, Shield, Zap, FileText, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@docintel.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">DocIntel</h1>
          <p className="text-gray-400 mt-2">Secure AI Document Intelligence Platform</p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-gray-400">Enter your credentials to access your account</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                required
              />
              
              {error && (
                <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                loading={loading}
                disabled={loading}
              >
                Sign in
              </Button>
            </form>

            <div className="text-center text-sm text-gray-400">
              Demo credentials: admin@docintel.com / password
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
            <Shield className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <div className="text-sm text-gray-300">Enterprise Security</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
            <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-sm text-gray-300">AI-Powered</div>
          </div>
        </div>
      </div>
    </div>
  );
};