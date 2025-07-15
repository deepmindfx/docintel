import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../contexts/DataProvider';
import { useTheme } from '../../contexts/ThemeProvider';
import { Bell, Search, Menu, Sun, Moon } from 'lucide-react';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onMenuClick }) => {
  const { user } = useAuth();
  const { usage, organization } = useData();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  const getUsageVariant = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search files..."
              className="pl-10 w-80 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Badge variant={getUsageVariant(usage.uploadsUsed, usage.uploadsLimit)}>
              {usage.uploadsUsed.toLocaleString()}/{usage.uploadsLimit.toLocaleString()} uploads
            </Badge>
            <Badge variant={getUsageVariant(usage.chatsUsed, usage.chatsLimit)}>
              {usage.chatsUsed.toLocaleString()}/{usage.chatsLimit.toLocaleString()} chats
            </Badge>
            <Badge variant={getUsageVariant(usage.tokensUsed, usage.tokensLimit)}>
              {usage.tokensUsed.toLocaleString()}/{usage.tokensLimit.toLocaleString()} tokens
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="text-gray-400 hover:text-white"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-400">{user.title}</p>
            </div>
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};