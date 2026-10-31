import React, { useState } from 'react';
import { X, Sparkles, Loader2, CheckCircle2, Calendar, FileText, ArrowRight } from 'lucide-react';
import { DailySummary } from '../../services/types';

interface GenerateSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (date: string) => Promise<DailySummary>;
  onSuccess: (summary: DailySummary) => void;
}

export const GenerateSummaryModal: React.FC<GenerateSummaryModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  onSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [generatedResult, setGeneratedResult] = useState<DailySummary | null>(null);

  if (!isOpen) return null;

  const steps = [
    'Connecting to n8n email pipeline...',
    'Fetching unread & priority Gmail threads...',
    'Synthesizing email context & extracting action items...',
    'Finalizing executive briefing summary...',
  ];

  const handleStartGeneration = async () => {
    setIsProcessing(true);
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 400);

    try {
      const summary = await onGenerate(selectedDate);
      clearInterval(stepInterval);
      setCurrentStep(steps.length);
      setGeneratedResult(summary);
    } catch (err) {
      clearInterval(stepInterval);
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    if (generatedResult) {
      onSuccess(generatedResult);
    }
    handleClose();
  };

  const handleClose = () => {
    setIsProcessing(false);
    setCurrentStep(0);
    setGeneratedResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Generate AI Summary</h3>
              <p className="text-xs text-slate-500">Synthesize inbox threads into an executive brief</p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!isProcessing && !generatedResult && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Target Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Workflow Execution Details</span>
                </div>
                <p className="text-indigo-700/90 leading-relaxed">
                  MailMind will analyze all received messages for this date, aggregate action items, extract upcoming meetings, and compile highlights.
                </p>
              </div>
            </>
          )}

          {isProcessing && !generatedResult && (
            <div className="py-6 space-y-6 text-center">
              <div className="relative flex justify-center">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 animate-pulse">
                  <Sparkles className="w-8 h-8" />
                </div>
                <Loader2 className="w-20 h-20 text-indigo-600/30 animate-spin absolute -top-2" />
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900 text-sm">
                  {steps[currentStep] || 'Processing workflow...'}
                </h4>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, ((currentStep + 1) / steps.length) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Triggered via n8n Agent Workflow
              </div>
            </div>
          )}

          {generatedResult && (
            <div className="py-4 space-y-4 text-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Summary Generated Successfully!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Synthesized {generatedResult.totalEmails} emails with {generatedResult.actionItemCount} action items flagged.
                </p>
              </div>

              <div className="text-left p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed max-h-32 overflow-y-auto">
                <span className="font-semibold block text-slate-900 mb-1">Executive Overview:</span>
                {generatedResult.overview}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          {!generatedResult ? (
            <>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStartGeneration}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run AI Summary</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>View Full Summary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
