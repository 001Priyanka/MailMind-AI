import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Mail,
  Star,
  Inbox,
  FileBarChart2,
  Sparkles,
  Clock,
  Calendar,
  AlertCircle,
  Megaphone,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Filter,
  Check,
  Workflow
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { ActivityChart } from '../components/charts/ActivityChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { PriorityBadge, CategoryBadge, StatusBadge } from '../components/common/Badge';
import { TableSkeleton, CardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { mailMindApi } from '../services/api';
import { AnalyticsData, Email, InsightItem } from '../services/types';

export const DashboardPage: React.FC = () => {
  const { onOpenEmailModal, onOpenGenerateSummary, onOpenTriggerReport, onOpenN8nModal } =
    useOutletContext<any>();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentEmails, setRecentEmails] = useState<Email[]>([]);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>('All');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsData, emailRes, insightData] = await Promise.all([
        mailMindApi.getAnalytics(),
        mailMindApi.getEmails(),
        mailMindApi.getInsights(),
      ]);
      setAnalytics(analyticsData);
      setRecentEmails(emailRes.emails);
      setInsights(insightData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleResolveInsight = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await mailMindApi.resolveInsight(id);
    const updated = await mailMindApi.getInsights();
    setInsights(updated);
  };

  const handleToggleStar = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await mailMindApi.toggleStar(id);
    setRecentEmails((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item))
    );
  };

  const filteredRecentEmails = recentEmails.filter((em) => {
    if (filterPriority === 'All') return true;
    return em.priority.toLowerCase() === filterPriority.toLowerCase();
  });

  const getInsightIcon = (type: InsightItem['type']) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-4 h-4 text-rose-600" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      case 'urgent':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'announcement':
      default:
        return <Megaphone className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Quick Action Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>n8n Autonomous Email Intelligence</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Executive Inbox Overview & Activity Insights
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            MailMind scans incoming emails, flags priority deadlines, extracts action items, and prepares consolidated briefings on schedule.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenGenerateSummary}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-xs whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Generate AI Summary</span>
          </button>
          <button
            onClick={onOpenTriggerReport}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-xs whitespace-nowrap"
          >
            <FileBarChart2 className="w-3.5 h-3.5" />
            <span>Trigger Report</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      {loading || !analytics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Emails Analyzed"
            value={analytics.stats.totalEmailsAnalyzed.toLocaleString()}
            change="+12.4% vs last week"
            changeType="positive"
            description="All inbox threads"
            icon={Mail}
            iconBgColor="bg-indigo-50"
            iconTextColor="text-indigo-600"
          />
          <StatCard
            title="Important Emails"
            value={analytics.stats.importantEmails}
            change="4.5% of total volume"
            changeType="neutral"
            description="High action required"
            icon={Star}
            iconBgColor="bg-amber-50"
            iconTextColor="text-amber-600"
          />
          <StatCard
            title="Unread Emails"
            value={analytics.stats.unreadEmails}
            change={analytics.stats.unreadEmails > 0 ? `${analytics.stats.unreadEmails} awaiting review` : 'All cleared'}
            changeType={analytics.stats.unreadEmails > 10 ? 'negative' : 'positive'}
            description="Triaged by AI"
            icon={Inbox}
            iconBgColor="bg-blue-50"
            iconTextColor="text-blue-600"
          />
          <StatCard
            title="Reports Generated"
            value={analytics.stats.reportsGenerated}
            change="Scheduled daily at 8 AM"
            changeType="positive"
            description="Executive summaries"
            icon={FileBarChart2}
            iconBgColor="bg-purple-50"
            iconTextColor="text-purple-600"
          />
        </div>
      )}

      {/* Meaningful Performance Stats Strip */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Estimated Time Saved This Week</p>
              <p className="text-slate-500 font-mono">
                <span className="font-bold text-slate-900 text-sm">~{analytics.stats.timeSavedHours} hrs</span> triage time saved
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Average AI Processing Speed</p>
              <p className="text-slate-500 font-mono">
                <span className="font-bold text-slate-900 text-sm">{analytics.stats.averageLatencyMs}ms</span> latency per email
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Classification Accuracy Rate</p>
              <p className="text-slate-500 font-mono">
                <span className="font-bold text-slate-900 text-sm">{analytics.stats.accuracyRate}%</span> confirmed precision
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Email Analytics Section (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Bar Chart (7-day trend) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Email Activity (Last 7 Days)</h3>
              <p className="text-xs text-slate-500">Volume received, AI analyzed, and flagged as important</p>
            </div>
            <span className="text-[11px] font-mono font-medium text-slate-400">
              Oct 24 – Oct 30
            </span>
          </div>

          {analytics ? (
            <ActivityChart data={analytics.activity7Days} />
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              Loading activity metrics...
            </div>
          )}
        </div>

        {/* Category Donut / Pie Chart */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Email Categories</h3>
              <p className="text-xs text-slate-500">Classification distribution across inbox</p>
            </div>
            <Link to="/emails" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              View All
            </Link>
          </div>

          {analytics ? (
            <CategoryPieChart data={analytics.categoryDistribution} />
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              Loading category breakdown...
            </div>
          )}
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI-Generated Insights & Action Triggers</span>
            </h3>
            <p className="text-xs text-slate-500">
              Important deadlines, meeting invitations, and urgent action items extracted by MailMind
            </p>
          </div>
          <Link
            to="/summaries"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Full Daily Digest</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenEmailModal(recentEmails.find((e) => e.id === item.sourceEmailId) || recentEmails[0])}
              className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                item.isResolved
                  ? 'bg-slate-50/70 border-slate-200 opacity-60'
                  : item.urgency === 'critical'
                  ? 'bg-white border-rose-200/80 hover:border-rose-300 shadow-2xs'
                  : 'bg-white border-slate-200/90 hover:border-indigo-300 shadow-2xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {getInsightIcon(item.type)}
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {item.type}
                    </span>
                  </div>
                  {item.dueDate && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.dueDate}
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 truncate max-w-[120px]">From: {item.sender}</span>
                <button
                  onClick={(e) => handleResolveInsight(e, item.id)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    item.isResolved
                      ? 'bg-slate-200 text-slate-700'
                      : 'text-indigo-600 hover:bg-indigo-50'
                  }`}
                  title={item.isResolved ? 'Mark active' : 'Mark resolved'}
                >
                  <Check className="w-3 h-3" />
                  <span>{item.isResolved ? 'Resolved' : 'Dismiss'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Emails Section (Table) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header & Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Recent Triaged Emails</h3>
            <p className="text-xs text-slate-500">Inbound mail analyzed and prioritized by MailMind</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Priority Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
              {['All', 'High', 'Medium', 'Low'].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    filterPriority === p
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <Link
              to="/emails"
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              View All ({recentEmails.length})
            </Link>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={4} />
          </div>
        ) : filteredRecentEmails.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No emails match filter"
              description="No recent emails found with the selected priority filter."
              actionText="Reset Filter"
              onAction={() => setFilterPriority('All')}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 w-10 text-center">★</th>
                  <th className="py-3 px-4 font-semibold">Sender</th>
                  <th className="py-3 px-4 font-semibold">Email Subject & Snippet</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Priority</th>
                  <th className="py-3 px-4 font-semibold">Received</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecentEmails.slice(0, 6).map((email) => (
                  <tr
                    key={email.id}
                    onClick={() => onOpenEmailModal(email)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      !email.isRead ? 'bg-indigo-50/20 font-medium' : ''
                    }`}
                  >
                    {/* Star */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => handleToggleStar(e, email.id)}
                        className="text-slate-300 hover:text-amber-500 cursor-pointer transition-colors"
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
                        <span className="truncate max-w-[140px]">{email.sender.name}</span>
                      </div>
                    </td>

                    {/* Subject + Snippet */}
                    <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                      <div className="truncate font-semibold text-slate-900">{email.subject}</div>
                      <div className="truncate text-slate-500 text-[11px] font-normal">{email.snippet}</div>
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

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEmailModal(email);
                        }}
                        className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                        title="View AI analysis"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
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
