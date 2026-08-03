/**
 * useAIDashboard – Custom hook for AI dashboard features:
 *   • Summary generation & refresh
 *   • Recommendations generation
 *   • Chart explanation
 *   • Response caching (in-memory)
 */

import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setSummary,
  setSummaryLoading,
  setRecommendations,
  setRecommendationsLoading,
  setChartExplanation,
  setChartExplanationLoading,
  setExplainModalOpen,
  setAIError,
} from "../redux/ai/aiSlice";
import {
  aiDashboardSummary,
  aiRecommendations,
  aiExplainChart,
} from "../services/aiFilterService";
import type { ExplainChartRequest, DashboardFilters } from "../types/ai";
import type { RootState } from "../redux/store";

// Simple in-memory cache for chart explanations
const chartExplanationCache = new Map<string, any>();

export function useAIDashboard() {
  const dispatch = useAppDispatch();
  const {
    summary,
    summaryLoading,
    recommendations,
    recommendationsLoading,
    chartExplanation,
    chartExplanationLoading,
    explainModalOpen,
    activeFilters,
  } = useAppSelector((state: RootState) => state.ai);

  const summaryAbort = useRef(false);

  // ─── Generate / Refresh Summary ──────────────────────────────────────
  const generateSummary = useCallback(
    async (filters: DashboardFilters = {}) => {
      dispatch(setSummaryLoading(true));
      dispatch(setAIError(null));
      summaryAbort.current = false;

      try {
        const result = await aiDashboardSummary(filters);
        if (!summaryAbort.current) {
          dispatch(setSummary(result));
        }
      } catch (err) {
        if (!summaryAbort.current) {
          dispatch(setAIError("Failed to generate summary."));
          dispatch(setSummaryLoading(false));
        }
      }
    },
    [dispatch]
  );

  // ─── Generate Recommendations ────────────────────────────────────────
  const generateRecommendations = useCallback(
    async (filters: DashboardFilters = {}) => {
      dispatch(setRecommendationsLoading(true));
      dispatch(setAIError(null));

      try {
        const result = await aiRecommendations(filters);
        dispatch(setRecommendations(result.recommendations));
      } catch (err) {
        dispatch(setAIError("Failed to generate recommendations."));
        dispatch(setRecommendationsLoading(false));
      }
    },
    [dispatch]
  );

  // ─── Explain Chart ───────────────────────────────────────────────────
  const explainChart = useCallback(
    async (req: ExplainChartRequest) => {
      dispatch(setExplainModalOpen(true));
      dispatch(setChartExplanationLoading(true));
      dispatch(setAIError(null));

      // Check cache
      const cacheKey = `${req.chartType}_${req.chartTitle}_${JSON.stringify(req.data)}`;
      if (chartExplanationCache.has(cacheKey)) {
        dispatch(setChartExplanation(chartExplanationCache.get(cacheKey)));
        return;
      }

      try {
        const result = await aiExplainChart(req);
        chartExplanationCache.set(cacheKey, result);
        dispatch(setChartExplanation(result));
      } catch (err) {
        dispatch(setAIError("Failed to explain chart."));
        dispatch(setChartExplanationLoading(false));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    generateSummary(activeFilters);
    generateRecommendations(activeFilters);
  }, [activeFilters, generateSummary, generateRecommendations]);

  const closeExplainModal = useCallback(() => {
    dispatch(setExplainModalOpen(false));
  }, [dispatch]);

  return {
    // Summary
    summary,
    summaryLoading,
    generateSummary,

    // Recommendations
    recommendations,
    recommendationsLoading,
    generateRecommendations,

    // Chart Explanation
    chartExplanation,
    chartExplanationLoading,
    explainModalOpen,
    explainChart,
    closeExplainModal,
  };
}
