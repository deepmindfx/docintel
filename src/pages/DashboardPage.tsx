import React from 'react';
import { useData } from '../contexts/DataProvider';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { Badge } from '../components/ui/Badge';
import { 
  FileText, 
  MessageCircle, 
  Upload, 
  HardDrive, 
  TrendingUp,
  Users,
  Zap,
  Clock,
  BarChart3,
  PieChart
} from 'lucide-react';
import { formatFileSize } from '../lib/utils';

export const DashboardPage: React.FC = () => {
  const { usage, analytics, files } = useData();

  const stats = [
    {
      title: 'Total Files',
      value: analytics.totalFiles.toLocaleString(),
      icon: FileText,
      color: 'blue',
      change: { value: 12, label: 'from last month' }
    },
    {
      title: 'AI Chats',
      value: analytics.totalChats.toLocaleString(),
      icon: MessageCircle,
      color: 'green',
      change: { value: 23, label: 'from last month' }
    },
    {
      title: 'Uploads',
      value: analytics.totalUploads.toLocaleString(),
      icon: Upload,
      color: 'purple',
      change: { value: 8, label: 'from last month' }
    },
    {
      title: 'Storage Used',
      value: formatFileSize(analytics.totalStorage),
      icon: HardDrive,
      color: 'yellow',
      change: { value: 15, label: 'from last month' }
    }
  ];

  const recentFiles = files.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-6 border border-emerald-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back, Robert!</h2>
            <p className="text-gray-300">Here's what's happening with your documents today.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="success">Pro Plan</Badge>
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border-2 border-gray-800" src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1" alt="User" />
              <img className="w-8 h-8 rounded-full border-2 border-gray-800" src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1" alt="User" />
              <img className="w-8 h-8 rounded-full border-2 border-gray-800" src="https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1" alt="User" />
              <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center">
                <span className="text-xs text-gray-300">+25</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-sm text-emerald-400 mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change.value}% {stat.change.label}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Overview */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Usage Overview</h3>
                  <p className="text-gray-400">Monthly usage statistics</p>
                </div>
                <Badge variant="secondary">Monthly</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">Uploads</span>
                    <span className="text-sm text-gray-400">
                      {usage.uploadsUsed.toLocaleString()} / {usage.uploadsLimit.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={usage.uploadsUsed}
                    max={usage.uploadsLimit}
                    variant="default"
                    className="h-2"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">AI Chats</span>
                    <span className="text-sm text-gray-400">
                      {usage.chatsUsed.toLocaleString()} / {usage.chatsLimit.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={usage.chatsUsed}
                    max={usage.chatsLimit}
                    variant="success"
                    className="h-2"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">Storage</span>
                    <span className="text-sm text-gray-400">
                      {formatFileSize(usage.storageUsed)} / {formatFileSize(usage.storageLimit)}
                    </span>
                  </div>
                  <Progress
                    value={usage.storageUsed}
                    max={usage.storageLimit}
                    variant="warning"
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Engine Usage */}
        <div>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">AI Engine Usage</h3>
                  <p className="text-sm text-gray-400">Current month</p>
                </div>
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">OpenAI</span>
                  </div>
                  <span className="text-sm text-white font-medium">{analytics.aiEngineUsage.openai}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">DocIntel</span>
                  </div>
                  <span className="text-sm text-white font-medium">{analytics.aiEngineUsage.docintel}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Files */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Recent Files</h3>
              <p className="text-gray-400">Recently uploaded documents</p>
            </div>
            <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
              View all
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <img
                    src={file.previewUrl || 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1'}
                    alt={file.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-white">{file.name}</h4>
                    <p className="text-sm text-gray-400">
                      {file.uploadedBy} • {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={file.aiStatus === 'completed' ? 'success' : 'warning'}
                  >
                    {file.aiStatus}
                  </Badge>
                  <button className="text-gray-400 hover:text-white">
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};