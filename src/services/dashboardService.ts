import axiosClient from "../api/axiosClient";
import type { Activity, ChartData } from "../types";

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
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await axiosClient.get('/reports');
      const reports = response.data || [];
      const totalReports = reports.length;
      const completedReports = reports.filter((r: any) => r.status === 'Completed').length;
      const pendingReports = reports.filter((r: any) => r.status === 'Pending').length;
      const failedReports = reports.filter((r: any) => r.status === 'Failed').length;
      const failureRate = totalReports ? ((failedReports / totalReports) * 100).toFixed(1) + '%' : '0%';

      return {
        totalReports,
        completedReports,
        pendingReports,
        failureRate,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw new Error("Failed to fetch dashboard statistics", { cause: error });
    }
  },

  getChartData: async (): Promise<ChartData[]> => {
    try {
      // Return static chart data since db doesn't have time series for this specifically,
      // but we could also group reports by date if we wanted to.
      return [
        { name: "Mon", reports: 40, users: 24, revenue: 240 },
        { name: "Tue", reports: 30, users: 22, revenue: 221 },
        { name: "Wed", reports: 50, users: 29, revenue: 229 },
        { name: "Thu", reports: 20, users: 20, revenue: 200 },
        { name: "Fri", reports: 70, users: 32, revenue: 281 },
        { name: "Sat", reports: 55, users: 30, revenue: 250 },
        { name: "Sun", reports: 45, users: 28, revenue: 210 },
      ];
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
