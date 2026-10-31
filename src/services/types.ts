export type EmailCategory = 'Important' | 'Work' | 'Personal' | 'Promotional' | 'Finance' | 'Updates';
export type EmailPriority = 'High' | 'Medium' | 'Low';
export type EmailStatus = 'Analyzed' | 'Summary Generated' | 'Action Required' | 'Archived';
export type Sentiment = 'Positive' | 'Neutral' | 'Urgent' | 'Formal';

export interface ActionItem {
  id: string;
  text: string;
  deadline?: string;
  completed?: boolean;
}

export interface DetectedMeeting {
  title: string;
  time: string;
  organizer?: string;
  location?: string;
}

export interface Email {
  id: string;
  sender: {
    name: string;
    email: string;
    avatar?: string;
  };
  subject: string;
  snippet: string;
  body: string;
  category: EmailCategory;
  priority: EmailPriority;
  receivedDate: string; // ISO string
  status: EmailStatus;
  isRead: boolean;
  isStarred: boolean;
  aiSummary: string;
  actionItems: ActionItem[];
  detectedMeetings: DetectedMeeting[];
  sentiment: Sentiment;
  suggestedReplies: string[];
}

export interface InsightItem {
  id: string;
  type: 'deadline' | 'meeting' | 'urgent' | 'announcement';
  title: string;
  description: string;
  sourceEmailId: string;
  sender: string;
  date: string;
  dueDate?: string;
  urgency: 'critical' | 'moderate' | 'info';
  isResolved?: boolean;
}

export interface DailySummary {
  id: string;
  date: string; // YYYY-MM-DD
  formattedDate: string;
  overview: string;
  totalEmails: number;
  importantCount: number;
  actionItemCount: number;
  highlights: string[];
  pendingTasks: {
    id: string;
    task: string;
    from: string;
    deadline: string;
    priority: EmailPriority;
    completed: boolean;
  }[];
  meetings: {
    id: string;
    title: string;
    time: string;
    platform: string;
    organizer: string;
  }[];
  keyAnnouncements: {
    id: string;
    headline: string;
    summary: string;
    department: string;
  }[];
  sentimentScore: number;
  generatedAt: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'Daily Digest' | 'Weekly Executive Brief' | 'Inbox Audit' | 'Monthly Review';
  generatedDate: string;
  status: 'Ready' | 'Sent' | 'Scheduled';
  recipient: string;
  emailCount: number;
  fileSize: string;
  summary: string;
  contentMarkdown: string;
}

export interface AnalyticsData {
  activity7Days: {
    date: string;
    day: string;
    received: number;
    analyzed: number;
    important: number;
  }[];
  categoryDistribution: {
    name: string;
    value: number;
    color: string;
    count: number;
  }[];
  stats: {
    totalEmailsAnalyzed: number;
    totalAnalyzed?: number;
    importantEmails: number;
    unreadEmails: number;
    reportsGenerated: number;
    timeSavedHours: number;
    averageLatencyMs: number;
    accuracyRate: number;
  };
}

export interface AppSettings {
  gmailConnected: boolean;
  gmailAccount: string;
  n8nConnected: boolean;
  n8nWebhookUrl: string;
  reportFrequency: 'Daily' | 'Weekly' | 'Monthly';
  reportDeliveryTime: string;
  reportRecipient: string;
  aiSummaryTone: 'concise' | 'detailed';
  autoArchivePromotions: boolean;
  urgentDesktopAlerts: boolean;
  emailNotifications: boolean;
  isDemoMode: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  organization: string;
  avatarUrl: string;
  connectedSince: string;
  timezone: string;
  emailsProcessedAllTime: number;
  reportsSentAllTime: number;
}
