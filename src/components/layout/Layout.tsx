import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { EmailDetailModal } from '../common/EmailDetailModal';
import { N8nWorkflowModal } from '../common/N8nWorkflowModal';
import { GenerateSummaryModal } from '../common/GenerateSummaryModal';
import { TriggerReportModal } from '../common/TriggerReportModal';
import { mailMindApi } from '../../services/api';
import { AppSettings, DailySummary, Email, InsightItem, Report, UserProfile } from '../../services/types';
import { initialSettings, initialUserProfile } from '../../services/mockData';

export const Layout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  
  // Modals state
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isN8nModalOpen, setIsN8nModalOpen] = useState(false);
  const [isGenerateSummaryOpen, setIsGenerateSummaryOpen] = useState(false);
  const [isTriggerReportOpen, setIsTriggerReportOpen] = useState(false);

  // Load shared settings & user profile
  const refreshAppData = async () => {
    try {
      const [prof, sett, ins] = await Promise.all([
        mailMindApi.getUserProfile(),
        mailMindApi.getSettings(),
        mailMindApi.getInsights(),
      ]);
      setUserProfile(prof);
      setSettings(sett);
      setInsights(ins);
    } catch (err) {
      console.error('Error refreshing app layout data:', err);
    }
  };

  useEffect(() => {
    refreshAppData();
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleOpenEmailById = async (id: string) => {
    const email = await mailMindApi.getEmailById(id);
    if (email) {
      setSelectedEmail(email);
      setIsEmailModalOpen(true);
      // Auto mark read if unread
      if (!email.isRead) {
        await mailMindApi.toggleRead(id);
        refreshAppData();
      }
    }
  };

  const handleToggleStar = async (id: string) => {
    await mailMindApi.toggleStar(id);
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail({ ...selectedEmail, isStarred: !selectedEmail.isStarred });
    }
    refreshAppData();
  };

  const handleToggleRead = async (id: string) => {
    await mailMindApi.toggleRead(id);
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail({ ...selectedEmail, isRead: !selectedEmail.isRead });
    }
    refreshAppData();
  };

  const handleToggleActionItem = async (emailId: string, actionId: string) => {
    await mailMindApi.toggleActionItem(emailId, actionId);
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail({
        ...selectedEmail,
        actionItems: selectedEmail.actionItems.map((a) =>
          a.id === actionId ? { ...a, completed: !a.completed } : a
        ),
      });
    }
    refreshAppData();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        userProfile={userProfile}
        n8nConnected={settings.n8nConnected}
        isDemoMode={settings.isDemoMode}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenN8nModal={() => setIsN8nModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <Header
          userProfile={userProfile}
          insights={insights}
          isDemoMode={settings.isDemoMode}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onRefreshData={refreshAppData}
          onOpenEmailById={handleOpenEmailById}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet
            context={{
              userProfile,
              settings,
              onRefreshApp: refreshAppData,
              onOpenEmailModal: (email: Email) => {
                setSelectedEmail(email);
                setIsEmailModalOpen(true);
              },
              onOpenEmailById: handleOpenEmailById,
              onOpenGenerateSummary: () => setIsGenerateSummaryOpen(true),
              onOpenTriggerReport: () => setIsTriggerReportOpen(true),
              onOpenN8nModal: () => setIsN8nModalOpen(true),
            }}
          />
        </main>
      </div>

      {/* Global Modals */}
      <EmailDetailModal
        email={selectedEmail}
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setSelectedEmail(null);
        }}
        onToggleStar={handleToggleStar}
        onToggleRead={handleToggleRead}
        onToggleActionItem={handleToggleActionItem}
      />

      <N8nWorkflowModal
        isOpen={isN8nModalOpen}
        onClose={() => setIsN8nModalOpen(false)}
      />

      <GenerateSummaryModal
        isOpen={isGenerateSummaryOpen}
        onClose={() => setIsGenerateSummaryOpen(false)}
        onGenerate={(date) => mailMindApi.triggerGenerateSummary(date)}
        onSuccess={(summary) => {
          refreshAppData();
        }}
      />

      <TriggerReportModal
        isOpen={isTriggerReportOpen}
        onClose={() => setIsTriggerReportOpen(false)}
        defaultRecipient={settings.reportRecipient || userProfile.email}
        onTrigger={(config) => mailMindApi.triggerReportGeneration(config)}
        onSuccess={(report) => {
          refreshAppData();
        }}
      />
    </div>
  );
};
