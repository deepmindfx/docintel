import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useData } from '../contexts/DataProvider';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  X, 
  Check,
  Brain,
  Folder,
  Tag,
  Settings
} from 'lucide-react';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  aiSuggestions?: {
    folder: string;
    tags: string[];
    category: string;
  };
}

export const UploadPage: React.FC = () => {
  const { createFolder, folders, uploadFile } = useData();
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('auto');
  const [aiCategorization, setAiCategorization] = useState(true);
  const [selectedAiEngine, setSelectedAiEngine] = useState<'openai' | 'docintel' | 'qwen'>('qwen');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending' as const,
      aiSuggestions: aiCategorization ? {
        folder: selectedFolder === 'auto' ? 'documents' : selectedFolder,
        tags: ['financial', 'document'],
        category: 'Business Document'
      } : undefined
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);
  }, [aiCategorization]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'text/*': ['.txt', '.csv']
    },
    maxFiles: 10
  });

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const startUpload = () => {
    uploadFiles.forEach(fileToUpload => {
      if (fileToUpload.status === 'pending') {
        // Create the actual file object
        const newFile: any = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: fileToUpload.file.name,
          type: fileToUpload.file.type,
          size: fileToUpload.file.size,
          folderId: selectedFolder === 'auto' ? 'root' : selectedFolder,
          uploadedBy: 'Current User',
          uploadedAt: new Date(),
          tags: fileToUpload.aiSuggestions?.tags || ['document'],
          aiStatus: 'processing' as const,
          aiEngine: selectedAiEngine,
          summary: selectedAiEngine === 'qwen' 
            ? `OCR and visual analysis completed for ${fileToUpload.file.name}. Document structure, text content, and visual elements have been extracted and analyzed using Qwen-VL's advanced vision capabilities.`
            : `AI-generated summary for ${fileToUpload.file.name}. This document has been processed and analyzed.`,
          ocrText: selectedAiEngine === 'qwen' 
            ? `Extracted text content from ${fileToUpload.file.name} using Qwen-VL OCR technology. The document contains structured information with clear formatting and readable text elements.`
            : undefined,
          extractedData: selectedAiEngine === 'qwen' 
            ? {
                textBlocks: ['Header section', 'Main content', 'Footer information'],
                detectedElements: ['Tables', 'Images', 'Text blocks'],
                confidence: 0.95
              }
            : undefined,
          category: selectedAiEngine === 'qwen' ? 'OCR Processed Document' : 'Standard Document'
        };
        
        setUploadFiles(prev => prev.map(f => 
          f.id === fileToUpload.id ? { ...f, status: 'uploading' } : f
        ));

        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadFiles(prev => prev.map(f => {
            if (f.id === fileToUpload.id) {
              const newProgress = Math.min(f.progress + 10, 100);
              const newStatus = newProgress === 100 ? 'processing' : 'uploading';
              return { ...f, progress: newProgress, status: newStatus };
            }
            return f;
          }));
        }, 200);

        // Simulate AI processing
        setTimeout(() => {
          clearInterval(interval);
          
          // Complete the file processing
          const completedFile = {
            ...newFile,
            aiStatus: 'completed' as const,
            summary: `AI-generated summary for ${newFile.name}. This document has been processed and analyzed.`
          };
          
          // Add to the actual files list
          uploadFile(completedFile);
          
          setUploadFiles(prev => prev.map(f => 
            f.id === fileToUpload.id ? { ...f, status: 'completed', progress: 100 } : f
          ));
        }, 3000);
      }
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-400" />;
    if (type.includes('word')) return <FileText className="w-8 h-8 text-blue-400" />;
    if (type.includes('image')) return <Image className="w-8 h-8 text-green-400" />;
    return <File className="w-8 h-8 text-gray-400" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'uploading': return 'default';
      case 'error': return 'danger';
      default: return 'secondary';
    }
  };

  const getAllFolders = () => {
    const allFolders: any[] = [];
    const addFoldersRecursively = (folderList: any[]) => {
      folderList.forEach(folder => {
        if (folder.id !== 'root') {
          allFolders.push(folder);
        }
        if (folder.children) {
          addFoldersRecursively(folder.children);
        }
      });
    };
    addFoldersRecursively(folders);
    return allFolders;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Upload Files</h1>
        <p className="text-gray-400">Upload and process your documents with AI</p>
      </div>

      {/* Upload Settings */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <h3 className="text-lg font-bold text-white">Upload Settings</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Destination Folder
              </label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
              >
                <option value="auto">Auto-categorize</option>
                {getAllFolders().map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                AI Engine
              </label>
              <select
                value={selectedAiEngine}
                onChange={(e) => setSelectedAiEngine(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
              >
                <option value="openai">OpenAI GPT-4</option>
                <option value="docintel">DocIntel AI</option>
                <option value="qwen">Qwen-VL (OCR + Vision)</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="aiCategorization"
                checked={aiCategorization}
                onChange={(e) => setAiCategorization(e.target.checked)}
                className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500"
              />
              <label htmlFor="aiCategorization" className="text-sm text-gray-300">
                Enable AI categorization
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-emerald-500 bg-emerald-500/10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </h3>
            <p className="text-gray-400 mb-4">
              or click to select files (PDF, DOC, DOCX, Images)
            </p>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {uploadFiles.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Files to Upload</h3>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={startUpload}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={uploadFiles.every(f => f.status !== 'pending')}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex-shrink-0">
                    {getFileIcon(uploadFile.file.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-white truncate">{uploadFile.file.name}</h4>
                      <Badge variant={getStatusColor(uploadFile.status)}>
                        {uploadFile.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>{uploadFile.file.type}</span>
                    </div>
                    
                    {uploadFile.status === 'uploading' && (
                      <Progress 
                        value={uploadFile.progress} 
                        max={100} 
                        className="mt-2"
                        variant="default"
                      />
                    )}
                    
                    {uploadFile.aiSuggestions && (
                      <div className="mt-2 flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-gray-300">
                          Suggested: {uploadFile.aiSuggestions.folder} • 
                          {uploadFile.aiSuggestions.tags.map(tag => `#${tag}`).join(' ')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => removeFile(uploadFile.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};