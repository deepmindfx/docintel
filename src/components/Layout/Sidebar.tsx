import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../contexts/DataProvider';
import { 
  Home, 
  Files, 
  Upload, 
  MessageCircle, 
  CheckCircle, 
  Users, 
  Settings, 
  CreditCard,
  BarChart,
  Zap,
  LogOut,
  Brain,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navigation = [
  { name: 'Overview', icon: Home, page: 'dashboard' },
  { name: 'Files', icon: Files, page: 'files' },
  { name: 'Upload', icon: Upload, page: 'upload' },
  { name: 'Chat', icon: MessageCircle, page: 'chat' },
  { name: 'Approvals', icon: CheckCircle, page: 'approvals' },
  { name: 'Users', icon: Users, page: 'users' },
  { name: 'Analytics', icon: BarChart, page: 'analytics' },
  { name: 'Automations', icon: Zap, page: 'automations' },
  { name: 'Billing', icon: CreditCard, page: 'billing' },
  { name: 'Settings', icon: Settings, page: 'settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onPageChange,
  collapsed,
  onToggleCollapse
}) => {
  const { user, logout } = useAuth();
  const { organization } = useData();

  if (!user) return null;

  return (
    <div className={cn(
      'bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 flex flex-col transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-white">DocIntel</h1>
                <p className="text-xs text-gray-400">{organization.name}</p>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          
          return (
            <button
              key={item.name}
              onClick={() => onPageChange(item.page)}
              className={cn(
                'w-full flex items-center text-sm font-medium rounded-lg transition-all duration-200',
                collapsed ? 'px-3 py-3 justify-center' : 'px-3 py-2',
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={cn('w-5 h-5', !collapsed && 'mr-3')} />
              {!collapsed && item.name}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className={cn(
          'flex items-center transition-all duration-200',
          collapsed ? 'justify-center mb-3' : 'mb-4'
        )}>
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-400">{user.title}</p>
            </div>
          )}
        </div>
        
        <button
          onClick={logout}
          className={cn(
            'w-full flex items-center text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors',
            collapsed ? 'px-3 py-3 justify-center' : 'px-3 py-2'
          )}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className={cn('w-5 h-5', !collapsed && 'mr-3')} />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </div>
  );
};