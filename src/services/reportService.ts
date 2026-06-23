import apiClient from "../api/axiosClient";
import type { Report } from "../types";

export const reportService = {
  getReports: async (): Promise<Report[]> => {
    const response = await apiClient.get<Report[]>("/reports");
    return response.data;
  },

  getReportById: async (id: string): Promise<Report> => {
    const response = await apiClient.get<Report>(`/reports/${id}`);
    return response.data;
  },

  createReport: async (report: Omit<Report, "id">): Promise<Report> => {
    const response = await apiClient.post<Report>("/reports", report);
    return response.data;
  },

  updateReport: async (id: string, report: Partial<Report>): Promise<Report> => {
    const response = await apiClient.patch<Report>(`/reports/${id}`, report);
    return response.data;
  },

  deleteReport: async (id: string): Promise<void> => {
    await apiClient.delete(`/reports/${id}`);
  },
};
