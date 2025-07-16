import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useData } from '../contexts/DataProvider';
import { 
  Send, 
  FileText,
  Folder,
  Download, 
  Brain, 
  Zap,
  MessageCircle,
  Settings,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { files, folders, getFilesByFolder, organization } = useData();
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [message, setMessage] = useState('');
  const [selectedAiEngine, setSelectedAiEngine] = useState<'openai' | 'docintel' | 'qwen'>('qwen');
  const [apiKeys, setApiKeys] = useState<{openai: string, qwen: string}>({
    openai: '',
    qwen: ''
  });
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Hello! I can help you analyze and answer questions about your documents and folders. Select a folder to get started, and I can analyze all documents within it. What would you like to know?',
      timestamp: new Date(),
      aiEngine: selectedAiEngine
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Load API keys from localStorage on component mount
  useEffect(() => {
    try {
      const savedApiKeys = localStorage.getItem('docIntelApiKeys');
      if (savedApiKeys) {
        const parsedKeys = JSON.parse(savedApiKeys);
        setApiKeys(parsedKeys);
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
    }
  }, []);

  // Check if API key is available for selected engine
  const getApiKey = (engine: string) => {
    return apiKeys[engine as keyof typeof apiKeys] || '';
  };

  const isApiKeyConfigured = () => {
    const key = getApiKey(selectedAiEngine);
    return key && key.trim().length > 0;
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Check if API key is configured before proceeding
    if (!isApiKeyConfigured()) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `${selectedAiEngine.toUpperCase()} API key is not configured. Please add your API key in Settings to use this AI engine.`,
        timestamp: new Date(),
        aiEngine: selectedAiEngine
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }
    
    const folderFiles = selectedFolder ? getFilesByFolder(selectedFolder.id) : [];

    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date(),
      aiEngine: selectedAiEngine
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      let responseContent = '';
      
      if (selectedAiEngine === 'qwen') {
        const qwenApiKey = getApiKey('qwen');
        if (!qwenApiKey) {
          throw new Error('Qwen API key is not configured. Please add your API key in Settings.');
        }
        
        // Prepare context from selected folder and files
        let contextInfo = '';
        if (selectedFolder && folderFiles.length > 0) {
          const fileNames = folderFiles.map(f => f.name).join(', ');
          const totalSize = folderFiles.reduce((sum, f) => sum + f.size, 0);
          const ocrTexts = folderFiles.filter(f => f.ocrText).map(f => `File: ${f.name}\nOCR Text: ${f.ocrText}`).join('\n\n');
          const summaries = folderFiles.filter(f => f.summary).map(f => `File: ${f.name}\nSummary: ${f.summary}`).join('\n\n');
          
          contextInfo = `
Folder: ${selectedFolder.name}
Files: ${fileNames}
Total files: ${folderFiles.length}
Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB

${ocrTexts ? `OCR Content:\n${ocrTexts}\n\n` : ''}
${summaries ? `File Summaries:\n${summaries}\n\n` : ''}
          `.trim();
        }
        
        // Make API call to Qwen via Supabase Edge Function
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            contextInfo,
            userMessage: message,
            engine: 'qwen',
            apiKey: qwenApiKey
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Supabase Edge Function error (${response.status})`);
        }
        
        const data = await response.json();
        responseContent = data.content || 'No response received from Qwen API';
        
      } else if (selectedAiEngine === 'openai') {
        // OpenAI implementation - can also use proxy if desired
        const openaiApiKey = getApiKey('openai');
        if (!openaiApiKey) {
          throw new Error('OpenAI API key is not configured. Please add your API key in Settings.');
        }
        
        // Prepare context from selected folder and files
        let contextInfo = '';
        if (selectedFolder && folderFiles.length > 0) {
          const fileNames = folderFiles.map(f => f.name).join(', ');
          const totalSize = folderFiles.reduce((sum, f) => sum + f.size, 0);
          const ocrTexts = folderFiles.filter(f => f.ocrText).map(f => `File: ${f.name}\nOCR Text: ${f.ocrText}`).join('\n\n');
          const summaries = folderFiles.filter(f => f.summary).map(f => `File: ${f.name}\nSummary: ${f.summary}`).join('\n\n');
          
          contextInfo = `
Folder: ${selectedFolder.name}
Files: ${fileNames}
Total files: ${folderFiles.length}
Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB

${ocrTexts ? `OCR Content:\n${ocrTexts}\n\n` : ''}
${summaries ? `File Summaries:\n${summaries}\n\n` : ''}
          `.trim();
        }
        
        // Make API call to OpenAI via Supabase Edge Function
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            contextInfo,
            userMessage: message,
            engine: 'openai',
            apiKey: openaiApiKey
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Supabase Edge Function error (${response.status})`);
        }
        
        const data = await response.json();
        responseContent = data.content || 'No response received from OpenAI';
        
      } else {
        // DocIntel or other fallback
        responseContent = selectedFolder && folderFiles.length > 0
          ? `Based on the analysis of the "${selectedFolder.name}" folder containing ${folderFiles.length} document(s), I can provide insights about your query. These documents contain information about various topics. What specific aspect would you like me to elaborate on?`
          : 'I can help you analyze documents and folders once you upload them. Please select a folder to get started.';
      }
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: responseContent,
        timestamp: new Date(),
        aiEngine: selectedAiEngine
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
    } catch (error) {
      console.error('Error calling AI API:', error);
      
      let errorMessage = '';
      
      // Handle specific error types for better user guidance
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        if (selectedAiEngine === 'qwen') {
          errorMessage = 'Connection to Qwen API failed via Supabase Edge Function. Please check your network connection and try again.';
        } else {
          errorMessage = `Connection to ${selectedAiEngine.toUpperCase()} API failed via Supabase Edge Function. Please check your network connection and try again.`;
        }
      } else if (error.message.includes('Supabase Edge Function error (500)')) {
        errorMessage = 'Supabase Edge Function encountered an error. Please check: 1) Your API keys are correctly configured as Supabase secrets, 2) The Edge Function is deployed and running.';
      } else {
        errorMessage = `Sorry, I encountered an error while processing your request: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API configuration and try again.`;
      }
      
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: errorMessage,
        timestamp: new Date(),
        aiEngine: selectedAiEngine
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: 'Summarize', icon: FileText, action: () => setMessage('Please summarize this document') },
    { label: 'Extract Data', icon: Download, action: () => setMessage('Extract key data points from this document') },
    { label: 'Key Insights', icon: Brain, action: () => setMessage('What are the key insights from this document?') },
    { label: 'Action Items', icon: Zap, action: () => setMessage('List any action items or next steps') }
  ];

  return (
    <div className="p-6 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Folder Selector */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <h3 className="text-lg font-bold text-white">Select Folder</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {folders.filter(folder => folder.id !== 'root').map((folder) => {
                const folderFiles = getFilesByFolder(folder.id);
                return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedFolder?.id === folder.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Folder className="w-4 h-4" />
                    <span className="font-medium truncate">{folder.name}</span>
                  </div>
                  <div className="text-xs mt-1 opacity-75">
                    {folderFiles.length} file{folderFiles.length !== 1 ? 's' : ''} • {folder.path}
                  </div>
                </button>
                );
              })}
              
              {folders.filter(folder => folder.id !== 'root').length === 0 && (
                <div className="text-center py-8">
                  <Folder className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No folders available</p>
                  <p className="text-xs text-gray-500 mt-1">Create folders to organize your documents</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Chat Header */}
          <Card className="bg-gray-800/50 border-gray-700 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">AI Assistant</h3>
                    <p className="text-sm text-gray-400">
                      {selectedFolder ? `Analyzing folder: ${selectedFolder.name}` : 'No folder selected'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Badge variant={isApiKeyConfigured() ? "success" : "destructive"}>
                      {selectedAiEngine === 'qwen' ? 'Qwen-VL' : selectedAiEngine === 'docintel' ? 'DocIntel AI' : 'OpenAI GPT-4'}
                    </Badge>
                    {!isApiKeyConfigured() && (
                      <AlertCircle className="w-4 h-4 text-red-400" title="API key not configured" />
                    )}
                  </div>
                  <select
                    value={selectedAiEngine}
                    onChange={(e) => setSelectedAiEngine(e.target.value as 'openai' | 'docintel' | 'qwen')}
                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="docintel">DocIntel</option>
                    <option value="qwen">Qwen-VL</option>
                  </select>
                  <button className="p-2 text-gray-400 hover:text-white">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* API Key Warning */}
              {!isApiKeyConfigured() && (
                <div className="mt-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-300">
                      {selectedAiEngine.toUpperCase()} API key is not configured. Please add your API key in Settings.
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="bg-gray-800/50 border-gray-700 flex-1 flex flex-col">
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-700/50 text-gray-300'
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
                    <div className="bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-gray-300">Quick Actions for Folder</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={action.action}
                      disabled={!isApiKeyConfigured()}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors text-sm ${
                        isApiKeyConfigured() 
                          ? 'bg-gray-700/30 hover:bg-gray-700/50 text-gray-300'
                          : 'bg-gray-700/10 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <action.icon className="w-4 h-4" />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isApiKeyConfigured() ? "Ask about this folder's documents..." : "Configure API key in Settings to chat..."}
                    className="flex-1 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={!isApiKeyConfigured()}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading || !selectedFolder || !isApiKeyConfigured()}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};