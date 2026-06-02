import type { Activity, ChartData } from "../types";

// Simulated API delay for realistic loading states
const simulateDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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
  /**
   * Fetch dashboard statistics (KPI data)
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      await simulateDelay();
      // Mock dashboard stats from db.json
      return {
        totalReports: 1248,
        completedReports: 1100,
        pendingReports: 98,
        failureRate: "4.3%",
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw new Error("Failed to fetch dashboard statistics", { cause: error });
    }
  },

  /**
   * Fetch chart data for analytics
   */
  getChartData: async (): Promise<ChartData[]> => {
    try {
      await simulateDelay();
      // Mock chart data
      return [
        { name: "Mon", reports: 400, users: 240, revenue: 2400 },
        { name: "Tue", reports: 300, users: 221, revenue: 2210 },
        { name: "Wed", reports: 500, users: 229, revenue: 2290 },
        { name: "Thu", reports: 200, users: 200, revenue: 2000 },
        { name: "Fri", reports: 700, users: 320, revenue: 2181 },
        { name: "Sat", reports: 550, users: 300, revenue: 2500 },
        { name: "Sun", reports: 450, users: 278, revenue: 2100 },
      ];
    } catch (error) {
      console.error("Error fetching chart data:", error);
      throw new Error("Failed to fetch chart data", { cause: error });
    }
  },

  /**
   * Fetch recent activities
   */
  getActivities: async (): Promise<Activity[]> => {
    try {
      await simulateDelay(600);
      // Mock activities data from db.json
      return [
        {
          id: 1,
          user: "Kanak Sharma",
          action: "Created Report",
          status: "Completed",
          timestamp: "2 hours ago",
        },
        {
          id: 2,
          user: "Aditya Patel",
          action: "Updated Dashboard",
          status: "Pending",
          timestamp: "30 minutes ago",
        },
        {
          id: 3,
          user: "Abhishek Kumar",
          action: "Deleted Analytics",
          status: "Completed",
          timestamp: "1 hour ago",
        },
        {
          id: 4,
          user: "Priya Singh",
          action: "Generated Report",
          status: "Completed",
          timestamp: "45 minutes ago",
        },
        {
          id: 5,
          user: "Raj Verma",
          action: "Updated Settings",
          status: "Completed",
          timestamp: "3 hours ago",
        },
      ];
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
