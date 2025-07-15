import React, { useState } from 'react';
import { useData } from '../contexts/DataProvider';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { 
  Search, 
  Filter, 
  Download, 
  MessageCircle, 
  Trash2, 
  Eye,
  FolderOpen,
  File,
  Plus,
  MoreHorizontal,
  Upload
} from 'lucide-react';
import { formatFileSize, formatDate } from '../lib/utils';

interface FilesPageProps {
  onNavigateToFile: (fileId: string) => void;
}

export const FilesPage: React.FC<FilesPageProps> = ({ onNavigateToFile }) => {
  const { files, folders, createFolder } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFolder = !selectedFolder || file.folderId === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'danger';
      default: return 'secondary';
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('image')) return '🖼️';
    if (type.includes('excel')) return '📊';
    return '📄';
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim(), selectedFolder || 'root');
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const getAllFolders = () => {
    return folders.filter(folder => folder.id !== 'root');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Files</h1>
          <p className="text-gray-400">Manage your documents and files</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => setShowCreateFolder(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md mx-4">
            <CardHeader>
              <h3 className="text-lg font-bold text-white">Create New Folder</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                autoFocus
              />
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleCreateFolder}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={!newFolderName.trim()}
                >
                  Create
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName('');
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Folder Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto">
        <button
          onClick={() => setSelectedFolder(null)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
            !selectedFolder 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>All Files</span>
        </button>
        
        {getAllFolders().map((folder) => (
          <button
            key={folder.id}
            onClick={() => setSelectedFolder(folder.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              selectedFolder === folder.id 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>{folder.name}</span>
          </button>
        ))}
      </div>

      {/* Files Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Documents</h3>
              <p className="text-sm text-gray-400">
                {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''} found
                {filteredFiles.length === 0 && files.length === 0 && (
                  <span className="block mt-1 text-gray-500">No files uploaded yet. Start by uploading some documents!</span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {filteredFiles.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Size</th>
                    <th className="pb-3 font-medium">Uploaded By</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                      <td className="py-4">
                        <div 
                          className="flex items-center space-x-3 cursor-pointer"
                          onClick={() => onNavigateToFile(file.id)}
                        >
                          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                            <span className="text-lg">{getFileIcon(file.type)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-white">{file.name}</div>
                            <div className="text-sm text-gray-400">
                              {file.tags.map(tag => `#${tag}`).join(' ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-300">{formatFileSize(file.size)}</td>
                      <td className="py-4 text-gray-300">{file.uploadedBy}</td>
                      <td className="py-4 text-gray-300">{formatDate(file.uploadedAt)}</td>
                      <td className="py-4">
                        <Badge variant={getStatusColor(file.aiStatus)}>
                          {file.aiStatus}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => onNavigateToFile(file.id)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-xl font-bold text-white mb-2">No files found</h3>
                <p className="text-gray-400 mb-4">
                  {files.length === 0 
                    ? "Start by uploading your first document to get started with DocIntel."
                    : "No files match your current search or folder selection."
                  }
                </p>
                {files.length === 0 && (
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Your First File
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};