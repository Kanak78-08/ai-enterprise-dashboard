import axiosClient from "../api/axiosClient";
import type {
  AISearchResponse,
  AISummaryResponse,
  AIRecommendationsResponse,
  ExplainChartRequest,
  ExplainChartResponse,
  DashboardFilters,
} from "../types/ai";

const api = axiosClient;

export async function aiSearch(query: string): Promise<AISearchResponse> {
  const response = await api.post("/api/ai/search", { query });
  return response.data;
}

export async function aiDashboardSummary(filters: DashboardFilters = {}): Promise<AISummaryResponse> {
  const response = await api.post("/api/ai/dashboard-summary", { filters });
  return response.data;
}

export async function aiRecommendations(filters: DashboardFilters = {}): Promise<AIRecommendationsResponse> {
  const response = await api.post("/api/ai/recommendations", { filters });
  return response.data;
}

export async function aiExplainChart(
  req: ExplainChartRequest
): Promise<ExplainChartResponse> {
  const response = await api.post("/api/ai/explain-chart", req);
  return response.data;
}
