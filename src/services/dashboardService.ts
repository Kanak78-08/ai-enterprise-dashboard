import apiClient from "./authService";
import type { Activity, ChartData } from "../types";

export const dashboardService = {
  getAnalytics: async () => {
    try {
      // Mock analytics data
      return {
        totalUsers: 1234,
        activeUsers: 856,
        totalRevenue: "$125,430",
        conversionRate: "3.24%",
      };
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  },

  getChartData: async (): Promise<ChartData[]> => {
    try {
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
      throw error;
    }
  },

  getActivities: async (): Promise<Activity[]> => {
    try {
      // Mock activities data
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
      throw error;
    }
  },

  getUsers: async () => {
    try {
      const response = await apiClient.get("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
};
