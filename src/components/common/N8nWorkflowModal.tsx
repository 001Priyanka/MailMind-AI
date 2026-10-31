import React, { useState } from 'react';
import { X, Copy, Check, Download, Workflow, ExternalLink, Zap, Terminal } from 'lucide-react';
import { sampleN8nWorkflowJson } from '../../services/mockData';

interface N8nWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const N8nWorkflowModal: React.FC<N8nWorkflowModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(sampleN8nWorkflowJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([sampleN8nWorkflowJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mailmind-ai-n8n-workflow.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">n8n Automation Blueprint</h3>
              <p className="text-xs text-slate-500">
                Autonomous Gmail analysis and automated email reports pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Architecture Visual */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-indigo-300">MailMind End-to-End Pipeline</span>
              <span className="font-mono">n8n v1.62+</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs text-center">
              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                <span className="block font-semibold text-slate-200">1. Gmail Trigger</span>
                <span className="text-[11px] text-slate-400">Polls unread mail</span>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-950/80 border border-indigo-700">
                <span className="block font-semibold text-indigo-300">2. Gemini Agent</span>
                <span className="text-[11px] text-slate-400">Extracts actions & category</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                <span className="block font-semibold text-slate-200">3. Dashboard Hook</span>
                <span className="text-[11px] text-slate-400">Updates live metrics</span>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-950/80 border border-purple-700">
                <span className="block font-semibold text-purple-300">4. Report Dispatch</span>
                <span className="text-[11px] text-slate-400">Daily 8 AM Gmail send</span>
              </div>
            </div>
          </div>

          {/* Quick Setup Instructions */}
          <div className="space-y-2 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              How to import into your n8n workspace:
            </h4>
            <ol className="list-decimal pl-4 space-y-1 leading-relaxed">
              <li>Open your self-hosted or n8n Cloud editor.</li>
              <li>Click the top-right three dots menu and choose <strong>Import from File</strong> or paste JSON.</li>
              <li>Connect your Google Workspace / Gmail OAuth credential node.</li>
              <li>Set the Webhook node destination to your MailMind instance URL.</li>
            </ol>
          </div>

          {/* Workflow JSON preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                <span>Workflow JSON Definition</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadJson}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .json</span>
                </button>
                <button
                  onClick={handleCopyJson}
                  className="px-2.5 py-1 text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre className="p-3 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono max-h-48 overflow-y-auto border border-slate-800 leading-snug">
              {sampleN8nWorkflowJson}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
