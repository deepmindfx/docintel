import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Plus, 
  Zap, 
  Settings, 
  Play, 
  Pause, 
  FileText,
  Bell,
  Mail,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  status: 'active' | 'paused' | 'draft';
  lastRun?: Date;
  runCount: number;
}

export const AutomationsPage: React.FC = () => {
  const [automations] = useState<Automation[]>([
    {
      id: '1',
      name: 'Invoice Processing Alert',
      description: 'Send notification when new invoice is uploaded and processed',
      trigger: 'File uploaded to Invoices folder',
      actions: ['Send Slack notification', 'Log to audit trail', 'Email finance team'],
      status: 'active',
      lastRun: new Date('2024-01-15T10:30:00'),
      runCount: 47
    },
    {
      id: '2',
      name: 'Document Approval Workflow',
      description: 'Automatically request approval for sensitive documents',
      trigger: 'AI detects sensitive content',
      actions: ['Create approval request', 'Notify approvers', 'Restrict access'],
      status: 'active',
      lastRun: new Date('2024-01-14T16:20:00'),
      runCount: 23
    },
    {
      id: '3',
      name: 'Chat Summary Report',
      description: 'Generate weekly summary of AI chat interactions',
      trigger: 'Every Monday at 9 AM',
      actions: ['Generate summary report', 'Email to managers', 'Save to reports folder'],
      status: 'paused',
      lastRun: new Date('2024-01-08T09:00:00'),
      runCount: 12
    },
    {
      id: '4',
      name: 'Storage Cleanup',
      description: 'Archive old files to maintain storage limits',
      trigger: 'Storage usage > 80%',
      actions: ['Archive files older than 1 year', 'Notify admin', 'Update storage metrics'],
      status: 'draft',
      runCount: 0
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'draft': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTriggerIcon = (trigger: string) => {
    if (trigger.includes('upload')) return <FileText className="w-4 h-4" />;
    if (trigger.includes('chat')) return <MessageSquare className="w-4 h-4" />;
    if (trigger.includes('Monday')) return <Bell className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  const getActionIcon = (action: string) => {
    if (action.includes('notification') || action.includes('Slack')) return <Bell className="w-4 h-4" />;
    if (action.includes('Email')) return <Mail className="w-4 h-4" />;
    if (action.includes('Log')) return <FileText className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Automation Flows</h1>
          <p className="text-gray-400">Streamline your document workflows with intelligent automation</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Automations</p>
                <p className="text-2xl font-bold text-white">{automations.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Active</p>
                <p className="text-2xl font-bold text-white">
                  {automations.filter(a => a.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Runs</p>
                <p className="text-2xl font-bold text-white">
                  {automations.reduce((sum, a) => sum + a.runCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-white">98.5%</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation List */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Automation Flows</h3>
              <p className="text-sm text-gray-400">Manage your automated workflows</p>
            </div>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automations.map((automation) => (
              <div
                key={automation.id}
                className="p-4 bg-gray-700/30 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-white">{automation.name}</h4>
                      <Badge variant={getStatusColor(automation.status)} className="capitalize">
                        {automation.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3">{automation.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Trigger:</span>
                        <div className="flex items-center space-x-1">
                          {getTriggerIcon(automation.trigger)}
                          <span>{automation.trigger}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Runs:</span>
                        <span>{automation.runCount}</span>
                      </div>
                      
                      {automation.lastRun && (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Last run:</span>
                          <span>{automation.lastRun.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-300">Actions:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {automation.actions.map((action, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 px-3 py-1 bg-gray-600/50 rounded-full"
                          >
                            {getActionIcon(action)}
                            <span className="text-xs text-gray-300">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        automation.status === 'active'
                          ? 'text-yellow-400 hover:bg-yellow-500/10'
                          : 'text-green-400 hover:bg-green-500/10'
                      }`}
                    >
                      {automation.status === 'active' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-600/50 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-600/50 rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};