import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FileBarChart2,
  Plus,
  Download,
  Copy,
  Check,
  Eye,
  Trash2,
  Calendar,
  Send,
  FileText,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { mailMindApi } from '../services/api';
import { Report } from '../services/types';

export const ReportsPage: React.FC = () => {
  const { onOpenTriggerReport } = useOutletContext<any>();

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await mailMindApi.getReports();
      setReports(res.reports);
      if (res.reports.length > 0 && !selectedReport) {
        setSelectedReport(res.reports[0]);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCopyMarkdown = (report: Report) => {
    navigator.clipboard.writeText(report.contentMarkdown);
    setCopiedId(report.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadReport = (report: Report) => {
    const blob = new Blob([report.contentMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteReport = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this generated report?')) {
      await mailMindApi.deleteReport(id);
      const updated = reports.filter((r) => r.id !== id);
      setReports(updated);
      if (selectedReport?.id === id) {
        setSelectedReport(updated[0] || null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileBarChart2 className="w-6 h-6 text-indigo-600" />
            <span>Executive Reports & Digests</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Consolidated intelligence reports generated and dispatched via automated workflows
          </p>
        </div>

        <button
          onClick={onOpenTriggerReport}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Trigger New Report</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="No reports generated yet"
          description="Reports are created daily at 8:00 AM or can be triggered on-demand anytime."
          actionText="Generate First Report"
          onAction={onOpenTriggerReport}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Report List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                All Reports ({reports.length})
              </span>
              <span className="text-[11px] font-mono text-slate-400">n8n Cron Managed</span>
            </div>

            <div className="space-y-2.5">
              {reports.map((report) => {
                const isSelected = selectedReport?.id === report.id;
                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-2.5 ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 shadow-2xs ring-1 ring-indigo-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                          {report.type}
                        </span>
                        <h4 className="font-bold text-slate-900 truncate text-sm">
                          {report.title}
                        </h4>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                          report.status === 'Sent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : report.status === 'Ready'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <p className="text-slate-600 line-clamp-2 leading-relaxed text-[11px]">
                      {report.summary}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{new Date(report.generatedDate).toLocaleDateString()}</span>
                      <span>{report.emailCount} emails · {report.fileSize}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Report Viewer & Inspector */}
          <div className="lg:col-span-7">
            {selectedReport ? (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 sticky top-20">
                {/* Viewer Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {selectedReport.type}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {new Date(selectedReport.generatedDate).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 truncate">
                      {selectedReport.title}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyMarkdown(selectedReport)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
                      title="Copy raw markdown"
                    >
                      {copiedId === selectedReport.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDownloadReport(selectedReport)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .md</span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteReport(e, selectedReport.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metadata strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 bg-slate-50 rounded-lg border border-slate-100 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Recipient</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {selectedReport.recipient}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Delivery Status</span>
                    <span className="font-semibold text-emerald-700 block">
                      {selectedReport.status} (Email)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Synthesized</span>
                    <span className="font-semibold text-slate-800 block">
                      {selectedReport.emailCount} Emails
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Payload Size</span>
                    <span className="font-semibold text-slate-800 block">
                      {selectedReport.fileSize}
                    </span>
                  </div>
                </div>

                {/* Rendered Report Content */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Compiled Report Document
                  </span>
                  <div className="p-5 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto">
                    {selectedReport.contentMarkdown}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                Select a report from the list to preview details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
