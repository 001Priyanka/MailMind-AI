import { AnalyticsData, AppSettings, DailySummary, Email, InsightItem, Report, UserProfile } from './types';

export const initialUserProfile: UserProfile = {
  name: 'Priyanka Sharma',
  email: 'priyankamm.396@gmail.com',
  role: 'Director of Product & AI Systems',
  organization: 'Apex Solutions Inc.',
  avatarUrl: '/src/assets/images/avatar_user_profile_1793428508959.jpg',
  connectedSince: 'Oct 12, 2026',
  timezone: 'America/Los_Angeles (PST)',
  emailsProcessedAllTime: 1428,
  reportsSentAllTime: 32,
};

export const initialSettings: AppSettings = {
  gmailConnected: false, // Disconnected by default so user can see real state and connect or toggle demo
  gmailAccount: 'priyankamm.396@gmail.com',
  n8nConnected: false, // Explicitly false per instruction: "Do not pretend that Gmail or n8n is connected if the backend integration has not been configured."
  n8nWebhookUrl: 'https://n8n.workflow.internal/webhook/mailmind-ai-process',
  reportFrequency: 'Daily',
  reportDeliveryTime: '08:00 AM',
  reportRecipient: 'priyankamm.396@gmail.com',
  aiSummaryTone: 'concise',
  autoArchivePromotions: true,
  urgentDesktopAlerts: true,
  emailNotifications: true,
  isDemoMode: true, // Demo mode active to display rich sample data with clear banner
};

export const mockEmails: Email[] = [
  {
    id: 'em-101',
    sender: {
      name: 'Sarah Chen',
      email: 'sarah.chen@fintechcorp.io',
    },
    subject: 'URGENT: Q4 Budget Proposal Final Sign-off Required',
    snippet: 'Hi Priyanka, the board review is moved up to Friday at 3:00 PM. We need your approved headcount allocations...',
    body: `Hi Priyanka,

The executive board review for the Q4 Enterprise AI allocation has been moved up to this Friday at 3:00 PM PST. 

Before we submit the deck, we strictly need:
1. Approved headcount numbers for the AI workflow engineering team.
2. Estimated infrastructure compute budget for n8n + LLM orchestration nodes ($34,500/mo estimate).
3. Risk mitigation sign-off on enterprise SOC2 email handling.

Could you please review the attached sheet and send your confirmation by tomorrow, 5:00 PM?

Best regards,
Sarah Chen
VP of Finance & Operations`,
    category: 'Important',
    priority: 'High',
    receivedDate: '2026-10-30T21:15:00Z',
    status: 'Action Required',
    isRead: false,
    isStarred: true,
    aiSummary: 'Board review moved to Friday 3:00 PM. Sarah Chen requires approved headcount allocations, n8n/LLM compute budget, and SOC2 sign-off by Thursday 5:00 PM.',
    actionItems: [
      { id: 'act-1', text: 'Approve AI engineering headcount numbers', deadline: 'Tomorrow, 5:00 PM', completed: false },
      { id: 'act-2', text: 'Confirm n8n compute budget allocation ($34,500)', deadline: 'Tomorrow, 5:00 PM', completed: false },
      { id: 'act-3', text: 'Sign off SOC2 email handling audit memo', deadline: 'Tomorrow, 5:00 PM', completed: false },
    ],
    detectedMeetings: [
      { title: 'Executive Board Q4 Budget Review', time: 'Friday, Nov 2, 3:00 PM - 4:30 PM PST', organizer: 'Board of Directors' }
    ],
    sentiment: 'Urgent',
    suggestedReplies: [
      'I am reviewing the spreadsheet now and will send final approvals by 2:00 PM tomorrow.',
      'Headcount numbers are confirmed as drafted. Let us sync for 10 mins on compute costs.',
      'Received with high priority. Looping in DevOps lead for compute confirmation.'
    ]
  },
  {
    id: 'em-102',
    sender: {
      name: 'Marcus Vance',
      email: 'm.vance@corecloud.net',
    },
    subject: 'Technical Sync: n8n Production Webhook Failover Architecture',
    snippet: 'Hey team, following up on our latency benchmarks. We noticed a 120ms bottleneck during peak mail burst periods...',
    body: `Hey Priyanka,

Following up on our latency benchmarks with the MailMind n8n automation engine. We noticed a 120ms bottleneck during peak 9:00 AM mail burst intervals when ingesting large MIME attachments.

I have scheduled a 30-minute architectural sync for Tuesday at 10:00 AM PST with the infrastructure squad to demonstrate the new Redis queue buffer.

Meeting link: https://meet.google.com/xyz-qwer-vbn

Please let me know if this slot works for you.

Cheers,
Marcus Vance
Principal Systems Architect`,
    category: 'Work',
    priority: 'Medium',
    receivedDate: '2026-10-30T19:40:00Z',
    status: 'Analyzed',
    isRead: false,
    isStarred: true,
    aiSummary: 'Marcus Vance identified a 120ms peak ingestion latency bottleneck in n8n mail handling and scheduled a technical sync for Tuesday 10:00 AM PST.',
    actionItems: [
      { id: 'act-4', text: 'Review Redis queue buffer proposal before Tuesday sync', deadline: 'Tuesday, Nov 4, 9:30 AM', completed: false }
    ],
    detectedMeetings: [
      { title: 'n8n Production Webhook Architecture Sync', time: 'Tuesday, Nov 4, 10:00 AM - 10:30 AM PST', organizer: 'Marcus Vance', location: 'Google Meet' }
    ],
    sentiment: 'Positive',
    suggestedReplies: [
      'Tuesday 10:00 AM works perfectly. Looking forward to reviewing the Redis buffer.',
      'Thanks Marcus. Could you send the latency profile charts ahead of the call?',
      'Slot accepted! Adding this to my product roadmap review calendar.'
    ]
  },
  {
    id: 'em-103',
    sender: {
      name: 'Elena Rostova',
      email: 'elena@cyberguardsolutions.com',
    },
    subject: 'Action Required: Enterprise Security Compliance Questionnaire (Due Nov 6)',
    snippet: 'Dear Vendor Partner, Annual SOC2 Type II compliance re-certification requires your updated questionnaire submission...',
    body: `Dear Priyanka,

As part of Apex Solutions' annual enterprise vendor review, CyberGuard requires an updated security questionnaire response. 

Key focus areas:
- Zero credential retention in LLM prompts
- Gmail OAuth token encryption at rest
- n8n automated reporting log redaction policies

Submission link is active through Thursday, November 6th at 11:59 PM. Delayed submission may result in temporary API rate limiting.

Best,
Elena Rostova
Head of Information Security`,
    category: 'Important',
    priority: 'High',
    receivedDate: '2026-10-30T18:10:00Z',
    status: 'Action Required',
    isRead: true,
    isStarred: false,
    aiSummary: 'Annual vendor SOC2 security questionnaire is due by November 6th. Requires validation of zero credential retention in LLM prompts and Gmail token encryption.',
    actionItems: [
      { id: 'act-5', text: 'Complete SOC2 vendor security questionnaire', deadline: 'Nov 6, 2026', completed: false }
    ],
    detectedMeetings: [],
    sentiment: 'Formal',
    suggestedReplies: [
      'Questionnaire received. Our security compliance team is already completing the responses.',
      'Confirming our SOC2 Type II report will be attached along with the completed form by Nov 4th.'
    ]
  },
  {
    id: 'em-104',
    sender: {
      name: 'Internal Communications',
      email: 'announcements@apexsolutions.com',
    },
    subject: 'All-Hands Company Meeting Rescheduled to Thursday 11:00 AM',
    snippet: 'Please note the shift in schedule for our Q4 All-Hands. CEO David Miller will share product milestones and 2027 vision...',
    body: `Team,

Please note our upcoming Q4 All-Hands company gathering has been shifted to this Thursday, November 5th at 11:00 AM PST (previously Wednesday afternoon).

Agenda:
1. Executive Update: 240% ARR growth in AI automation pipelines
2. Spotlight: MailMind AI automated email reporting rollout
3. Open Q&A with Senior Leadership

Please submit questions in advance via Slido #ApexAllHands.

Internal Communications Team`,
    category: 'Updates',
    priority: 'Medium',
    receivedDate: '2026-10-30T16:22:00Z',
    status: 'Summary Generated',
    isRead: true,
    isStarred: false,
    aiSummary: 'Q4 All-Hands rescheduled to Thursday Nov 5 at 11:00 AM PST. Agenda includes 240% ARR growth and MailMind AI rollout spotlight.',
    actionItems: [
      { id: 'act-6', text: 'Submit questions for CEO All-Hands on Slido', deadline: 'Wednesday, Nov 4', completed: true }
    ],
    detectedMeetings: [
      { title: 'Q4 Apex All-Hands Gathering', time: 'Thursday, Nov 5, 11:00 AM - 12:00 PM PST', organizer: 'Internal Communications' }
    ],
    sentiment: 'Positive',
    suggestedReplies: [
      'Calendar updated. MailMind AI presentation slides will be ready for the spotlight.'
    ]
  },
  {
    id: 'em-105',
    sender: {
      name: 'Google Cloud Billing',
      email: 'billing-noreply@google.com',
    },
    subject: 'Your Google Cloud Monthly Invoice for September is Available',
    snippet: 'Invoice #INV-2026-09-8831 is now ready for download. Total balance due: $1,280.44 charged automatically...',
    body: `Hello Priyanka,

Your Google Cloud Platform billing statement for September 2026 is now available. 

Summary:
- Account ID: 0148-9923-Apex
- Total Amount: $1,280.44 USD
- Payment Status: Paid via Corporate Master Card ending in 4109
- Primary Drivers: Cloud Run Services, Vertex AI inference quotas, Cloud Storage

No action is required if your auto-debit profile is up to date.

The Google Cloud Team`,
    category: 'Finance',
    priority: 'Low',
    receivedDate: '2026-10-30T14:05:00Z',
    status: 'Analyzed',
    isRead: true,
    isStarred: false,
    aiSummary: 'September GCP billing invoice for $1,280.44 paid automatically via auto-debit. No action required.',
    actionItems: [],
    detectedMeetings: [],
    sentiment: 'Neutral',
    suggestedReplies: [
      'Forward to accounting@apexsolutions.com for record keeping.'
    ]
  },
  {
    id: 'em-106',
    sender: {
      name: 'TechCrunch Newsletter',
      email: 'news@techcrunch.com',
    },
    subject: 'TC Daily: Next-Gen Autonomous AI Agents Take Over Enterprise Workflows',
    snippet: 'Today in tech: Why enterprise automation is ditching brittle scrapers for generative multi-step workflow engines...',
    body: `Good morning tech readers,

Enterprise software is undergoing an architectural revolution. Traditional RPA bots are giving way to intelligent agents running atop orchestration engines like n8n, LangChain, and specialized Gmail integrations.

In this edition:
- How Fortune 500 executives save 5 hours per week with automated morning briefings
- Security compliance considerations when processing inbox data
- The rise of local model evaluation

Read the full story on TechCrunch.com`,
    category: 'Promotional',
    priority: 'Low',
    receivedDate: '2026-10-30T11:30:00Z',
    status: 'Analyzed',
    isRead: true,
    isStarred: false,
    aiSummary: 'Industry newsletter discussing enterprise adoption of autonomous workflow agents and automated executive email briefings.',
    actionItems: [],
    detectedMeetings: [],
    sentiment: 'Neutral',
    suggestedReplies: []
  },
  {
    id: 'em-107',
    sender: {
      name: 'Arjun Mehta',
      email: 'arjun.m@venturecap.com',
    },
    subject: 'Intro / Quick coffee chat in SF next week?',
    snippet: 'Hey Priyanka, loved your recent keynote on autonomous email summarization pipelines. Are you in SF next Wednesday?',
    body: `Hey Priyanka,

Loved your recent keynote on autonomous email summarization pipelines with n8n and LLMs! We are looking into seed-stage investments in the enterprise workspace space.

I'll be in SoMa next Wednesday (Nov 5). Would love to buy you a coffee or quick lunch to hear how Apex is scaling MailMind.

Let me know if you have 30 minutes free!

Warmly,
Arjun Mehta
Partner, Horizon Ventures`,
    category: 'Personal',
    priority: 'Medium',
    receivedDate: '2026-10-29T20:10:00Z',
    status: 'Analyzed',
    isRead: false,
    isStarred: true,
    aiSummary: 'Arjun Mehta from Horizon Ventures requested a 30-min coffee chat in SF next Wednesday to discuss autonomous email summarization.',
    actionItems: [
      { id: 'act-7', text: 'Respond to Arjun regarding Wednesday coffee in SF', deadline: 'Friday, Oct 31', completed: false }
    ],
    detectedMeetings: [],
    sentiment: 'Positive',
    suggestedReplies: [
      'Hi Arjun, thanks for reaching out! I would love to connect. Wednesday 2:30 PM near 2nd St works well.',
      'Thanks Arjun! I am traveling next week, but would be happy to jump on a quick 20-min Zoom call.'
    ]
  },
  {
    id: 'em-108',
    sender: {
      name: 'GitHub Notifications',
      email: 'notifications@github.com',
    },
    subject: '[mailmind-ai/workflow-engine] Pull Request #42: Add n8n webhook validation middleware',
    snippet: 'dev-lead requested your review on #42: implements HMAC SHA256 signature verification for inbound n8n payloads...',
    body: `Priyanka,

Pull Request #42 has been opened by dev-lead:
"Add n8n webhook validation middleware"

Changes:
- Verifies X-MailMind-Signature header using secret token
- Rejects unauthenticated requests with 401 Unauthorized
- Adds retry policy for transient 500 responses

Please review and merge when ready.`,
    category: 'Work',
    priority: 'Medium',
    receivedDate: '2026-10-29T15:45:00Z',
    status: 'Analyzed',
    isRead: true,
    isStarred: false,
    aiSummary: 'PR #42 opened for review: implements HMAC SHA256 signature verification for inbound n8n webhook payloads.',
    actionItems: [
      { id: 'act-8', text: 'Review and merge GitHub PR #42', deadline: 'Thursday, Oct 30', completed: true }
    ],
    detectedMeetings: [],
    sentiment: 'Neutral',
    suggestedReplies: [
      'PR approved and tests passing. Merged.'
    ]
  }
];

export const mockInsights: InsightItem[] = [
  {
    id: 'ins-1',
    type: 'deadline',
    title: 'Q4 Budget Proposal Approval Due',
    description: 'Sarah Chen requires final approved headcount allocations and compute estimates before Friday board review.',
    sourceEmailId: 'em-101',
    sender: 'Sarah Chen',
    date: 'Oct 30, 2026',
    dueDate: 'Tomorrow, 5:00 PM',
    urgency: 'critical',
    isResolved: false,
  },
  {
    id: 'ins-2',
    type: 'meeting',
    title: 'n8n Production Webhook Failover Sync',
    description: 'Marcus Vance scheduled a 30-min technical sync on Tuesday 10:00 AM PST to present the Redis queue buffer.',
    sourceEmailId: 'em-102',
    sender: 'Marcus Vance',
    date: 'Oct 30, 2026',
    dueDate: 'Tuesday, Nov 4, 10:00 AM',
    urgency: 'moderate',
    isResolved: false,
  },
  {
    id: 'ins-3',
    type: 'urgent',
    title: 'SOC2 Security Recertification Questionnaire',
    description: 'Vendor security questionnaire submission required to maintain enterprise API access quotas.',
    sourceEmailId: 'em-103',
    sender: 'Elena Rostova',
    date: 'Oct 30, 2026',
    dueDate: 'Nov 6, 2026',
    urgency: 'critical',
    isResolved: false,
  },
  {
    id: 'ins-4',
    type: 'announcement',
    title: 'Company All-Hands Rescheduled to Thursday',
    description: 'CEO David Miller spotlighting 240% ARR expansion and MailMind automated reporting system.',
    sourceEmailId: 'em-104',
    sender: 'Internal Communications',
    date: 'Oct 30, 2026',
    dueDate: 'Thursday, Nov 5, 11:00 AM',
    urgency: 'info',
    isResolved: false,
  }
];

export const mockDailySummaries: DailySummary[] = [
  {
    id: 'sum-today',
    date: '2026-10-30',
    formattedDate: 'Today, Oct 30, 2026',
    overview: 'High-activity inbox day dominated by urgent Q4 financial approvals, infrastructure scalability preparations with n8n, and vendor security audit obligations. 8 emails processed, 3 critical action items flagged.',
    totalEmails: 8,
    importantCount: 3,
    actionItemCount: 4,
    sentimentScore: 92,
    generatedAt: 'Today at 08:00 AM via n8n automated workflow',
    highlights: [
      'Board review moved up to Friday 3:00 PM; Sarah Chen urgently awaits Q4 compute & headcount numbers.',
      'Infrastructure architect Marcus Vance proposed a Redis queue to eliminate the 120ms n8n burst latency.',
      'Elena Rostova issued the annual SOC2 compliance audit questionnaire due November 6th.',
      'Company All-Hands moved to Thursday 11:00 AM with a dedicated MailMind AI feature showcase.'
    ],
    pendingTasks: [
      { id: 'task-1', task: 'Send approved Q4 headcount and compute numbers to Sarah Chen', from: 'Sarah Chen (VP Finance)', deadline: 'Tomorrow at 5:00 PM', priority: 'High', completed: false },
      { id: 'task-2', task: 'Fill CyberGuard SOC2 Security Questionnaire', from: 'Elena Rostova (CyberGuard)', deadline: 'Nov 6, 2026', priority: 'High', completed: false },
      { id: 'task-3', task: 'Reply to Arjun Mehta regarding Wednesday coffee chat in SF', from: 'Arjun Mehta (Horizon VC)', deadline: 'Oct 31, 2026', priority: 'Medium', completed: false },
      { id: 'task-4', task: 'Prepare slide deck for CEO All-Hands MailMind feature spotlight', from: 'Internal Comms', deadline: 'Wednesday, Nov 4', priority: 'Medium', completed: false }
    ],
    meetings: [
      { id: 'm-1', title: 'n8n Production Webhook Architecture Sync', time: 'Tuesday, Nov 4 · 10:00 AM – 10:30 AM PST', platform: 'Google Meet', organizer: 'Marcus Vance' },
      { id: 'm-2', title: 'Q4 Apex Company All-Hands', time: 'Thursday, Nov 5 · 11:00 AM – 12:00 PM PST', platform: 'Zoom Livestream', organizer: 'David Miller (CEO)' },
      { id: 'm-3', title: 'Executive Board Q4 Budget Review', time: 'Friday, Nov 6 · 3:00 PM – 4:30 PM PST', platform: 'Boardroom / Webex', organizer: 'Board of Directors' }
    ],
    keyAnnouncements: [
      { id: 'ann-1', headline: 'Apex ARR expands 240% Year-over-Year', summary: 'Strong adoption of automated AI workflow solutions across enterprise accounts.', department: 'Executive Office' },
      { id: 'ann-2', headline: 'Scheduled Cloud Database Maintenance Window', summary: 'Sunday 02:00 - 03:00 UTC. Zero expected downtime for n8n webhook listeners.', department: 'DevOps' }
    ]
  },
  {
    id: 'sum-yesterday',
    date: '2026-10-29',
    formattedDate: 'Yesterday, Oct 29, 2026',
    overview: 'Moderate email volume with focus on product roadmap grooming, PR reviews for webhook signature verification, and investor inquiries. 14 emails analyzed with 100% classification precision.',
    totalEmails: 14,
    importantCount: 4,
    actionItemCount: 2,
    sentimentScore: 95,
    generatedAt: 'Oct 29, 2026 at 08:00 AM via n8n automated workflow',
    highlights: [
      'GitHub PR #42 merged: HMAC SHA256 webhook validation implemented successfully.',
      'Arjun Mehta (Horizon Ventures) initiated outreach for workspace AI discussion.',
      'Sprint 44 completed with 98% milestone velocity.'
    ],
    pendingTasks: [
      { id: 'task-5', task: 'Review sprint retro action items with engineering leads', from: 'Marcus Vance', deadline: 'Completed', priority: 'Low', completed: true },
      { id: 'task-6', task: 'Review HMAC SHA256 PR on GitHub repository', from: 'dev-lead', deadline: 'Completed', priority: 'Medium', completed: true }
    ],
    meetings: [
      { id: 'm-4', title: 'Sprint 44 Retrospective & Grooming', time: 'Wednesday, Oct 29 · 2:00 PM – 3:00 PM PST', platform: 'Google Meet', organizer: 'Marcus Vance' }
    ],
    keyAnnouncements: [
      { id: 'ann-3', headline: 'n8n Cloud Enterprise Instance Upgraded to v1.62', summary: 'Enhanced webhook concurrency limits enabled for our production tenant.', department: 'Platform Ops' }
    ]
  }
];

export const mockReports: Report[] = [
  {
    id: 'rep-001',
    title: 'Daily Executive Inbox Briefing – Oct 30, 2026',
    type: 'Daily Digest',
    generatedDate: '2026-10-30T08:00:00Z',
    status: 'Sent',
    recipient: 'priyankamm.396@gmail.com',
    emailCount: 8,
    fileSize: '48 KB',
    summary: 'Consolidated briefing covering Q4 financial approval deadlines, infrastructure webhook optimizations, and compliance milestones.',
    contentMarkdown: `# MailMind AI Daily Executive Briefing
**Date:** October 30, 2026
**Generated by:** MailMind AI Agent (n8n Workflow #991)
**Recipient:** priyankamm.396@gmail.com

---

### 1. Executive Summary
Today, the system analyzed **8 priority inbound emails**. **3 items** were classified as High Priority requiring direct executive intervention within 24–48 hours.

### 2. High-Priority Action Items
- **Q4 Budget Sign-off (Sarah Chen):** Approve AI team headcount and $34,500 compute allowance before Friday board review. Deadline: Tomorrow 5:00 PM.
- **SOC2 Vendor Questionnaire (Elena Rostova):** Annual security recertification form submitted by Nov 6.

### 3. Detected Calendar Commitments
- **Tue, Nov 4, 10:00 AM:** n8n Production Webhook Architecture Sync (Marcus Vance)
- **Thu, Nov 5, 11:00 AM:** Apex Q4 All-Hands Company Gathering (David Miller)
- **Fri, Nov 6, 3:00 PM:** Executive Board Q4 Budget Review

### 4. Categorization Breakdown
- Important: 37.5%
- Work: 25.0%
- Updates & Finance: 25.0%
- Promotional: 12.5%

*MailMind AI – Operating in automated compliance mode.*`
  },
  {
    id: 'rep-002',
    title: 'Weekly Executive Communications Audit – Week 43',
    type: 'Weekly Executive Brief',
    generatedDate: '2026-10-27T07:30:00Z',
    status: 'Sent',
    recipient: 'priyankamm.396@gmail.com',
    emailCount: 68,
    fileSize: '184 KB',
    summary: 'Comprehensive audit of 68 emails. Total estimated executive triage time saved: 5.2 hours. Zero missed critical deadlines.',
    contentMarkdown: `# MailMind AI Weekly Communications Audit
**Coverage:** Week 43 (Oct 20 - Oct 26, 2026)
**Recipient:** priyankamm.396@gmail.com

---

### Highlights & ROI
- **Emails Processed:** 68
- **Triage Time Saved:** 5.2 hours
- **Accuracy Rate:** 99.4%
- **Action Items Resolved:** 14 of 16 completed

### Category Distribution
- Work & Architecture: 42%
- Important & Deadlines: 28%
- Product Updates: 18%
- Promotional / Archived: 12%

Generated automatically by n8n scheduled cron trigger.`
  },
  {
    id: 'rep-003',
    title: 'Project Alpha Infrastructure Mail Audit',
    type: 'Inbox Audit',
    generatedDate: '2026-10-24T14:15:00Z',
    status: 'Ready',
    recipient: 'priyankamm.396@gmail.com',
    emailCount: 34,
    fileSize: '92 KB',
    summary: 'Focused intelligence report on vendor correspondence, API rate agreements, and SLA compliance metrics.',
    contentMarkdown: `# Project Alpha Infrastructure Correspondence Report
**Scope:** Vendor and Infrastructure Threads
**Status:** Ready for export

All communications regarding Cloud Run provisioning and n8n webhook reliability met or exceeded SLA expectations.`
  },
  {
    id: 'rep-004',
    title: 'Monthly Executive Inbox Digest – September 2026',
    type: 'Monthly Review',
    generatedDate: '2026-10-01T08:00:00Z',
    status: 'Sent',
    recipient: 'priyankamm.396@gmail.com',
    emailCount: 294,
    fileSize: '410 KB',
    summary: 'Complete month-in-review covering 294 emails, 48 meetings scheduled, and 38 executive decisions archived.',
    contentMarkdown: `# September 2026 Inbound Intelligence Digest
Monthly overview of communications, client escalations, and executive actions taken.`
  }
];

export const mockAnalyticsData: AnalyticsData = {
  activity7Days: [
    { date: '2026-10-24', day: 'Sat', received: 18, analyzed: 18, important: 2 },
    { date: '2026-10-25', day: 'Sun', received: 12, analyzed: 12, important: 1 },
    { date: '2026-10-26', day: 'Mon', received: 54, analyzed: 54, important: 8 },
    { date: '2026-10-27', day: 'Tue', received: 68, analyzed: 68, important: 11 },
    { date: '2026-10-28', day: 'Wed', received: 61, analyzed: 61, important: 9 },
    { date: '2026-10-29', day: 'Thu', received: 49, analyzed: 49, important: 7 },
    { date: '2026-10-30', day: 'Fri', received: 42, analyzed: 42, important: 6 },
  ],
  categoryDistribution: [
    { name: 'Important', value: 26, color: '#6366f1', count: 64 }, // Indigo/Purple accent
    { name: 'Work', value: 38, color: '#3b82f6', count: 92 },      // Blue
    { name: 'Personal', value: 12, color: '#10b981', count: 30 },  // Emerald
    { name: 'Promotional', value: 14, color: '#f59e0b', count: 35 },// Amber
    { name: 'Finance & Updates', value: 10, color: '#8b5cf6', count: 24 }, // Violet
  ],
  stats: {
    totalEmailsAnalyzed: 1428,
    importantEmails: 64,
    unreadEmails: 18,
    reportsGenerated: 32,
    timeSavedHours: 24.6,
    averageLatencyMs: 1420,
    accuracyRate: 99.2,
  }
};

export const sampleN8nWorkflowJson = JSON.stringify({
  "name": "MailMind AI - Intelligent Email Analysis & Daily Reporting",
  "nodes": [
    {
      "parameters": {
        "pollTimes": {
          "item": [
            { "mode": "everyMinute" }
          ]
        },
        "simple": false,
        "filters": {
          "readStatus": "unread"
        }
      },
      "id": "node-gmail-trigger",
      "name": "Gmail Inbound Trigger",
      "type": "n8n-nodes-base.gmailTrigger",
      "typeVersion": 1,
      "position": [ 240, 300 ]
    },
    {
      "parameters": {
        "model": "gemini-2.5-flash",
        "prompt": "Analyze this email. Extract: category (Important, Work, Personal, Promotional), priority (High, Medium, Low), a 2-sentence summary, detected deadlines, action items, and scheduled meetings. Return strictly valid JSON."
      },
      "id": "node-ai-agent",
      "name": "MailMind Gemini AI Analysis",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.6,
      "position": [ 480, 300 ]
    },
    {
      "parameters": {
        "url": "={{ $env.MAILMIND_WEBHOOK_URL || 'https://your-mailmind-app.com/api/webhooks/emails' }}",
        "method": "POST",
        "sendBody": true,
        "contentType": "json"
      },
      "id": "node-dispatch-webhook",
      "name": "Dispatch to MailMind Dashboard",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [ 720, 300 ]
    },
    {
      "parameters": {
        "rule": {
          "interval": [
            { "field": "cronExpression", "expression": "0 8 * * *" }
          ]
        }
      },
      "id": "node-cron-report",
      "name": "Daily 8 AM Cron Trigger",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [ 240, 500 ]
    },
    {
      "parameters": {
        "operation": "send",
        "toEmail": "={{ $json.recipient || 'user@example.com' }}",
        "subject": "=MailMind AI: Daily Executive Briefing ({{ $now.toFormat('yyyy-MM-dd') }})",
        "message": "={{ $json.compiledReportHtml }}"
      },
      "id": "node-send-report-gmail",
      "name": "Send Consolidated Email Report",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [ 680, 500 ]
    }
  ],
  "connections": {
    "Gmail Inbound Trigger": {
      "main": [
        [ { "node": "MailMind Gemini AI Analysis", "type": "main", "index": 0 } ]
      ]
    },
    "MailMind Gemini AI Analysis": {
      "main": [
        [ { "node": "Dispatch to MailMind Dashboard", "type": "main", "index": 0 } ]
      ]
    },
    "Daily 8 AM Cron Trigger": {
      "main": [
        [ { "node": "Send Consolidated Email Report", "type": "main", "index": 0 } ]
      ]
    }
  }
}, null, 2);
