import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Megaphone,
  Video,
  ListTodo,
  TrendingUp,
  Share2,
  RefreshCw,
  Plus
} from 'lucide-react';
import { PriorityBadge } from '../components/common/Badge';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { mailMindApi } from '../services/api';
import { DailySummary } from '../services/types';

export const SummariesPage: React.FC = () => {
  const { onOpenGenerateSummary, onRefreshApp } = useOutletContext<any>();

  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [selectedSummaryId, setSelectedSummaryId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const fetchSummaries = async () => {
    setLoading(true);
    try {
      const res = await mailMindApi.getDailySummaries();
      setSummaries(res.summaries);
      if (res.summaries.length > 0 && !selectedSummaryId) {
        setSelectedSummaryId(res.summaries[0].id);
      }
    } catch (err) {
      console.error('Error fetching daily summaries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  const currentSummary = summaries.find((s) => s.id === selectedSummaryId) || summaries[0];

  const handleToggleTask = async (taskId: string) => {
    if (!currentSummary) return;
    await mailMindApi.toggleSummaryTask(currentSummary.id, taskId);
    setSummaries((prev) =>
      prev.map((s) => {
        if (s.id === currentSummary.id) {
          return {
            ...s,
            pendingTasks: s.pendingTasks.map((t) =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            ),
          };
        }
        return s;
      })
    );
  };

  const handleCopySummary = () => {
    if (!currentSummary) return;
    const text = `MailMind Daily Executive Briefing - ${currentSummary.formattedDate}\n\nOverview:\n${currentSummary.overview}\n\nKey Highlights:\n${currentSummary.highlights.map(h => `• ${h}`).join('\n')}\n\nPending Tasks:\n${currentSummary.pendingTasks.map(t => `• [${t.completed ? 'x' : ' '}] ${t.task} (${t.deadline})`).join('\n')}\n\nMeetings:\n${currentSummary.meetings.map(m => `• ${m.title} at ${m.time}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span>AI Daily Email Summaries</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Consolidated executive briefings generated automatically by the MailMind AI agent
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopySummary}
            disabled={!currentSummary}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
          <button
            onClick={onOpenGenerateSummary}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate New Summary</span>
          </button>
        </div>
      </div>

      {/* Date Filter Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Select Briefing Date:</span>
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {summaries.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSummaryId(s.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  (currentSummary && currentSummary.id === s.id)
                    ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.formattedDate}
              </button>
            ))}
          </div>
        </div>

        {currentSummary && (
          <span className="text-[11px] font-mono text-slate-400">
            {currentSummary.generatedAt}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : !currentSummary ? (
        <EmptyState
          title="No daily summaries found"
          description="Click the button below to generate your first AI inbox summary."
          actionText="Generate Summary Now"
          onAction={onOpenGenerateSummary}
        />
      ) : (
        <div className="space-y-6">
          {/* Executive Briefing Overview Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Executive Briefing
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {currentSummary.formattedDate}
                </h3>
              </div>

              {/* Metrics Pill strip */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                  <strong>{currentSummary.totalEmails}</strong> Emails Analyzed
                </span>
                <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-100">
                  <strong>{currentSummary.importantCount}</strong> High Priority
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <strong>{currentSummary.sentimentScore}%</strong> Productive Sentiment
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-sans">
              {currentSummary.overview}
            </p>
          </div>

          {/* Highlights & Tasks Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Important Email Highlights */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Important Email Highlights</span>
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  {currentSummary.highlights.length} key points
                </span>
              </div>

              <div className="space-y-2.5">
                {currentSummary.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50/70 hover:bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-800 leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 font-mono">
                      {idx + 1}
                    </span>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Tasks & Deadlines */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-emerald-600" />
                  <span>Pending Tasks & Deadlines Extracted</span>
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  {currentSummary.pendingTasks.filter((t) => t.completed).length}/
                  {currentSummary.pendingTasks.length} Done
                </span>
              </div>

              <div className="space-y-2">
                {currentSummary.pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                      task.completed
                        ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                        : 'bg-white border-slate-200/90 hover:border-indigo-300 text-slate-800 shadow-2xs'
                    }`}
                  >
                    <button className="mt-0.5 text-indigo-600 shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{task.task}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                        <span>From: {task.from}</span>
                        <span className="text-rose-600 font-semibold font-mono">
                          {task.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Meetings & Key Announcements Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Meeting Information */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span>Scheduled Meetings Detected</span>
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  {currentSummary.meetings.length} event{currentSummary.meetings.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-2">
                {currentSummary.meetings.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    No scheduled meetings detected in this briefing.
                  </p>
                ) : (
                  currentSummary.meetings.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{m.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                          {m.platform}
                        </span>
                      </div>
                      <p className="text-slate-500 font-mono text-[11px]">{m.time}</p>
                      <p className="text-slate-400 text-[10px]">Organizer: {m.organizer}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Key Announcements */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-purple-600" />
                  <span>Key Announcements & Broad Communications</span>
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  {currentSummary.keyAnnouncements.length} update{currentSummary.keyAnnouncements.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-2">
                {currentSummary.keyAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{ann.headline}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium">
                        {ann.department}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{ann.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
