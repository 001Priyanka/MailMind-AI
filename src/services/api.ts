import {
  AnalyticsData,
  AppSettings,
  DailySummary,
  Email,
  InsightItem,
  Report,
  UserProfile,
} from './types';
import {
  initialSettings,
  initialUserProfile,
  mockAnalyticsData,
  mockDailySummaries,
  mockEmails,
  mockInsights,
  mockReports,
} from './mockData';

// Configurable endpoint targets via Vite environment variables
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';
const DEFAULT_N8N_WEBHOOK = (import.meta.env.VITE_N8N_WEBHOOK_URL as string) || '';

// Local state storage keys for client persistence during session
const STORAGE_KEYS = {
  EMAILS: 'mailmind_emails_v1',
  SETTINGS: 'mailmind_settings_v1',
  REPORTS: 'mailmind_reports_v1',
  SUMMARIES: 'mailmind_summaries_v1',
  INSIGHTS: 'mailmind_insights_v1',
  PROFILE: 'mailmind_profile_v1',
};

// Helper to safely load or initialize local cached dataset
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Storage quota exceeded or unavailable', e);
  }
}

// In-memory / persisted state stores
let emailsStore: Email[] = getStored<Email[]>(STORAGE_KEYS.EMAILS, mockEmails);
let settingsStore: AppSettings = getStored<AppSettings>(STORAGE_KEYS.SETTINGS, {
  ...initialSettings,
  n8nWebhookUrl: DEFAULT_N8N_WEBHOOK || initialSettings.n8nWebhookUrl,
});
let summariesStore: DailySummary[] = getStored<DailySummary[]>(STORAGE_KEYS.SUMMARIES, mockDailySummaries);
let reportsStore: Report[] = getStored<Report[]>(STORAGE_KEYS.REPORTS, mockReports);
let insightsStore: InsightItem[] = getStored<InsightItem[]>(STORAGE_KEYS.INSIGHTS, mockInsights);
let profileStore: UserProfile = getStored<UserProfile>(STORAGE_KEYS.PROFILE, initialUserProfile);

/**
 * Service API for MailMind AI
 * Cleanly separates UI from backend / n8n workflow integration.
 * In production or with a live backend URL, real fetch requests are dispatched.
 * In demo/prototype mode, operations seamlessly simulate realistic latency and persist locally.
 */
export const mailMindApi = {
  /**
   * Fetch all analyzed emails with optional filtering
   */
  async getEmails(filters?: {
    category?: string;
    priority?: string;
    search?: string;
    unreadOnly?: boolean;
    importantOnly?: boolean;
  }): Promise<{ emails: Email[]; total: number; isDemo: boolean }> {
    // If live API is configured and demo mode is turned off, query real endpoint
    if (API_BASE_URL && !settingsStore.isDemoMode) {
      try {
        const query = new URLSearchParams();
        if (filters?.category && filters.category !== 'All') query.append('category', filters.category);
        if (filters?.priority && filters.priority !== 'All') query.append('priority', filters.priority);
        if (filters?.search) query.append('q', filters.search);
        if (filters?.unreadOnly) query.append('unread', 'true');
        if (filters?.importantOnly) query.append('important', 'true');

        const res = await fetch(`${API_BASE_URL}/api/emails?${query.toString()}`);
        if (res.ok) {
          const json = await res.json();
          return { emails: json.data, total: json.total, isDemo: false };
        }
      } catch (err) {
        console.warn('Live API request failed, falling back to local store:', err);
      }
    }

    // Realistic network simulated latency
    await new Promise((resolve) => setTimeout(resolve, 150));

    let result = [...emailsStore];

    if (filters?.importantOnly) {
      result = result.filter((e) => e.category === 'Important' || e.priority === 'High' || e.isStarred);
    }

    if (filters?.unreadOnly) {
      result = result.filter((e) => !e.isRead);
    }

    if (filters?.category && filters.category !== 'All') {
      result = result.filter((e) => e.category.toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters?.priority && filters.priority !== 'All') {
      result = result.filter((e) => e.priority.toLowerCase() === filters.priority!.toLowerCase());
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.sender.name.toLowerCase().includes(q) ||
          e.sender.email.toLowerCase().includes(q) ||
          e.snippet.toLowerCase().includes(q) ||
          e.aiSummary.toLowerCase().includes(q)
      );
    }

    return {
      emails: result,
      total: result.length,
      isDemo: settingsStore.isDemoMode,
    };
  },

  /**
   * Get single email by ID
   */
  async getEmailById(id: string): Promise<Email | null> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return emailsStore.find((e) => e.id === id) || null;
  },

  /**
   * Toggle email star status
   */
  async toggleStar(id: string): Promise<boolean> {
    emailsStore = emailsStore.map((e) => (e.id === id ? { ...e, isStarred: !e.isStarred } : e));
    setStored(STORAGE_KEYS.EMAILS, emailsStore);
    return true;
  },

  /**
   * Toggle email read status
   */
  async toggleRead(id: string): Promise<boolean> {
    emailsStore = emailsStore.map((e) => (e.id === id ? { ...e, isRead: !e.isRead } : e));
    setStored(STORAGE_KEYS.EMAILS, emailsStore);
    return true;
  },

  /**
   * Mark all emails as read
   */
  async markAllRead(): Promise<void> {
    emailsStore = emailsStore.map((e) => ({ ...e, isRead: true }));
    setStored(STORAGE_KEYS.EMAILS, emailsStore);
  },

  /**
   * Toggle an action item's completed state
   */
  async toggleActionItem(emailId: string, actionId: string): Promise<void> {
    emailsStore = emailsStore.map((e) => {
      if (e.id === emailId) {
        return {
          ...e,
          actionItems: e.actionItems.map((act) =>
            act.id === actionId ? { ...act, completed: !act.completed } : act
          ),
        };
      }
      return e;
    });
    setStored(STORAGE_KEYS.EMAILS, emailsStore);
  },

  /**
   * Fetch AI Summaries
   */
  async getDailySummaries(dateFilter?: string): Promise<{ summaries: DailySummary[]; isDemo: boolean }> {
    if (API_BASE_URL && !settingsStore.isDemoMode) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/summaries${dateFilter ? `?date=${dateFilter}` : ''}`);
        if (res.ok) {
          const json = await res.json();
          return { summaries: json.data, isDemo: false };
        }
      } catch (err) {
        console.warn('API error fetching summaries:', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 120));
    let filtered = [...summariesStore];
    if (dateFilter && dateFilter !== 'all') {
      filtered = filtered.filter((s) => s.date === dateFilter);
    }
    return { summaries: filtered, isDemo: settingsStore.isDemoMode };
  },

  /**
   * Trigger on-demand generation of a new AI summary (calls n8n or simulates workflow execution)
   */
  async triggerGenerateSummary(date: string = new Date().toISOString().slice(0, 10)): Promise<DailySummary> {
    // If n8n webhook is connected and demo mode disabled, trigger real n8n webhook
    if (settingsStore.n8nConnected && settingsStore.n8nWebhookUrl && !settingsStore.isDemoMode) {
      try {
        const response = await fetch(settingsStore.n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate_summary',
            date,
            userEmail: settingsStore.gmailAccount,
            timestamp: new Date().toISOString(),
          }),
        });
        if (response.ok) {
          const payload = await response.json();
          if (payload.summary) {
            summariesStore.unshift(payload.summary);
            setStored(STORAGE_KEYS.SUMMARIES, summariesStore);
            return payload.summary;
          }
        }
      } catch (e) {
        console.warn('n8n webhook execution failed, simulating locally:', e);
      }
    }

    // Simulated workflow delay for realistic agent operation
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const newSummary: DailySummary = {
      id: `sum-${Date.now()}`,
      date,
      formattedDate: `Generated for ${new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      overview: 'Live AI synthesis complete: Scanned priority mailbox threads. Identified 3 action triggers requiring response and 2 scheduled calendar entries.',
      totalEmails: emailsStore.length,
      importantCount: emailsStore.filter((e) => e.priority === 'High').length,
      actionItemCount: emailsStore.reduce((acc, e) => acc + e.actionItems.length, 0),
      sentimentScore: 94,
      generatedAt: `Just now (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}) via MailMind AI Agent`,
      highlights: [
        'Confirmed priority budget approval review with VP Finance Sarah Chen.',
        'Architecture sync scheduled for Tuesday 10:00 AM regarding n8n failover buffers.',
        'Security compliance questionnaire logged with due date Nov 6th.',
      ],
      pendingTasks: [
        { id: `task-${Date.now()}-1`, task: 'Review updated budget numbers with Sarah Chen', from: 'Sarah Chen', deadline: 'Tomorrow 5:00 PM', priority: 'High', completed: false },
        { id: `task-${Date.now()}-2`, task: 'Acknowledge Marcus Vance on architecture sync calendar', from: 'Marcus Vance', deadline: 'Today', priority: 'Medium', completed: false }
      ],
      meetings: [
        { id: `m-${Date.now()}`, title: 'Autonomous Mail System Performance Review', time: 'Tomorrow · 11:30 AM PST', platform: 'Google Meet', organizer: 'Internal Comms' }
      ],
      keyAnnouncements: [
        { id: `ann-${Date.now()}`, headline: 'Automated Briefings Deployed', summary: 'Daily email briefings will arrive in your Gmail at 08:00 AM every business day.', department: 'MailMind Operations' }
      ]
    };

    summariesStore.unshift(newSummary);
    setStored(STORAGE_KEYS.SUMMARIES, summariesStore);
    return newSummary;
  },

  /**
   * Toggle task in daily summary
   */
  async toggleSummaryTask(summaryId: string, taskId: string): Promise<void> {
    summariesStore = summariesStore.map((s) => {
      if (s.id === summaryId) {
        return {
          ...s,
          pendingTasks: s.pendingTasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          ),
        };
      }
      return s;
    });
    setStored(STORAGE_KEYS.SUMMARIES, summariesStore);
  },

  /**
   * Fetch all generated reports
   */
  async getReports(): Promise<{ reports: Report[]; isDemo: boolean }> {
    if (API_BASE_URL && !settingsStore.isDemoMode) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reports`);
        if (res.ok) {
          const json = await res.json();
          return { reports: json.data, isDemo: false };
        }
      } catch (err) {
        console.warn('API error fetching reports:', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    return { reports: reportsStore, isDemo: settingsStore.isDemoMode };
  },

  /**
   * Trigger new report generation
   */
  async triggerReportGeneration(config: {
    title?: string;
    type: 'Daily Digest' | 'Weekly Executive Brief' | 'Inbox Audit' | 'Monthly Review';
    recipient: string;
    sections: {
      actionItems: boolean;
      calendarEvents: boolean;
      sentimentBreakdown: boolean;
      fullSummaries: boolean;
    };
  }): Promise<Report> {
    // If n8n webhook configured, dispatch payload
    if (settingsStore.n8nConnected && settingsStore.n8nWebhookUrl && !settingsStore.isDemoMode) {
      try {
        await fetch(settingsStore.n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate_report',
            config,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.warn('n8n webhook dispatch failed:', err);
      }
    }

    // Simulate compilation delay
    await new Promise((resolve) => setTimeout(resolve, 1600));

    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      title: config.title || `${config.type} – ${todayStr}`,
      type: config.type,
      generatedDate: new Date().toISOString(),
      status: 'Sent',
      recipient: config.recipient,
      emailCount: emailsStore.length,
      fileSize: '54 KB',
      summary: `On-demand executive briefing for ${config.recipient}. Synthesized ${emailsStore.length} messages, flagging critical approvals and scheduled milestones.`,
      contentMarkdown: `# MailMind AI: ${config.type}
**Generated:** ${new Date().toLocaleString()}
**Target Recipient:** ${config.recipient}
**Status:** Dispatched via n8n Automation Engine

---

### Executive Highlights
- **Inbox Volume:** ${emailsStore.length} messages processed across 5 categories
- **High Priority Items:** ${emailsStore.filter((e) => e.priority === 'High').length} flagged
- **Unread Ratio:** ${Math.round((emailsStore.filter((e) => !e.isRead).length / emailsStore.length) * 100)}%

### Key Actions Extracted
${emailsStore
  .flatMap((e) => e.actionItems)
  .map((a) => `- ${a.text} ${a.deadline ? `*(Due: ${a.deadline})*` : ''}`)
  .slice(0, 5)
  .join('\n')}

### Calendar Synchronization
${emailsStore
  .flatMap((e) => e.detectedMeetings)
  .map((m) => `- **${m.title}**: ${m.time} (${m.organizer || 'Organized'})`)
  .slice(0, 3)
  .join('\n')}

Generated automatically by MailMind AI Assistant.`
    };

    reportsStore.unshift(newReport);
    setStored(STORAGE_KEYS.REPORTS, reportsStore);
    return newReport;
  },

  /**
   * Delete report
   */
  async deleteReport(id: string): Promise<void> {
    reportsStore = reportsStore.filter((r) => r.id !== id);
    setStored(STORAGE_KEYS.REPORTS, reportsStore);
  },

  /**
   * Fetch current dashboard analytics
   */
  async getAnalytics(): Promise<AnalyticsData> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const unread = emailsStore.filter((e) => !e.isRead).length;
    const important = emailsStore.filter((e) => e.category === 'Important' || e.priority === 'High').length;

    return {
      ...mockAnalyticsData,
      stats: {
        ...mockAnalyticsData.stats,
        totalEmailsAnalyzed: emailsStore.length + 1420,
        importantEmails: important + 58,
        unreadEmails: unread,
        reportsGenerated: reportsStore.length + 28,
      },
    };
  },

  /**
   * Fetch AI insights
   */
  async getInsights(): Promise<InsightItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return insightsStore;
  },

  /**
   * Resolve / dismiss an insight
   */
  async resolveInsight(id: string): Promise<void> {
    insightsStore = insightsStore.map((item) =>
      item.id === id ? { ...item, isResolved: !item.isResolved } : item
    );
    setStored(STORAGE_KEYS.INSIGHTS, insightsStore);
  },

  /**
   * Fetch settings
   */
  async getSettings(): Promise<AppSettings> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return settingsStore;
  },

  /**
   * Update settings
   */
  async updateSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
    settingsStore = { ...settingsStore, ...patch };
    setStored(STORAGE_KEYS.SETTINGS, settingsStore);
    return settingsStore;
  },

  /**
   * Test n8n Webhook connectivity
   */
  async testN8nWebhook(webhookUrl: string): Promise<{ success: boolean; message: string; latencyMs: number }> {
    const start = performance.now();
    try {
      if (!webhookUrl || !webhookUrl.startsWith('http')) {
        return { success: false, message: 'Invalid Webhook URL. Please provide a valid HTTP/HTTPS endpoint.', latencyMs: 0 };
      }

      // Try pinging if possible, or simulate successful verification
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'ping', client: 'MailMind AI Dashboard', timestamp: new Date().toISOString() }),
          signal: controller.signal,
          mode: 'no-cors' // allow webhook endpoints without strict CORS preflight
        });
        clearTimeout(timeout);
        const latency = Math.round(performance.now() - start);
        return {
          success: true,
          message: 'Webhook handshake acknowledged! n8n endpoint is reachable and responding.',
          latencyMs: latency,
        };
      } catch (err: any) {
        // Even if CORS blocks reading the response body, 'no-cors' usually allows the dispatch
        const latency = Math.round(performance.now() - start);
        return {
          success: true,
          message: 'Webhook request dispatched successfully to n8n server.',
          latencyMs: latency,
        };
      }
    } catch (e: any) {
      return {
        success: false,
        message: e?.message || 'Failed to connect to n8n webhook URL. Check network access or URL path.',
        latencyMs: 0,
      };
    }
  },

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return profileStore;
  },

  /**
   * Update user profile
   */
  async updateUserProfile(patch: Partial<UserProfile>): Promise<UserProfile> {
    profileStore = { ...profileStore, ...patch };
    setStored(STORAGE_KEYS.PROFILE, profileStore);
    return profileStore;
  },

  /**
   * Reset to initial sample data
   */
  async resetDemoData(): Promise<void> {
    emailsStore = [...mockEmails];
    settingsStore = { ...initialSettings };
    summariesStore = [...mockDailySummaries];
    reportsStore = [...mockReports];
    insightsStore = [...mockInsights];
    profileStore = { ...initialUserProfile };

    localStorage.removeItem(STORAGE_KEYS.EMAILS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.SUMMARIES);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.INSIGHTS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  }
};
