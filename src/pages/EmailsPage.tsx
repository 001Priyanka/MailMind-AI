import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import {
  Mail,
  Search,
  Filter,
  Star,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Download,
  RotateCcw,
  Sparkles,
  Inbox
} from 'lucide-react';
import { PriorityBadge, CategoryBadge, StatusBadge } from '../components/common/Badge';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { mailMindApi } from '../services/api';
import { Email, EmailCategory, EmailPriority } from '../services/types';

interface EmailsPageProps {
  importantOnly?: boolean;
}

export const EmailsPage: React.FC<EmailsPageProps> = ({ importantOnly = false }) => {
  const { onOpenEmailModal } = useOutletContext<any>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<Email[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>(importantOnly ? 'High' : 'All');
  const [selectedFilterTab, setSelectedFilterTab] = useState<'all' | 'unread' | 'starred' | 'actionNeeded'>(
    importantOnly ? 'starred' : 'all'
  );

  const fetchEmailList = async () => {
    setLoading(true);
    try {
      const res = await mailMindApi.getEmails({
        category: selectedCategory,
        priority: selectedPriority,
        search: searchQuery,
        importantOnly,
      });
      setEmails(res.emails);
    } catch (err) {
      console.error('Error fetching email list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailList();
  }, [selectedCategory, selectedPriority, importantOnly]);

  // Sync search query from URL parameter if present
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEmailList();
  };

  const handleToggleStar = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await mailMindApi.toggleStar(id);
    setEmails((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item))
    );
  };

  const handleToggleRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await mailMindApi.toggleRead(id);
    setEmails((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: !item.isRead } : item))
    );
  };

  const handleMarkAllRead = async () => {
    await mailMindApi.markAllRead();
    fetchEmailList();
  };

  // Filter based on client filter tab
  const displayedEmails = emails.filter((email) => {
    if (selectedFilterTab === 'unread') return !email.isRead;
    if (selectedFilterTab === 'starred') return email.isStarred;
    if (selectedFilterTab === 'actionNeeded') return email.status === 'Action Required' || email.actionItems.some(a => !a.completed);
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Sender Name', 'Sender Email', 'Subject', 'Category', 'Priority', 'Date', 'Status', 'AI Summary'];
    const rows = displayedEmails.map((e) => [
      e.id,
      `"${e.sender.name.replace(/"/g, '""')}"`,
      e.sender.email,
      `"${e.subject.replace(/"/g, '""')}"`,
      e.category,
      e.priority,
      e.receivedDate,
      e.status,
      `"${e.aiSummary.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mailmind-emails-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {importantOnly ? (
              <>
                <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
                <span>Important Emails & Action Triggers</span>
              </>
            ) : (
              <>
                <Mail className="w-6 h-6 text-indigo-600" />
                <span>All Analyzed Emails</span>
              </>
            )}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {importantOnly
              ? 'High-priority messages requiring executive review, approval, or deadline response'
              : 'Complete repository of incoming Gmail threads processed by MailMind AI Agent'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Mark All Read</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3.5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by subject, sender name, keywords, or action items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-indigo-600 text-white rounded text-[11px] font-semibold hover:bg-indigo-700 cursor-pointer"
            >
              Filter
            </button>
          </form>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium shrink-0 overflow-x-auto">
            {[
              { id: 'all', label: 'All Messages' },
              { id: 'unread', label: 'Unread' },
              { id: 'starred', label: 'Starred' },
              { id: 'actionNeeded', label: 'Action Required' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilterTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  selectedFilterTab === tab.id
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Priority Selectors */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700 text-xs focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Important">Important</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Promotional">Promotional</option>
              <option value="Finance">Finance</option>
              <option value="Updates">Updates</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700 text-xs focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {(selectedCategory !== 'All' || selectedPriority !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedPriority('All');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="text-slate-400 hover:text-rose-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          )}

          <div className="ml-auto text-[11px] font-mono text-slate-400">
            Showing {displayedEmails.length} of {emails.length} emails
          </div>
        </div>
      </div>

      {/* Emails Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={6} />
          </div>
        ) : displayedEmails.length === 0 ? (
          <div className="p-12">
            <EmptyState
              title="No emails match your selection"
              description="Try adjusting your search criteria, category filters, or reset the filters to see all analyzed emails."
              actionText="Reset All Filters"
              onAction={() => {
                setSelectedCategory('All');
                setSelectedPriority('All');
                setSelectedFilterTab('all');
                setSearchQuery('');
                setSearchParams({});
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 w-10 text-center">★</th>
                  <th className="py-3 px-4 font-semibold">Sender</th>
                  <th className="py-3 px-4 font-semibold">Subject & AI Summary</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Priority</th>
                  <th className="py-3 px-4 font-semibold">Received</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedEmails.map((email) => (
                  <tr
                    key={email.id}
                    onClick={() => onOpenEmailModal(email)}
                    className={`hover:bg-slate-50/90 transition-colors cursor-pointer ${
                      !email.isRead ? 'bg-indigo-50/20 font-medium' : ''
                    }`}
                  >
                    {/* Star */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => handleToggleStar(e, email.id)}
                        className="text-slate-300 hover:text-amber-500 cursor-pointer transition-colors"
                        title={email.isStarred ? 'Starred' : 'Star'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            email.isStarred ? 'fill-amber-400 text-amber-500' : ''
                          }`}
                        />
                      </button>
                    </td>

                    {/* Sender */}
                    <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {email.sender.name.charAt(0)}
                        </div>
                        <div>
                          <p className="truncate max-w-[130px] font-semibold">{email.sender.name}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[130px]">
                            {email.sender.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Subject + Summary */}
                    <td className="py-3.5 px-4 max-w-sm md:max-w-md">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-semibold text-slate-900">{email.subject}</span>
                        {email.actionItems.length > 0 && (
                          <span className="shrink-0 text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/50">
                            {email.actionItems.length} action{email.actionItems.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <div className="truncate text-slate-500 text-[11px] font-normal mt-0.5">
                        <span className="text-indigo-600 font-medium mr-1">AI:</span>
                        {email.aiSummary}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <CategoryBadge category={email.category} />
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={email.priority} />
                    </td>

                    {/* Received */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(email.receivedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={email.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => handleToggleRead(e, email.id)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100"
                        >
                          {email.isRead ? 'Unread' : 'Read'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEmailModal(email);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="View complete analysis"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
