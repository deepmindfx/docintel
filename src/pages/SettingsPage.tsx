import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useData } from '../contexts/DataProvider';
import { useTheme } from '../contexts/ThemeProvider';
import { 
  Settings, 
  Brain, 
  Globe, 
  Shield, 
  Key, 
  Bell,
  Moon,
  Sun,
  Save,
  Database,
  Zap
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { organization, setOrganization } = useData();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'security' | 'notifications'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // Local state for API keys
  const [apiKeys, setApiKeys] = useState({
    openai: organization.settings.apiKeys?.openai || '',
    qwen: organization.settings.apiKeys?.qwen || ''
  });

  // Load saved API keys on component mount
  useEffect(() => {
    try {
      const savedApiKeys = localStorage.getItem('docIntelApiKeys');
      if (savedApiKeys) {
        const parsedKeys = JSON.parse(savedApiKeys);
        setApiKeys(parsedKeys);
      }
    } catch (error) {
      console.error('Error loading saved API keys:', error);
    }
  }, []);

  // Global function to get API keys (for use by other parts of the app)
  useEffect(() => {
    (window as any).getApiKeys = () => {
      const savedApiKeys = localStorage.getItem('docIntelApiKeys');
      return savedApiKeys ? JSON.parse(savedApiKeys) : apiKeys;
    };
  }, [apiKeys]);

  // Save function to handle persistence
  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Save to localStorage for immediate access
      localStorage.setItem('docIntelApiKeys', JSON.stringify(apiKeys));
      
      // If you have an API endpoint to save settings, call it here
      // await fetch('/api/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ apiKeys })
      // });
      
      // Update the organization context with new API keys
      setOrganization({
        ...organization,
        settings: {
          ...organization.settings,
          apiKeys
        }
      });
      
      setSaveMessage('Settings saved successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'ai', label: 'AI Engines', icon: Brain },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const aiEngines = [
    { id: 'openai', name: 'OpenAI GPT-4', enabled: true, cost: '$0.03/1K tokens' },
    { id: 'docintel', name: 'DocIntel AI', enabled: true, cost: '$0.015/1K tokens' }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
    { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
    { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
    { code: 'fr', name: 'French', flag: '🇫🇷' }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Organization Name
          </label>
          <Input
            defaultValue={organization.name}
            className="bg-gray-700/50 border-gray-600 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Language
          </label>
          <select className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white">
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Default AI Engine
          </label>
          <select className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white">
            {aiEngines.filter(e => e.enabled).map((engine) => (
              <option key={engine.id} value={engine.id}>
                {engine.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            File Retention (days)
          </label>
          <Input
            type="number"
            defaultValue={organization.settings.retentionDays}
            className="bg-gray-700/50 border-gray-600 text-white"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
        <div className="flex items-center space-x-3">
          {theme === 'dark' ? (
            <Moon className="w-5 h-5 text-gray-400" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
          <div>
            <div className="font-medium text-white">Theme</div>
            <div className="text-sm text-gray-400">
              Currently using {theme} theme
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={toggleTheme} className="border-gray-600 text-gray-300 hover:bg-gray-700">
          Switch to {theme === 'dark' ? 'Light' : 'Dark'}
        </Button>
      </div>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {aiEngines.map((engine) => (
          <div key={engine.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-gray-300" />
              </div>
              <div>
                <div className="font-medium text-white">{engine.name}</div>
                <div className="text-sm text-gray-400">{engine.cost}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={engine.enabled ? 'success' : 'secondary'}>
                {engine.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={engine.enabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
      
      <Card className="bg-gray-700/30 border-gray-600">
        <CardHeader>
          <h4 className="text-lg font-bold text-white">API Keys</h4>
          <p className="text-sm text-gray-400">Configure your AI model API keys</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              OpenAI API Key
            </label>
            <Input
              type="password"
              placeholder="sk-proj-..."
              value={apiKeys.openai}
              onChange={(e) => setApiKeys(prev => ({
                ...prev,
                openai: e.target.value
              }))}
              className="bg-gray-700/50 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Qwen API Key (DashScope)
            </label>
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKeys.qwen}
              onChange={(e) => setApiKeys(prev => ({
                ...prev,
                qwen: e.target.value
              }))}
              className="bg-gray-700/50 border-gray-600 text-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get your API key from <a href="https://dashscope.console.aliyun.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">DashScope Console</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-green-400" />
            <div>
              <div className="font-medium text-white">Two-Factor Authentication</div>
              <div className="text-sm text-gray-400">Add an extra layer of security</div>
            </div>
          </div>
          <Badge variant="secondary">Disabled</Badge>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <Key className="w-5 h-5 text-blue-400" />
            <div>
              <div className="font-medium text-white">API Access</div>
              <div className="text-sm text-gray-400">Manage API keys and access</div>
            </div>
          </div>
          <Badge variant="success">Enabled</Badge>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-purple-400" />
            <div>
              <div className="font-medium text-white">Data Encryption</div>
              <div className="text-sm text-gray-400">AES-256 encryption enabled</div>
            </div>
          </div>
          <Badge variant="success">Active</Badge>
        </div>
      </div>
      
      <Card className="bg-gray-700/30 border-gray-600">
        <CardHeader>
          <h4 className="text-lg font-bold text-white">IP Restrictions</h4>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Allowed IP Addresses
              </label>
              <Input
                placeholder="192.168.1.0/24"
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ipRestrictions"
                className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500"
              />
              <label htmlFor="ipRestrictions" className="text-sm text-gray-300">
                Enable IP restrictions (Enterprise only)
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { id: 'uploads', label: 'File uploads', description: 'Get notified when files are uploaded' },
          { id: 'chats', label: 'AI chat sessions', description: 'Notifications for new chat sessions' },
          { id: 'approvals', label: 'Approval requests', description: 'When approval is required' },
          { id: 'usage', label: 'Usage limits', description: 'When approaching usage limits' },
          { id: 'security', label: 'Security alerts', description: 'Important security notifications' }
        ].map((notification) => (
          <div key={notification.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium text-white">{notification.label}</div>
                <div className="text-sm text-gray-400">{notification.description}</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={true}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        ))}
      </div>
      
      <Card className="bg-gray-700/30 border-gray-600">
        <CardHeader>
          <h4 className="text-lg font-bold text-white">Notification Channels</h4>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Notifications
            </label>
            <Input
              type="email"
              placeholder="notifications@company.com"
              className="bg-gray-700/50 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slack Webhook URL
            </label>
            <Input
              type="url"
              placeholder="https://hooks.slack.com/..."
              className="bg-gray-700/50 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'ai':
        return renderAISettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Manage your DocIntel configuration</p>
        </div>
        <div className="flex items-center space-x-3">
          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {saveMessage}
            </span>
          )}
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50" 
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-700/30 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          {renderTabContent()}
        </CardContent>
      </Card>
    </div>
  );
};