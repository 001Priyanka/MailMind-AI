import React, { useState } from 'react';
import { X, Send, FileBarChart2, Loader2, CheckCircle2, Shield } from 'lucide-react';
import { Report } from '../../services/types';

interface TriggerReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRecipient: string;
  onTrigger: (config: {
    title?: string;
    type: 'Daily Digest' | 'Weekly Executive Brief' | 'Inbox Audit' | 'Monthly Review';
    recipient: string;
    sections: {
      actionItems: boolean;
      calendarEvents: boolean;
      sentimentBreakdown: boolean;
      fullSummaries: boolean;
    };
  }) => Promise<Report>;
  onSuccess: (report: Report) => void;
}

export const TriggerReportModal: React.FC<TriggerReportModalProps> = ({
  isOpen,
  onClose,
  defaultRecipient,
  onTrigger,
  onSuccess,
}) => {
  const [reportType, setReportType] = useState<'Daily Digest' | 'Weekly Executive Brief' | 'Inbox Audit' | 'Monthly Review'>('Daily Digest');
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [customTitle, setCustomTitle] = useState('');
  const [sections, setSections] = useState({
    actionItems: true,
    calendarEvents: true,
    sentimentBreakdown: true,
    fullSummaries: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReport, setCreatedReport] = useState<Report | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const rep = await onTrigger({
        title: customTitle.trim() || undefined,
        type: reportType,
        recipient,
        sections,
      });
      setCreatedReport(rep);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (createdReport) {
      onSuccess(createdReport);
    }
    handleClose();
  };

  const handleClose = () => {
    setIsSubmitting(false);
    setCreatedReport(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileBarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Generate Consolidated Report</h3>
              <p className="text-xs text-slate-500">Dispatch an executive email briefing via n8n automation</p>
            </div>
          </div>
          {!isSubmitting && (
            <button
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        {!createdReport ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              >
                <option value="Daily Digest">Daily Digest (Current 24 Hours)</option>
                <option value="Weekly Executive Brief">Weekly Executive Brief (7 Days)</option>
                <option value="Inbox Audit">Project & Infrastructure Inbox Audit</option>
                <option value="Monthly Review">Monthly Executive Review</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Custom Title (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Q4 Executive Budget Briefing"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Delivery Recipient Email
              </label>
              <input
                type="email"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                Sections to Include
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'actionItems', label: 'Action Items & Deadlines' },
                  { key: 'calendarEvents', label: 'Detected Meetings' },
                  { key: 'sentimentBreakdown', label: 'Priority & Sentiment' },
                  { key: 'fullSummaries', label: 'Full Email Syntheses' },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={sections[key as keyof typeof sections]}
                      onChange={(e) =>
                        setSections({ ...sections, [key]: e.target.checked })
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className="text-slate-700 font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Report will be compiled and formatted in clean Markdown/HTML, sent directly to {recipient}.
              </span>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling via n8n...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Generate & Send Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Report Dispatched!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Generated <strong>{createdReport.title}</strong> and queued delivery to{' '}
                <span className="font-mono text-slate-700">{createdReport.recipient}</span>.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs font-mono text-slate-700 space-y-1">
              <div>Status: Sent (HTTP 200 OK)</div>
              <div>Digest Size: {createdReport.fileSize}</div>
              <div>Emails Synthesized: {createdReport.emailCount}</div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={handleFinish}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                View in Reports List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
