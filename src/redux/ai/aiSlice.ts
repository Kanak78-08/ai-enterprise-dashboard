import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  AIState,
  AISearchResponse,
  AISummaryResponse,
  AIRecommendation,
  ExplainChartResponse,
  DashboardFilters,
  SearchHistoryItem,
  SearchSuggestion,
  SavedQuery,
} from "../../types/ai";

const DEFAULT_SUGGESTIONS: SearchSuggestion[] = [
  { id: "1", text: "Show pending reports", icon: "⏳" },
  { id: "2", text: "Show failed reports", icon: "❌" },
  { id: "3", text: "Show completed reports this month", icon: "✅" },
  { id: "4", text: "Show high priority reports", icon: "🔴" },
  { id: "5", text: "Show reports created by John", icon: "👤" },
  { id: "6", text: "Dashboard summary", icon: "📊" },
  { id: "7", text: "Show sales reports", icon: "💰" },
  { id: "8", text: "Show analytics reports", icon: "📈" },
];

// Load saved queries from localStorage
function loadSavedQueries(): SavedQuery[] {
  try {
    const raw = localStorage.getItem("ai_saved_queries");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Load search history from localStorage
function loadSearchHistory(): SearchHistoryItem[] {
  try {
    const raw = localStorage.getItem("ai_search_history");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const initialState: AIState = {
  searchQuery: "",
  searchLoading: false,
  searchResults: null,
  searchHistory: loadSearchHistory(),
  suggestions: DEFAULT_SUGGESTIONS,

  activeFilters: {},
  filtersLoading: false,

  summary: null,
  summaryLoading: false,

  recommendations: [],
  recommendationsLoading: false,

  chartExplanation: null,
  chartExplanationLoading: false,
  explainModalOpen: false,

  savedQueries: loadSavedQueries(),

  error: null,
};

export const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    // ─── Search ────────────────────────────────────────────────────────
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.searchLoading = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<AISearchResponse | null>) => {
      state.searchResults = action.payload;
      state.searchLoading = false;
    },
    addSearchHistory: (state, action: PayloadAction<string>) => {
      const newItem: SearchHistoryItem = {
        id: Math.random().toString(36).slice(2, 10),
        query: action.payload,
        timestamp: Date.now(),
      };
      // Keep latest 5, remove duplicates
      state.searchHistory = [
        newItem,
        ...state.searchHistory.filter((h) => h.query !== action.payload),
      ].slice(0, 5);
      localStorage.setItem("ai_search_history", JSON.stringify(state.searchHistory));
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
      localStorage.removeItem("ai_search_history");
    },

    // ─── Filters ───────────────────────────────────────────────────────
    setActiveFilters: (state, action: PayloadAction<DashboardFilters>) => {
      state.activeFilters = action.payload;
      state.filtersLoading = false;
    },
    clearActiveFilters: (state) => {
      state.activeFilters = {};
    },
    removeFilter: (state, action: PayloadAction<string>) => {
      const key = action.payload as keyof DashboardFilters;
      delete state.activeFilters[key];
    },
    setFiltersLoading: (state, action: PayloadAction<boolean>) => {
      state.filtersLoading = action.payload;
    },

    // ─── Summary ───────────────────────────────────────────────────────
    setSummary: (state, action: PayloadAction<AISummaryResponse | null>) => {
      state.summary = action.payload;
      state.summaryLoading = false;
    },
    setSummaryLoading: (state, action: PayloadAction<boolean>) => {
      state.summaryLoading = action.payload;
    },

    // ─── Recommendations ──────────────────────────────────────────────
    setRecommendations: (state, action: PayloadAction<AIRecommendation[]>) => {
      state.recommendations = action.payload;
      state.recommendationsLoading = false;
    },
    setRecommendationsLoading: (state, action: PayloadAction<boolean>) => {
      state.recommendationsLoading = action.payload;
    },

    // ─── Chart Explanation ────────────────────────────────────────────
    setChartExplanation: (state, action: PayloadAction<ExplainChartResponse | null>) => {
      state.chartExplanation = action.payload;
      state.chartExplanationLoading = false;
    },
    setChartExplanationLoading: (state, action: PayloadAction<boolean>) => {
      state.chartExplanationLoading = action.payload;
    },
    setExplainModalOpen: (state, action: PayloadAction<boolean>) => {
      state.explainModalOpen = action.payload;
      if (!action.payload) {
        state.chartExplanation = null;
      }
    },

    // ─── Saved Queries ────────────────────────────────────────────────
    addSavedQuery: (state, action: PayloadAction<{ name: string; query: string }>) => {
      const newQuery: SavedQuery = {
        id: Math.random().toString(36).slice(2, 10),
        name: action.payload.name,
        query: action.payload.query,
        createdAt: Date.now(),
        usedCount: 0,
      };
      state.savedQueries.push(newQuery);
      localStorage.setItem("ai_saved_queries", JSON.stringify(state.savedQueries));
    },
    removeSavedQuery: (state, action: PayloadAction<string>) => {
      state.savedQueries = state.savedQueries.filter((q) => q.id !== action.payload);
      localStorage.setItem("ai_saved_queries", JSON.stringify(state.savedQueries));
    },
    renameSavedQuery: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const q = state.savedQueries.find((q) => q.id === action.payload.id);
      if (q) q.name = action.payload.name;
      localStorage.setItem("ai_saved_queries", JSON.stringify(state.savedQueries));
    },
    incrementSavedQueryUsage: (state, action: PayloadAction<string>) => {
      const q = state.savedQueries.find((q) => q.id === action.payload);
      if (q) q.usedCount++;
      localStorage.setItem("ai_saved_queries", JSON.stringify(state.savedQueries));
    },

    // ─── Error ────────────────────────────────────────────────────────
    setAIError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  setSearchLoading,
  setSearchResults,
  addSearchHistory,
  clearSearchHistory,
  setActiveFilters,
  clearActiveFilters,
  removeFilter,
  setFiltersLoading,
  setSummary,
  setSummaryLoading,
  setRecommendations,
  setRecommendationsLoading,
  setChartExplanation,
  setChartExplanationLoading,
  setExplainModalOpen,
  addSavedQuery,
  removeSavedQuery,
  renameSavedQuery,
  incrementSavedQueryUsage,
  setAIError,
} = aiSlice.actions;

export default aiSlice.reducer;
