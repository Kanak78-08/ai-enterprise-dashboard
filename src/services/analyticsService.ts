import apiClient from "../api/axiosClient";
import type { AnalyticsData } from "../types";

export const analyticsService = {
  getAnalyticsData: async (): Promise<AnalyticsData[]> => {
    const response = await apiClient.get<AnalyticsData[]>("/analytics_data");
    return response.data;
  },
};
