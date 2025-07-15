import React, { createContext, useContext, useState } from 'react'
import { File, Folder, Usage, Organization } from '../types'

interface DataContextType {
  files: File[]
  folders: Folder[]
  currentFolder: Folder | null
  usage: Usage
  organization: Organization
  setCurrentFolder: (folder: Folder | null) => void
  uploadFile: (file: File) => void
  deleteFile: (fileId: string) => void
  createFolder: (name: string, parentId?: string) => void
  updateUsage: (type: 'uploads' | 'chats' | 'storage', amount: number) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const useData = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

// Mock data
const mockFolders: Folder[] = [
  {
    id: 'root',
    name: 'Root',
    path: '/',
    permissions: { admin: ['read', 'write', 'delete'] },
    createdAt: new Date(),
    createdBy: '1',
    children: [
      {
        id: 'invoices',
        name: 'Invoices',
        parentId: 'root',
        path: '/invoices',
        permissions: { admin: ['read', 'write', 'delete'], uploader: ['read', 'write'] },
        createdAt: new Date(),
        createdBy: '1'
      },
      {
        id: 'contracts',
        name: 'Contracts',
        parentId: 'root',
        path: '/contracts',
        permissions: { admin: ['read', 'write', 'delete'], viewer: ['read'] },
        createdAt: new Date(),
        createdBy: '1'
      },
      {
        id: 'reports',
        name: 'Reports',
        parentId: 'root',
        path: '/reports',
        permissions: { admin: ['read', 'write', 'delete'] },
        createdAt: new Date(),
        createdBy: '1'
      }
    ]
  }
]

const mockFiles: File[] = [
  {
    id: '1',
    name: 'Q4 Financial Report.pdf',
    type: 'application/pdf',
    size: 2048000,
    folderId: 'reports',
    uploadedBy: 'John Doe',
    uploadedAt: new Date('2024-01-15'),
    tags: ['financial', 'q4', 'report'],
    aiStatus: 'completed',
    aiEngine: 'openai',
    summary: 'Q4 financial report showing 15% revenue growth',
    downloadUrl: '#'
  },
  {
    id: '2',
    name: 'Invoice_2024_001.pdf',
    type: 'application/pdf',
    size: 512000,
    folderId: 'invoices',
    uploadedBy: 'Jane Smith',
    uploadedAt: new Date('2024-01-10'),
    tags: ['invoice', '2024', 'payment'],
    aiStatus: 'completed',
    aiEngine: 'gemini',
    summary: 'Invoice for consulting services - $5,000',
    downloadUrl: '#'
  },
  {
    id: '3',
    name: 'Service Agreement.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 1024000,
    folderId: 'contracts',
    uploadedBy: 'Mike Johnson',
    uploadedAt: new Date('2024-01-08'),
    tags: ['contract', 'service', 'agreement'],
    aiStatus: 'processing',
    aiEngine: 'deepseek',
    downloadUrl: '#'
  }
]

const mockUsage: Usage = {
  uploadsUsed: 150,
  uploadsLimit: 500,
  chatsUsed: 89,
  chatsLimit: 200,
  storageUsed: 25600000000, // 25.6 GB
  storageLimit: 107374182400, // 100 GB
  period: 'monthly'
}

const mockOrganization: Organization = {
  id: '1',
  name: 'DocIntel Demo Corp',
  plan: 'pro',
  usage: mockUsage,
  settings: {
    defaultAiEngine: 'openai',
    enabledAiEngines: ['openai', 'gemini', 'deepseek', 'llama'],
    language: 'en',
    retentionDays: 365
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<File[]>(mockFiles)
  const [folders, setFolders] = useState<Folder[]>(mockFolders)
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null)
  const [usage, setUsage] = useState<Usage>(mockUsage)
  const [organization] = useState<Organization>(mockOrganization)

  const uploadFile = (file: File) => {
    setFiles(prev => [...prev, file])
  }

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const createFolder = (name: string, parentId?: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      parentId,
      path: parentId ? `${folders.find(f => f.id === parentId)?.path}/${name}` : `/${name}`,
      permissions: { admin: ['read', 'write', 'delete'] },
      createdAt: new Date(),
      createdBy: '1'
    }
    setFolders(prev => [...prev, newFolder])
  }

  const updateUsage = (type: 'uploads' | 'chats' | 'storage', amount: number) => {
    setUsage(prev => ({
      ...prev,
      [`${type}Used`]: prev[`${type}Used` as keyof Usage] as number + amount
    }))
  }

  return (
    <DataContext.Provider value={{
      files,
      folders,
      currentFolder,
      usage,
      organization,
      setCurrentFolder,
      uploadFile,
      deleteFile,
      createFolder,
      updateUsage
    }}>
      {children}
    </DataContext.Provider>
  )
}