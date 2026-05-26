import apiClient from "./authService";
import type { Activity, ChartData, Notification, Insight, DashboardStat } from "../types";

export const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStat> => {
    try {
      const res = await apiClient.get("/dashboardStats");
      return res.data;
    } catch (error) {
      console.warn("Falling back to mock dashboard stats", error);
      return {
        totalReports: 18420,
        completedReports: 17350,
        pendingReports: 760,
        failureRate: 4.1,
      };
    }
  },

  getChartData: async (): Promise<ChartData[]> => {
    try {
      const res = await apiClient.get("/chartData");
      return res.data;
    } catch (error) {
      console.warn("Falling back to mock chart data", error);
      return [
        { name: "Mon", reports: 240, users: 120, revenue: 2400 },
        { name: "Tue", reports: 300, users: 150, revenue: 3200 },
        { name: "Wed", reports: 280, users: 140, revenue: 3000 },
        { name: "Thu", reports: 350, users: 170, revenue: 3600 },
        { name: "Fri", reports: 420, users: 210, revenue: 4200 },
        { name: "Sat", reports: 500, users: 260, revenue: 5000 },
        { name: "Sun", reports: 380, users: 190, revenue: 3800 },
      ];
    }
  },

  getActivities: async (): Promise<Activity[]> => {
    try {
      const res = await apiClient.get("/activities?_sort=timestamp&_order=desc");
      return res.data;
    } catch (error) {
      console.warn("Falling back to mock activities", error);
      return [
        { id: 1, user: "Kanak Sharma", action: "Created Report", status: "Completed", timestamp: "2 hours ago" },
        { id: 2, user: "Aditya Patel", action: "Updated Dashboard", status: "Pending", timestamp: "30 minutes ago" },
      ];
    }
  },

  getNotifications: async (): Promise<Notification[]> => {
    try {
      const res = await apiClient.get("/notifications");
      return res.data;
    } catch (error) {
      console.warn("Falling back to mock notifications", error);
      return [];
    }
  },

  getInsights: async (): Promise<Insight[]> => {
    try {
      const res = await apiClient.get("/insights");
      return res.data;
    } catch (error) {
      console.warn("Falling back to mock insights", error);
      return [
        { id: 1, title: "Failure rate improved", summary: "Failure rate improved by 12% after deployment.", trend: "improving" },
        { id: 2, title: "Peak activity detected", summary: "Peak activity detected on Tuesday with 20% higher throughput.", trend: "spike" },
      ];
    }
  },
};
