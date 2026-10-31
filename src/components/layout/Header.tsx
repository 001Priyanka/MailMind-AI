import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Bell,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  X,
  ExternalLink,
  Sliders,
  Settings,
  User as UserIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { InsightItem, UserProfile } from '../../services/types';

interface HeaderProps {
  userProfile: UserProfile;
  insights: InsightItem[];
  isDemoMode: boolean;
  onToggleSidebar: () => void;
  onRefreshData: () => Promise<void>;
  onOpenEmailById: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  insights,
  isDemoMode,
  onToggleSidebar,
  onRefreshData,
  onOpenEmailById,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/emails?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const activeInsights = insights.filter((i) => !i.isResolved);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Welcome Message */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-2">
            <span>{getGreeting()}, {userProfile.name.split(' ')[0]}!</span>
            <span className="hidden sm:inline-block text-xs font-normal text-slate-500">
              Your inbox is triaged.
            </span>
          </h1>
          {isDemoMode && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Demo Mode (Sample Data) · Configure n8n in Settings</span>
            </div>
          )}
        </div>
      </div>

      {/* Center: Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search emails, senders, deadlines, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-12 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
          />
          <kbd className="hidden lg:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
            Enter
          </kbd>
        </div>
      </form>

      {/* Right Actions: Sync, Notifications, Profile Avatar */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Refresh / Sync inbox */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Sync & re-triage emails"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="AI Inbox Alerts"
          >
            <Bell className="w-4 h-4" />
            {activeInsights.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in duration-100">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">AI Insights & Alerts</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold font-mono">
                    {activeInsights.length}
                  </span>
                </div>
                <Link
                  to="/summaries"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  View All
                </Link>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {activeInsights.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                    No urgent alerts. All deadlines monitored.
                  </div>
                ) : (
                  activeInsights.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onOpenEmailById(item.sourceEmailId);
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-slate-50 transition-colors cursor-pointer text-xs space-y-1"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {item.dueDate || item.date}
                        </span>
                      </div>
                      <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed">
                        {item.description}
                      </p>
                      <div className="text-[10px] text-indigo-600 font-medium">
                        From: {item.sender} · Click to review email
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-1.5 pr-1 py-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
              referrerPolicy="no-referrer"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in duration-100 py-1">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{userProfile.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{userProfile.email}</p>
                <span className="inline-block mt-1 text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-medium">
                  {userProfile.role}
                </span>
              </div>

              <Link
                to="/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Profile</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Settings & n8n Config</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
