import axiosClient from "../api/axiosClient";
import type { Activity, ChartData } from "../types";
import type { DashboardFilters } from "../types/ai";

const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const normalizeText = (value: unknown) => String(value ?? "").trim().toLowerCase();
const parseDateValue = (value: unknown): Date | null => {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
};

const buildReportFilters = (reports: any[], filters: DashboardFilters = {}) => {
  if (!filters || Object.keys(filters).length === 0) return reports;

  return reports.filter((report) => {
    if (filters.status && normalizeText(report.status) !== normalizeText(filters.status)) {
      return false;
    }
    if (filters.priority && normalizeText(report.priority) !== normalizeText(filters.priority)) {
      return false;
    }
    if (filters.category && normalizeText(report.category) !== normalizeText(filters.category)) {
      return false;
    }
    if (
      filters.createdBy &&
      !normalizeText(report.createdBy).includes(normalizeText(filters.createdBy))
    ) {
      return false;
    }
    if (filters.dateRange) {
      const createdDate = parseDateValue(report.createdDate || report.startDate || report.endDate);
      if (!createdDate) return false;

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfThisWeek = new Date(startOfToday);
      startOfThisWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      const normalizedRange = normalizeText(filters.dateRange);

      if (normalizedRange.includes("today") && createdDate < startOfToday) return false;
      if (normalizedRange.includes("this week") && createdDate < startOfThisWeek) return false;
      if (
        normalizedRange.includes("last week") &&
        (createdDate < startOfLastWeek || createdDate >= startOfThisWeek)
      ) {
        return false;
      }
      if (normalizedRange.includes("this month") && createdDate < startOfThisMonth) return false;
      if (
        normalizedRange.includes("last month") &&
        (createdDate < startOfLastMonth || createdDate > endOfLastMonth)
      ) {
        return false;
      }
    }
    if (filters.startDate) {
      const startFilter = parseDateValue(filters.startDate);
      const createdDate = parseDateValue(report.createdDate || report.startDate);
      if (startFilter && createdDate && createdDate < startFilter) return false;
    }
    if (filters.endDate) {
      const endFilter = parseDateValue(filters.endDate);
      const createdDate = parseDateValue(report.createdDate || report.endDate);
      if (endFilter && createdDate && createdDate > endFilter) return false;
    }

    return true;
  });
};

const buildDashboardStats = (reports: any[]): DashboardStats => {
  const totalReports = reports.length;
  const completedReports = reports.filter((r: any) => normalizeText(r.status) === "completed").length;
  const pendingReports = reports.filter((r: any) => normalizeText(r.status) === "pending").length;
  const failedReports = reports.filter((r: any) => normalizeText(r.status) === "failed").length;
  const failureRate = totalReports ? `${((failedReports / totalReports) * 100).toFixed(1)}%` : "0%";

  return {
    totalReports,
    completedReports,
    pendingReports,
    failureRate,
  };
};

const buildChartDataFromReports = (reports: any[]): ChartData[] => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dataMap = new Map<string, { reports: number; users: Set<string>; revenue: number }>();

  days.forEach((day) => dataMap.set(day, { reports: 0, users: new Set(), revenue: 0 }));

  reports.forEach((report) => {
    const reportDate = parseDateValue(report.createdDate || report.startDate || report.endDate);
    const dayKey = reportDate ? days[reportDate.getDay()] : "Mon";
    const entry = dataMap.get(dayKey);
    if (!entry) return;

    entry.reports += 1;
    entry.users.add(report.createdBy || "Unknown");
    entry.revenue += report.priority === "High" ? 40 : report.priority === "Medium" ? 25 : 15;
  });

  return days.map((day) => ({
    name: day,
    reports: dataMap.get(day)?.reports ?? 0,
    users: dataMap.get(day)?.users.size ?? 0,
    revenue: dataMap.get(day)?.revenue ?? 0,
  }));
}

export interface DashboardStats {
  totalReports: number;
  completedReports: number;
  pendingReports: number;
  failureRate: string;
}

export interface Notification {
  id: number;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp?: string;
}

export interface Insight {
  id: number;
  text: string;
  metric?: string;
  change?: string;
}

export const dashboardService = {
  getDashboardStats: async (filters: DashboardFilters = {}): Promise<DashboardStats> => {
    try {
      const response = await axiosClient.get('/reports');
      const reports = response.data || [];
      return buildDashboardStats(buildReportFilters(reports, filters));
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw new Error("Failed to fetch dashboard statistics", { cause: error });
    }
  },

  getChartData: async (filters: DashboardFilters = {}): Promise<ChartData[]> => {
    try {
      const response = await axiosClient.get("/reports");
      const reports = response.data || [];
      const filteredReports = buildReportFilters(reports, filters);
      return buildChartDataFromReports(filteredReports);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      throw new Error("Failed to fetch chart data", { cause: error });
    }
  },

  getActivities: async (): Promise<Activity[]> => {
    try {
      const response = await axiosClient.get('/activities?_sort=timestamp&_order=desc&_limit=5');
      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw new Error("Failed to fetch activities", { cause: error });
    }
  },

  /**
   * Fetch notifications
   */
  getNotifications: async (): Promise<Notification[]> => {
    try {
      await simulateDelay(700);
      // Mock notifications from db.json
      return [
        {
          id: 1,
          message: "High failure rate detected",
          type: "warning",
          timestamp: "5 minutes ago",
        },
        {
          id: 2,
          message: "Weekly report generated",
          type: "success",
          timestamp: "30 minutes ago",
        },
        {
          id: 3,
          message: "System maintenance scheduled",
          type: "info",
          timestamp: "1 hour ago",
        },
      ];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw new Error("Failed to fetch notifications", { cause: error });
    }
  },

  /**
   * Fetch key insights
   */
  getInsights: async (): Promise<Insight[]> => {
    try {
      await simulateDelay(750);
      // Mock insights from db.json
      return [
        {
          id: 1,
          text: "Failure rate improved by 12%",
          change: "+12% improvement",
        },
        {
          id: 2,
          text: "Peak activity occurred on Tuesday",
          change: "High engagement",
        },
        {
          id: 3,
          text: "Completion rate at all-time high",
          change: "+8% from last week",
        },
      ];
    } catch (error) {
      console.error("Error fetching insights:", error);
      throw new Error("Failed to fetch insights", { cause: error });
    }
  },

  /**
   * Legacy method for backwards compatibility
   */
  getAnalytics: async () => {
    try {
      await simulateDelay();
      return {
        totalUsers: 1234,
        activeUsers: 856,
        totalRevenue: "$125,430",
        conversionRate: "3.24%",
      };
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw new Error("Failed to fetch analytics", { cause: error });
    }
  },

  /**
   * Retry mechanism for failed API calls
   */
  retryWithBackoff: async <T,>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> => {
    let lastError: Error = new Error("Unknown error");

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (i < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, delayMs * Math.pow(2, i))
          );
        }
      }
    }

    throw lastError;
  },
};
