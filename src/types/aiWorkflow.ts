// ─── AI Report Types ──────────────────────────────────────────────────────────
export type ReportType = "Weekly" | "Monthly" | "Quarterly" | "Annual";
export type DateRange = "Last 7 Days" | "Last 30 Days" | "Last 90 Days" | "Last Year";

export interface GenerateReportRequest {
  reportType: ReportType;
  dateRange: DateRange;
  team?: string;
  category?: string;
}

export interface ReportSection {
  title: string;
  content: string;
}

export interface GeneratedReport {
  id: string;
  title: string;
  reportType: ReportType;
  dateRange: DateRange;
  team?: string;
  generatedAt: string;
  sections: ReportSection[];
}

// ─── AI Form Autofill Types ───────────────────────────────────────────────────
export interface AutofillRequest { prompt: string; }
export interface AutofillResponse {
  title: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  category: string;
  plant?: string;
  dateRange?: string;
  description?: string;
  team?: string;
}

// ─── AI Email Types ───────────────────────────────────────────────────────────
export type EmailContext = "Share Weekly Dashboard" | "Monthly Report Summary" | "Failure Alert" | "Performance Update" | "Custom";

export interface GenerateEmailRequest {
  context: EmailContext;
  customContext?: string;
  recipientName?: string;
  senderName?: string;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
  generatedAt: string;
}

// ─── AI Notification Types ────────────────────────────────────────────────────
export type NotificationType = "success" | "warning" | "critical" | "info";

export interface GenerateNotificationRequest {
  type: NotificationType;
  context: string;
}

export interface GeneratedNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  action?: string;
  generatedAt: string;
}

// ─── Prompt Library Types ─────────────────────────────────────────────────────
export type PromptCategory = "Reports" | "Analytics" | "Operations" | "Communication" | "Custom";

export interface PromptTemplate {
  id: string;
  name: string;
  prompt: string;
  category: PromptCategory;
  isFavorite: boolean;
  usedCount: number;
  lastUsed?: number;
  createdAt: number;
}

// ─── Conversation Types ───────────────────────────────────────────────────────
export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ConversationMessage[];
  createdAt: number;
  updatedAt: number;
}

export type ConversationGroup = "Today" | "Yesterday" | "Last Week" | "Older";
