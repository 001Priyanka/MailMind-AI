import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Mail,
  Star,
  Sparkles,
  FileBarChart2,
  Settings,
  User,
  Workflow,
  X,
  Bot,
  ExternalLink
} from 'lucide-react';
import { UserProfile } from '../../services/types';

interface SidebarProps {
  userProfile: UserProfile;
  n8nConnected: boolean;
  isDemoMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpenN8nModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userProfile,
  n8nConnected,
  isDemoMode,
  isOpen,
  onClose,
  onOpenN8nModal,
}) => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/emails', label: 'All Emails', icon: Mail },
    { to: '/important', label: 'Important Emails', icon: Star },
    { to: '/summaries', label: 'AI Summaries', icon: Sparkles },
    { to: '/reports', label: 'Reports', icon: FileBarChart2 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Area */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs group-hover:shadow-md transition-shadow">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-base tracking-tight">MailMind</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Intelligent Assistant</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-4 flex-1 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* n8n Automation Pipeline Status Box */}
        <div className="p-3 mx-3 mb-3 bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Workflow className="w-3.5 h-3.5 text-indigo-600" />
              <span>n8n Pipeline</span>
            </span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                n8nConnected
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {n8nConnected ? 'Connected' : isDemoMode ? 'Demo Mode' : 'Not Connected'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
            Automating Gmail classification & morning executive briefings.
          </p>
          <button
            onClick={onOpenN8nModal}
            className="mt-2.5 w-full py-1.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-indigo-600 flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <span>View Workflow Blueprint</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg transition-colors group ${
                isActive ? 'bg-indigo-50' : 'hover:bg-slate-100'
              }`
            }
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                {userProfile.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{userProfile.email}</p>
            </div>
            <User className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
          </NavLink>
        </div>
      </aside>
    </>
  );
};
