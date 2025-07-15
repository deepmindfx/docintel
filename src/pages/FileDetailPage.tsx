import React, { useState } from 'react';
import { useData } from '../contexts/DataProvider';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Tab } from '@headlessui/react';
import { 
  ArrowLeft,
  FileText, 
  MessageCircle, 
  Send, 
  Brain,
  Eye,
  Download,
  Share,
  Tag,
  Calendar,
  User,
  Database,
  Zap,
  Copy,
  ExternalLink
} from 'lucide-react';
import { formatFileSize, formatDateTime } from '../lib/utils';
import { cn } from '../lib/utils';

interface FileDetailPageProps {
  fileId: string;
  onNavigateBack: () => void;
}

export const FileDetailPage: React.FC<FileDetailPageProps> = ({ fileId, onNavigateBack }) => {
  const { files } = useData();
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Hello! I can help you analyze this document. What would you like to know?',
      timestamp: new Date(),
      aiEngine: 'openai' as const
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const file = files.find(f => f.id === fileId);

  if (!file) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">File Not Found</h2>
          <p className="text-gray-400 mb-4">The requested file could not be found.</p>
          <Button onClick={onNavigateBack} className="bg-emerald-600 hover:bg-emerald-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Files
          </Button>
        </div>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: chatMessage,
      timestamp: new Date(),
      aiEngine: 'openai' as const
    };

    setChatHistory(prev => [...prev, newMessage]);
    setChatMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `Based on my analysis of "${file.name}", I can see this document contains ${file.summary || 'important information'}. The document appears to be a ${file.type.includes('pdf') ? 'PDF document' : 'document'} with key insights about the content. What specific aspect would you like me to elaborate on?`,
        timestamp: new Date(),
        aiEngine: (file.aiEngine || 'openai') as const
      };
      setChatHistory(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('image')) return '🖼️';
    if (type.includes('excel')) return '📊';
    return '📄';
  };

  const mockExtractedData = {
    names: ['John Smith', 'Sarah Johnson', 'DocIntel Corp'],
    amounts: ['$5,000.00', '$2,500.00', '$7,500.00'],
    dates: ['2024-01-15', '2024-02-01', '2024-03-15'],
    emails: ['john@example.com', 'sarah@docintel.com'],
    phoneNumbers: ['+1 (555) 123-4567', '+1 (555) 987-6543']
  };

  const mockOcrText = `This is a sample OCR text extracted from the document "${file.name}". 

The document contains important information about business operations, financial data, and strategic planning. Key sections include:

1. Executive Summary
2. Financial Overview
3. Operational Metrics
4. Strategic Initiatives
5. Risk Assessment

The content has been processed using advanced OCR technology to ensure accurate text extraction and analysis.`;

  const tabs = [
    { name: 'Chat', icon: MessageCircle },
    { name: 'Summary', icon: FileText },
    { name: 'Extracted Data', icon: Database },
    { name: 'OCR Text', icon: Eye },
    { name: 'Metadata', icon: Tag }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onNavigateBack}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">{file.name}</h1>
            <p className="text-gray-400">
              {formatFileSize(file.size)} • Uploaded by {file.uploadedBy} • {formatDateTime(file.uploadedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={file.aiStatus === 'completed' ? 'success' : 'warning'}>
            {file.aiStatus}
          </Badge>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* File Preview */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <h3 className="text-lg font-bold text-white">File Preview</h3>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-700/30 rounded-lg p-8 text-center">
            {file.previewUrl ? (
              <img
                src={file.previewUrl}
                alt={file.name}
                className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
              />
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="text-6xl">{getFileIcon(file.type)}</div>
                <div>
                  <h4 className="text-xl font-bold text-white">{file.name}</h4>
                  <p className="text-gray-400">{file.type}</p>
                </div>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Viewer
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card className="bg-gray-800/50 border-gray-700">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-700/30 p-1 m-6 mb-0">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  cn(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-gray-300 hover:bg-gray-600/50 hover:text-white'
                  )
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </div>
              </Tab>
            ))}
          </Tab.List>
          
          <Tab.Panels className="p-6">
            {/* Chat Tab */}
            <Tab.Panel className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Chat with Document</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="success">
                    {file.aiEngine === 'docintel' ? 'DocIntel AI' : 'OpenAI GPT-4'}
                  </Badge>
                  <span className="text-sm text-gray-400">{chatHistory.length - 1} messages</span>
                </div>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-4 h-96 overflow-y-auto space-y-4">
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-600/50 text-gray-300'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-600/50 text-gray-300 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask about this document..."
                  className="flex-1 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Tab.Panel>

            {/* Summary Tab */}
            <Tab.Panel className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Document Summary</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="success">AI Generated</Badge>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Zap className="w-4 h-4 mr-1" />
                    Regenerate
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-6">
                <div className="prose prose-invert max-w-none">
                  <h4 className="text-white font-semibold mb-3">Executive Summary</h4>
                  <p className="text-gray-300 mb-4">
                    {file.summary || 'This document contains important business information with key insights and data points relevant to organizational operations.'}
                  </p>
                  
                  <h4 className="text-white font-semibold mb-3">Key Points</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Document contains financial and operational data</li>
                    <li>• Multiple stakeholders and entities referenced</li>
                    <li>• Time-sensitive information with specific dates</li>
                    <li>• Actionable items and recommendations included</li>
                  </ul>
                  
                  <h4 className="text-white font-semibold mb-3 mt-6">AI Analysis Confidence</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-600 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm text-gray-300">92%</span>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Extracted Data Tab */}
            <Tab.Panel className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Extracted Data</h3>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="w-4 h-4 mr-1" />
                  Export JSON
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Names & Entities
                  </h4>
                  <div className="space-y-2">
                    {mockExtractedData.names.map((name, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-300">{name}</span>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3 flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    Amounts
                  </h4>
                  <div className="space-y-2">
                    {mockExtractedData.amounts.map((amount, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-300 font-mono">{amount}</span>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Dates
                  </h4>
                  <div className="space-y-2">
                    {mockExtractedData.dates.map((date, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-300 font-mono">{date}</span>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Info
                  </h4>
                  <div className="space-y-2">
                    {[...mockExtractedData.emails, ...mockExtractedData.phoneNumbers].map((contact, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{contact}</span>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* OCR Text Tab */}
            <Tab.Panel className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">OCR Text</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="success">Text Extracted</Badge>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Copy className="w-4 h-4 mr-1" />
                    Copy All
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-6">
                <div className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {mockOcrText}
                </div>
              </div>
            </Tab.Panel>

            {/* Metadata Tab */}
            <Tab.Panel className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">File Metadata</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700/30 rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-white">File Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">File Name:</span>
                      <span className="text-white">{file.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">File Size:</span>
                      <span className="text-white">{formatFileSize(file.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">File Type:</span>
                      <span className="text-white">{file.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Uploaded:</span>
                      <span className="text-white">{formatDateTime(file.uploadedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Uploaded By:</span>
                      <span className="text-white">{file.uploadedBy}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700/30 rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-white">AI Processing</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">AI Status:</span>
                      <Badge variant={file.aiStatus === 'completed' ? 'success' : 'warning'}>
                        {file.aiStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">AI Engine:</span>
                      <span className="text-white capitalize">{file.aiEngine || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Processing Time:</span>
                      <span className="text-white">2.3 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Confidence:</span>
                      <span className="text-white">92%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700/30 rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-white">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {file.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-700/30 rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-white">Access</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Folder:</span>
                      <span className="text-white">{file.folderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Views:</span>
                      <span className="text-white">47</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Downloads:</span>
                      <span className="text-white">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Accessed:</span>
                      <span className="text-white">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Card>
    </div>
  );
};