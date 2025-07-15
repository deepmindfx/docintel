import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FileDetailPage } from '../../pages/FileDetailPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { FilesPage } from '../../pages/FilesPage';
import { UploadPage } from '../../pages/UploadPage';
import { ChatPage } from '../../pages/ChatPage';
import { ApprovalsPage } from '../../pages/ApprovalsPage';
import { UsersPage } from '../../pages/UsersPage';
import { AnalyticsPage } from '../../pages/AnalyticsPage';
import { AutomationsPage } from '../../pages/AutomationsPage';
import { BillingPage } from '../../pages/BillingPage';
import { SettingsPage } from '../../pages/SettingsPage';

interface PageState {
  name: string;
  params?: Record<string, any>;
}

export const MainLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>({ name: 'dashboard' });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderCurrentPage = () => {
    switch (currentPage.name) {
      case 'dashboard':
        return <DashboardPage />;
      case 'files':
        return <FilesPage onNavigateToFile={(fileId) => setCurrentPage({ name: 'file-detail', params: { fileId } })} />;
      case 'file-detail':
        return (
          <FileDetailPage 
            fileId={currentPage.params?.fileId} 
            onNavigateBack={() => setCurrentPage({ name: 'files' })}
          />
        );
      case 'upload':
        return <UploadPage />;
      case 'chat':
        return <ChatPage />;
      case 'approvals':
        return <ApprovalsPage />;
      case 'users':
        return <UsersPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'automations':
        return <AutomationsPage />;
      case 'billing':
        return <BillingPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage.name) {
      case 'dashboard':
        return 'Dashboard';
      case 'files':
        return 'Files';
      case 'file-detail':
        return 'File Details';
      case 'upload':
        return 'Upload';
      case 'chat':
        return 'Chat';
      case 'approvals':
        return 'Approvals';
      case 'users':
        return 'Users';
      case 'analytics':
        return 'Analytics';
      case 'automations':
        return 'Automations';
      case 'billing':
        return 'Billing';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar
        currentPage={currentPage.name}
        onPageChange={(page) => setCurrentPage({ name: page })}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col">
        <Header
          title={getPageTitle()}
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="flex-1 overflow-auto">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};