import React, { useState } from 'react';
import {
  X,
  Star,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Reply,
  ArrowUpRight,
  User,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { Email } from '../../services/types';
import { CategoryBadge, PriorityBadge } from './Badge';

interface EmailDetailModalProps {
  email: Email | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStar: (id: string) => void;
  onToggleRead: (id: string) => void;
  onToggleActionItem: (emailId: string, actionId: string) => void;
}

export const EmailDetailModal: React.FC<EmailDetailModalProps> = ({
  email,
  isOpen,
  onClose,
  onToggleStar,
  onToggleRead,
  onToggleActionItem,
}) => {
  const [copiedReplyIndex, setCopiedReplyIndex] = useState<number | null>(null);

  if (!isOpen || !email) return null;

  const handleCopyReply = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedReplyIndex(index);
    setTimeout(() => setCopiedReplyIndex(null), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={email.priority} />
              <CategoryBadge category={email.category} />
              <span className="text-xs text-slate-500 font-mono">
                {email.isRead ? 'Read' : 'Unread'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {email.subject}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleStar(email.id)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                email.isStarred
                  ? 'bg-amber-50 border-amber-200 text-amber-500'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title={email.isStarred ? 'Starred' : 'Star this email'}
            >
              <Star className={`w-4 h-4 ${email.isStarred ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={() => onToggleRead(email.id)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              {email.isRead ? 'Mark as Unread' : 'Mark as Read'}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Sender & Date Info */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                {email.sender.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{email.sender.name}</p>
                <p className="text-xs text-slate-500">{email.sender.email}</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              <div className="flex items-center gap-1 justify-end">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatDate(email.receivedDate)}</span>
              </div>
              <span className="text-indigo-600 font-medium">n8n Ingested</span>
            </div>
          </div>

          {/* AI Intelligence Spotlight Card */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/30 to-white rounded-xl border border-indigo-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-600 rounded-md text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-900">
                  MailMind AI Intelligence
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-indigo-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sentiment: {email.sentiment}</span>
              </div>
            </div>

            {/* AI Summary Prose */}
            <div className="text-sm text-slate-700 leading-relaxed bg-white/80 p-3.5 rounded-lg border border-indigo-100/60 shadow-2xs">
              <p className="font-medium text-slate-900 text-xs mb-1 uppercase tracking-wider text-indigo-600">
                Executive Synthesis:
              </p>
              {email.aiSummary}
            </div>

            {/* Action Items extracted */}
            {email.actionItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Extracted Action Items ({email.actionItems.filter(a => a.completed).length}/{email.actionItems.length} Done)
                </p>
                <div className="space-y-1.5">
                  {email.actionItems.map((action) => (
                    <div
                      key={action.id}
                      onClick={() => onToggleActionItem(email.id, action.id)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        action.completed
                          ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                          : 'bg-white border-slate-200/90 text-slate-800 hover:border-indigo-300'
                      }`}
                    >
                      <button className="mt-0.5 text-indigo-600 shrink-0">
                        {action.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <div className="flex-1">
                        <span>{action.text}</span>
                        {action.deadline && (
                          <span className="block mt-0.5 text-rose-600 font-medium text-[11px]">
                            Deadline: {action.deadline}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detected Meetings */}
            {email.detectedMeetings.length > 0 && (
              <div className="p-3 bg-white rounded-lg border border-purple-100 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-purple-700 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Detected Calendar Invitation / Meeting</span>
                </div>
                {email.detectedMeetings.map((meeting, idx) => (
                  <div key={idx} className="text-slate-700 pt-1">
                    <span className="font-semibold text-slate-900">{meeting.title}</span>
                    <span className="block text-slate-500 font-mono text-[11px]">{meeting.time}</span>
                    {meeting.location && (
                      <span className="block text-slate-400 text-[11px]">{meeting.location}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Raw Email Content */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Original Message Body
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-sm whitespace-pre-line leading-relaxed font-sans">
              {email.body}
            </div>
          </div>

          {/* Quick AI Reply Drafts */}
          {email.suggestedReplies.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <Reply className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Suggested Quick Responses</span>
              </div>
              <div className="space-y-2">
                {email.suggestedReplies.map((replyText, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors flex items-start justify-between gap-3 text-xs"
                  >
                    <p className="text-slate-700 flex-1 leading-normal italic">
                      "{replyText}"
                    </p>
                    <button
                      onClick={() => handleCopyReply(replyText, idx)}
                      className="px-2.5 py-1 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded font-medium inline-flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                    >
                      {copiedReplyIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Draft</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono">Email ID: {email.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
