import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Settings,
  Mail,
  Workflow,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2,
  Save,
  RotateCcw,
  Shield,
  Clock,
  Sparkles,
  ExternalLink,
  Sliders,
  Check
} from 'lucide-react';
import { mailMindApi } from '../services/api';
import { AppSettings, UserProfile } from '../services/types';

export const SettingsPage: React.FC = () => {
  const { onRefreshApp, onOpenN8nModal } = useOutletContext<any>();

  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // n8n test state
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs: number;
  } | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const [s, p] = await Promise.all([
          mailMindApi.getSettings(),
          mailMindApi.getUserProfile(),
        ]);
        setSettings(s);
        setProfile(p);
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    try {
      await mailMindApi.updateSettings(settings);
      setSaveSuccess(true);
      onRefreshApp();
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!settings?.n8nWebhookUrl) return;
    setIsTestingWebhook(true);
    setWebhookTestResult(null);
    try {
      const res = await mailMindApi.testN8nWebhook(settings.n8nWebhookUrl);
      setWebhookTestResult(res);
      if (res.success) {
        setSettings({ ...settings, n8nConnected: true });
        await mailMindApi.updateSettings({ n8nConnected: true });
        onRefreshApp();
      }
    } catch (err: any) {
      setWebhookTestResult({
        success: false,
        message: err?.message || 'Connection failed',
        latencyMs: 0,
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleResetData = async () => {
    if (confirm('Reset MailMind AI to the default demonstration dataset? Any modified mock emails will be restored.')) {
      await mailMindApi.resetDemoData();
      onRefreshApp();
      const updated = await mailMindApi.getSettings();
      setSettings(updated);
    }
  };

  if (loading || !settings) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            <span>Settings & Integration Management</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Configure Gmail account sync, n8n automation webhook endpoints, and reporting cadence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetData}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Reset to initial mock state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Environment / Demo Mode Toggle */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Operating Environment & Data Mode</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch between Interactive Prototype Demo Mode and Live n8n Webhook Integration
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isDemoMode}
                onChange={(e) => setSettings({ ...settings, isDemoMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div
            className={`p-3 rounded-lg border text-xs leading-relaxed ${
              settings.isDemoMode
                ? 'bg-amber-50/70 border-amber-200 text-amber-800'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
            }`}
          >
            {settings.isDemoMode ? (
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Demo Mode Active:</strong> The UI displays rich mock emails, simulated latency, and local persistent state. Live n8n webhook calls will not block user actions.
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Live Integration Mode:</strong> Dashboard operations dispatch real HTTP POST requests directly to your configured n8n Webhook URL.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* n8n Automation Engine Settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Workflow className="w-4 h-4 text-indigo-600" />
                <span>n8n Automation Engine Connection</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                The AI email triage workflow operates inside your n8n workflow cluster
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                settings.n8nConnected
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {settings.n8nConnected ? 'n8n Connected' : 'Connection Unverified'}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                n8n Webhook Endpoint URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://n8n.your-domain.com/webhook/mailmind-ai"
                  value={settings.n8nWebhookUrl}
                  onChange={(e) => setSettings({ ...settings, n8nWebhookUrl: e.target.value })}
                  className="flex-1 px-3.5 py-2 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleTestWebhook}
                  disabled={isTestingWebhook}
                  className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  {isTestingWebhook ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Pinging...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Test Handshake</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Test result feedback */}
            {webhookTestResult && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                  webhookTestResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {webhookTestResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{webhookTestResult.message}</p>
                  {webhookTestResult.latencyMs > 0 && (
                    <p className="text-[11px] font-mono mt-0.5">
                      Roundtrip Latency: {webhookTestResult.latencyMs}ms
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Need the workflow template?</span>
              <button
                type="button"
                onClick={onOpenN8nModal}
                className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View n8n Workflow Blueprint</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Gmail Account Integration Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>Gmail Account Connection</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inbound email reader and outbound executive digest dispatcher
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                settings.gmailConnected
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {settings.gmailConnected ? 'OAuth Connected' : 'Simulated / Standby'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                Connected Email Account
              </label>
              <input
                type="email"
                value={settings.gmailAccount}
                onChange={(e) => setSettings({ ...settings, gmailAccount: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                OAuth Permission Scopes
              </label>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-600">
                https://www.googleapis.com/auth/gmail.readonly, gmail.send
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Credentials and tokens are stored securely in your private n8n credential vault. No email secrets are exposed to the browser.
            </span>
          </div>
        </div>

        {/* Report Frequency & Automation Schedule */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Automated Reporting & Summary Schedule</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Set automated dispatch frequency and recipient destination
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                Report Frequency
              </label>
              <select
                value={settings.reportFrequency}
                onChange={(e) => setSettings({ ...settings, reportFrequency: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
              >
                <option value="Daily">Daily Digest (Every Morning)</option>
                <option value="Weekly">Weekly Executive Brief</option>
                <option value="Monthly">Monthly Inbound Review</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                Delivery Time
              </label>
              <input
                type="text"
                value={settings.reportDeliveryTime}
                onChange={(e) => setSettings({ ...settings, reportDeliveryTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                Report Recipient
              </label>
              <input
                type="email"
                value={settings.reportRecipient}
                onChange={(e) => setSettings({ ...settings, reportRecipient: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" />
              <span>Notification Preferences</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select what alerts the MailMind agent delivers immediately
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              {
                key: 'urgentDesktopAlerts',
                title: 'High-Priority Action Alerts',
                desc: 'Prompt notification when critical executive deadlines or approvals are detected.',
              },
              {
                key: 'emailNotifications',
                title: 'Consolidated Executive Digest by Email',
                desc: 'Receive the compiled executive markdown report straight to your Gmail inbox.',
              },
              {
                key: 'autoArchivePromotions',
                title: 'Auto-Triage Promotional Messages',
                desc: 'Automatically flag and deprioritize marketing newsletters and spam from high-priority queues.',
              },
            ].map(({ key, title, desc }) => (
              <label
                key={key}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={Boolean(settings[key as keyof AppSettings])}
                  onChange={(e) =>
                    setSettings({ ...settings, [key]: e.target.checked })
                  }
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 mt-0.5 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">{title}</span>
                  <span className="text-slate-500 text-[11px] leading-relaxed block">{desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Save button bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Settings saved successfully!</span>
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
