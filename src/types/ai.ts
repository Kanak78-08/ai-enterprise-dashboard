// ─── AI Search Types ─────────────────────────────────────────────────────────

export type SearchIntent =
  | "FILTER_REPORTS"
  | "DASHBOARD_SUMMARY"
  | "SHOW_ANALYTICS"
  | "SHOW_USERS"
  | "GENERAL_QUERY";

export interface AISearchRequest {
  query: string;
}

export interface AISearchResponse {
  intent: SearchIntent;
  filters: DashboardFilters;
  message?: string;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  icon?: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
}

// ─── AI Filter Types ─────────────────────────────────────────────────────────

export interface DashboardFilters {
  status?: string;
  priority?: string;
  category?: string;
  createdBy?: string;
  dateRange?: string;
  startDate?: string;
  endDate?: string;
}

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

// ─── AI Summary Types ────────────────────────────────────────────────────────

export interface AISummaryRequest {
  dashboardData?: {
    totalReports: number;
    completedReports: number;
    pendingReports: number;
    failureRate: string;
  };
}

export interface AISummaryResponse {
  summary: string[];
  generatedAt: string;
  highlights?: {
    label: string;
    value: string;
    trend: "up" | "down" | "stable";
  }[];
}

// ─── AI Recommendation Types ─────────────────────────────────────────────────

export type RecommendationSeverity = "critical" | "warning" | "info" | "success";

export interface AIRecommendation {
  id: string;
  severity: RecommendationSeverity;
  title: string;
  description: string;
  suggestedAction: string;
  metric?: string;
  change?: string;
}

export interface AIRecommendationsResponse {
  recommendations: AIRecommendation[];
  generatedAt: string;
}

// ─── Explain Chart Types ─────────────────────────────────────────────────────

export type ChartType = "LINE" | "BAR" | "PIE" | "AREA";

export interface ExplainChartRequest {
  chartType: ChartType;
  chartTitle: string;
  data: Record<string, unknown>[];
}

export interface ExplainChartResponse {
  explanation: string;
  keyInsights: string[];
  trend?: string;
}

// ─── Saved Query Types ───────────────────────────────────────────────────────

export interface SavedQuery {
  id: string;
  name: string;
  query: string;
  createdAt: number;
  usedCount: number;
}

// ─── AI State (Redux) ────────────────────────────────────────────────────────

export interface AIState {
  // Search
  searchQuery: string;
  searchLoading: boolean;
  searchResults: AISearchResponse | null;
  searchHistory: SearchHistoryItem[];
  suggestions: SearchSuggestion[];

  // Filters
  activeFilters: DashboardFilters;
  filtersLoading: boolean;

  // Summary
  summary: AISummaryResponse | null;
  summaryLoading: boolean;

  // Recommendations
  recommendations: AIRecommendation[];
  recommendationsLoading: boolean;

  // Explain Chart
  chartExplanation: ExplainChartResponse | null;
  chartExplanationLoading: boolean;
  explainModalOpen: boolean;

  // Saved Queries
  savedQueries: SavedQuery[];

  // General
  error: string | null;
}
