import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Shield,
  User,
  Mail,
  Calendar,
  MoreHorizontal
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer' | 'uploader' | 'approver';
  status: 'active' | 'inactive' | 'suspended';
  lastActive: Date;
  joinedAt: Date;
  avatar?: string;
}

export const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Robert Edwards',
      email: 'robert.edwards@docintel.com',
      role: 'admin',
      status: 'active',
      lastActive: new Date('2024-01-15T10:30:00'),
      joinedAt: new Date('2023-01-15'),
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@docintel.com',
      role: 'uploader',
      status: 'active',
      lastActive: new Date('2024-01-14T16:20:00'),
      joinedAt: new Date('2023-03-20'),
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@docintel.com',
      role: 'viewer',
      status: 'active',
      lastActive: new Date('2024-01-13T14:15:00'),
      joinedAt: new Date('2023-06-10'),
      avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
    },
    {
      id: '4',
      name: 'Sarah Davis',
      email: 'sarah.davis@docintel.com',
      role: 'approver',
      status: 'inactive',
      lastActive: new Date('2024-01-10T09:45:00'),
      joinedAt: new Date('2023-09-05'),
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'approver': return 'warning';
      case 'uploader': return 'success';
      case 'viewer': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'suspended': return 'danger';
      default: return 'secondary';
    }
  };

  const roleStats = [
    { role: 'admin', count: users.filter(u => u.role === 'admin').length, color: 'text-red-400' },
    { role: 'approver', count: users.filter(u => u.role === 'approver').length, color: 'text-yellow-400' },
    { role: 'uploader', count: users.filter(u => u.role === 'uploader').length, color: 'text-green-400' },
    { role: 'viewer', count: users.filter(u => u.role === 'viewer').length, color: 'text-gray-400' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users & Roles</h1>
          <p className="text-gray-400">Manage user access and permissions</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {roleStats.map((stat) => (
          <Card key={stat.role} className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 capitalize">{stat.role}s</p>
                  <p className="text-2xl font-bold text-white">{stat.count}</p>
                </div>
                <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center">
                  <Shield className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="approver">Approver</option>
          <option value="uploader">Uploader</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      {/* Users Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Team Members</h3>
              <p className="text-sm text-gray-400">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Last Active</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant={getRoleColor(user.role)} className="capitalize">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge variant={getStatusColor(user.status)} className="capitalize">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-gray-300">
                      {user.lastActive.toLocaleDateString()}
                    </td>
                    <td className="py-4 text-gray-300">
                      {user.joinedAt.toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};