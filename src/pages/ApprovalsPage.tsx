import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  User,
  MessageCircle,
  Eye,
  AlertCircle
} from 'lucide-react';

interface ApprovalItem {
  id: string;
  type: 'upload' | 'access' | 'edit';
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  relatedFile?: string;
}

export const ApprovalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [approvals] = useState<ApprovalItem[]>([
    {
      id: '1',
      type: 'upload',
      title: 'Upload to Contracts folder',
      description: 'Request to upload "Service Agreement Template.docx" to the Contracts folder',
      requestedBy: 'Jane Smith',
      requestedAt: new Date('2024-01-15T10:30:00'),
      status: 'pending',
      priority: 'high',
      relatedFile: 'Service Agreement Template.docx'
    },
    {
      id: '2',
      type: 'access',
      title: 'Access to Financial Reports',
      description: 'Request read access to the Financial Reports folder',
      requestedBy: 'Mike Johnson',
      requestedAt: new Date('2024-01-14T14:20:00'),
      status: 'pending',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'edit',
      title: 'Edit Invoice Template',
      description: 'Request to modify the standard invoice template',
      requestedBy: 'Sarah Davis',
      requestedAt: new Date('2024-01-13T09:15:00'),
      status: 'pending',
      priority: 'low',
      relatedFile: 'Invoice_Template.pdf'
    }
  ]);

  const filteredApprovals = approvals.filter(approval => approval.status === activeTab);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'upload': return <FileText className="w-4 h-4" />;
      case 'access': return <User className="w-4 h-4" />;
      case 'edit': return <MessageCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'upload': return 'bg-blue-500/10 text-blue-400';
      case 'access': return 'bg-green-500/10 text-green-400';
      case 'edit': return 'bg-yellow-500/10 text-yellow-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleApprove = (id: string) => {
    // Handle approval logic
    console.log('Approved:', id);
  };

  const handleReject = (id: string) => {
    // Handle rejection logic
    console.log('Rejected:', id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Approvals</h1>
        <p className="text-gray-400">Review and manage pending requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Approval Requests</h3>
              <p className="text-sm text-gray-400">Manage pending approvals</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'approved'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'rejected'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredApprovals.map((approval) => (
              <div
                key={approval.id}
                className="p-4 bg-gray-700/30 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(approval.type)}`}>
                      {getTypeIcon(approval.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-white">{approval.title}</h4>
                        <Badge variant={getPriorityColor(approval.priority)}>
                          {approval.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-2">{approval.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>By {approval.requestedBy}</span>
                        <span>•</span>
                        <span>{approval.requestedAt.toLocaleDateString()}</span>
                        {approval.relatedFile && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400">{approval.relatedFile}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {approval.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(approval.id)}
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(approval.id)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};