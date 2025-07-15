import React, { createContext, useContext, useState, useEffect } from 'react';
import { DocumentFile, Folder, Usage, Organization, ChatMessage, Analytics } from '../types';

interface DataContextType {
  files: DocumentFile[];
  folders: Folder[];
  currentFolder: Folder | null;
  usage: Usage;
  organization: Organization;
  analytics: Analytics;
  chatMessages: ChatMessage[];
  setCurrentFolder: (folder: Folder | null) => void;
  uploadFile: (file: DocumentFile) => void;
  deleteFile: (fileId: string) => void;
  createFolder: (name: string, parentId?: string) => void;
  updateUsage: (type: 'uploads' | 'chats' | 'storage', amount: number) => void;
  addChatMessage: (message: ChatMessage) => void;
  getFilesByFolder: (folderId: string) => DocumentFile[];
  setOrganization: (organization: Organization) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Local storage keys
const STORAGE_KEYS = {
  files: 'docintel_files',
  folders: 'docintel_folders',
  usage: 'docintel_usage',
  organization: 'docintel_organization',
  analytics: 'docintel_analytics',
  chatMessages: 'docintel_chat_messages'
};

// Date reviver function for JSON.parse
const dateReviver = (key: string, value: any) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
};

// Helper function to get initial state from localStorage or return default
const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored, dateReviver);
      // Deep merge with default values to ensure all properties exist
      const result = { ...defaultValue, ...parsed };
      
      // Ensure arrays remain arrays even if localStorage data is corrupted
      if (Array.isArray(defaultValue) && !Array.isArray(result)) {
        return defaultValue;
      }
      
      return result;
    }
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
  }
  return defaultValue;
};

// Helper function to save state to localStorage
const saveToStorage = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

// Default initial values
const initialFolders: Folder[] = [
  {
    id: 'root',
    name: 'Root',
    path: '/',
    permissions: { admin: ['read', 'write', 'delete'] },
    createdAt: new Date(),
    createdBy: '1'
  }
];

const initialUsage: Usage = {
  uploadsUsed: 0,
  uploadsLimit: 100,
  chatsUsed: 0,
  chatsLimit: 50,
  storageUsed: 0,
  storageLimit: 5368709120, // 5GB in bytes
  tokensUsed: 0,
  tokensLimit: 10000,
  requestsMade: 0,
  requestsLimit: 100,
  period: 'monthly'
};

const initialAnalytics: Analytics = {
  totalFiles: 0,
  totalChats: 0,
  totalUploads: 0,
  totalStorage: 0,
  tokensUsed: 0,
  requestsMade: 0,
  monthlyData: [],
  topFiles: [],
  aiEngineUsage: {
    openai: 0,
    docintel: 0,
    qwen: 0
  }
};

const initialOrganization: Organization = {
  id: '1',
  name: 'DocIntel Enterprise',
  plan: 'free',
  usage: initialUsage,
  settings: {
    defaultAiEngine: 'qwen',
    enabledAiEngines: ['openai', 'docintel', 'qwen'],
    apiKeys: {
      qwen: ''
    },
    language: 'en',
    retentionDays: 365,
    theme: 'dark'
  }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [files, setFiles] = useState<File[]>(() => 
    getInitialState(STORAGE_KEYS.files, [])
  );
  
  const [folders, setFolders] = useState<Folder[]>(() => 
    getInitialState(STORAGE_KEYS.folders, initialFolders)
  );
  
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  
  const [usage, setUsage] = useState<Usage>(() => 
    getInitialState(STORAGE_KEYS.usage, initialUsage)
  );
  
  const [organization, setOrganization] = useState<Organization>(() => 
    getInitialState(STORAGE_KEYS.organization, initialOrganization)
  );
  
  const [analytics, setAnalytics] = useState<Analytics>(() => 
    getInitialState(STORAGE_KEYS.analytics, initialAnalytics)
  );
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => 
    getInitialState(STORAGE_KEYS.chatMessages, [])
  );

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.files, files);
  }, [files]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.folders, folders);
  }, [folders]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.usage, usage);
  }, [usage]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.organization, organization);
  }, [organization]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.analytics, analytics);
  }, [analytics]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.chatMessages, chatMessages);
  }, [chatMessages]);

  const uploadFile = (file: DocumentFile) => {
    // Simulate AI processing based on engine
    const simulatedTokens = file.aiEngine === 'qwen' ? 150 : 100;
    const simulatedOcrText = file.aiEngine === 'qwen' 
      ? `OCR extracted text from ${file.name}. This document contains structured information including dates, names, and key data points that have been processed using Qwen-VL's advanced vision capabilities.`
      : undefined;
    
    const simulatedExtractedData = file.aiEngine === 'qwen' 
      ? {
          names: ['John Smith', 'Sarah Johnson'],
          dates: ['2024-01-15', '2024-02-01'],
          amounts: ['$5,000.00', '$2,500.00'],
          categories: ['Financial', 'Business']
        }
      : undefined;
    
    const simulatedCategory = file.aiEngine === 'qwen' 
      ? 'Business Document'
      : 'General Document';
    
    // Update file with AI processing results
    const processedFile = {
      ...file,
      ocrText: simulatedOcrText,
      extractedData: simulatedExtractedData,
      category: simulatedCategory,
      tags: file.aiEngine === 'qwen' 
        ? [...file.tags, 'ocr-processed', 'qwen-analyzed']
        : file.tags
    };
    
    setFiles(prev => [...prev, file]);
    
    // Update usage statistics
    setUsage(prev => ({
      ...prev,
      uploadsUsed: prev.uploadsUsed + 1,
      storageUsed: prev.storageUsed + file.size,
      tokensUsed: prev.tokensUsed + simulatedTokens,
      requestsMade: prev.requestsMade + 1
    }));
    
    // Update analytics
    setAnalytics(prev => ({
      ...prev,
      totalFiles: prev.totalFiles + 1,
      totalUploads: prev.totalUploads + 1,
      totalStorage: prev.totalStorage + file.size,
      tokensUsed: prev.tokensUsed + simulatedTokens,
      requestsMade: prev.requestsMade + 1,
      aiEngineUsage: {
        ...prev.aiEngineUsage,
        [file.aiEngine || 'openai']: prev.aiEngineUsage[file.aiEngine || 'openai'] + 1
      }
    }));
    
    // Update organization usage
    setOrganization(prev => ({
      ...prev,
      usage: {
        ...prev.usage,
        uploadsUsed: prev.usage.uploadsUsed + 1,
        storageUsed: prev.usage.storageUsed + file.size,
        tokensUsed: prev.usage.tokensUsed + simulatedTokens,
        requestsMade: prev.usage.requestsMade + 1
      }
    }));
  };

  const deleteFile = (fileId: string) => {
    const fileToDelete = files.find(f => f.id === fileId);
    if (fileToDelete) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      
      // Update usage statistics
      setUsage(prev => ({
        ...prev,
        storageUsed: Math.max(0, prev.storageUsed - fileToDelete.size)
      }));
      
      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        totalFiles: Math.max(0, prev.totalFiles - 1),
        totalStorage: Math.max(0, prev.totalStorage - fileToDelete.size)
      }));
      
      // Update organization usage
      setOrganization(prev => ({
        ...prev,
        usage: {
          ...prev.usage,
          storageUsed: Math.max(0, prev.usage.storageUsed - fileToDelete.size)
        }
      }));
    }
  };

  const createFolder = (name: string, parentId?: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      parentId: parentId || 'root',
      path: parentId ? `${folders.find(f => f.id === parentId)?.path}/${name}` : `/${name}`,
      permissions: { admin: ['read', 'write', 'delete'] },
      createdAt: new Date(),
      createdBy: '1'
    };
    
    setFolders(prev => [...prev, newFolder]);
  };

  const updateUsage = (type: 'uploads' | 'chats' | 'storage', amount: number) => {
    setUsage(prev => ({
      ...prev,
      [`${type}Used`]: prev[`${type}Used` as keyof Usage] as number + amount
    }));
  };

  const addChatMessage = (message: ChatMessage) => {
    const simulatedTokens = message.aiEngine === 'qwen' ? 75 : 50;
    
    setChatMessages(prev => [...prev, message]);
    
    // Update usage statistics for chats
    if (message.role === 'user') {
      setUsage(prev => ({
        ...prev,
        chatsUsed: prev.chatsUsed + 1,
        tokensUsed: prev.tokensUsed + simulatedTokens,
        requestsMade: prev.requestsMade + 1
      }));
      
      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        totalChats: prev.totalChats + 1,
        tokensUsed: prev.tokensUsed + simulatedTokens,
        requestsMade: prev.requestsMade + 1,
        aiEngineUsage: {
          ...prev.aiEngineUsage,
          [message.aiEngine]: prev.aiEngineUsage[message.aiEngine] + 1
        }
      }));
      
      // Update organization usage
      setOrganization(prev => ({
        ...prev,
        usage: {
          ...prev.usage,
          chatsUsed: prev.usage.chatsUsed + 1,
          tokensUsed: prev.usage.tokensUsed + simulatedTokens,
          requestsMade: prev.usage.requestsMade + 1
        }
      }));
    }
  };

  const getFilesByFolder = (folderId: string): DocumentFile[] => {
    return files.filter(file => file.folderId === folderId);
  };

  return (
    <DataContext.Provider value={{
      files,
      folders,
      currentFolder,
      usage,
      organization,
      analytics,
      chatMessages,
      setCurrentFolder,
      uploadFile,
      deleteFile,
      createFolder,
      updateUsage,
      addChatMessage,
      getFilesByFolder
      setOrganization
    }}>
      {children}
    </DataContext.Provider>
  );
};