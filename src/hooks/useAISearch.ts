/**
 * useAISearch – Custom hook for AI-powered search with debouncing.
 *
 * Features:
 *   • Debounced search (400ms delay)
 *   • Search history management
 *   • Suggestions filtering
 *   • Request cancellation on unmount
 */

import { useCallback, useRef, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setSearchQuery,
  setSearchLoading,
  setSearchResults,
  addSearchHistory,
  setActiveFilters,
  setAIError,
} from "../redux/ai/aiSlice";
import { aiSearch } from "../services/aiFilterService";
import type { RootState } from "../redux/store";

export function useAISearch() {
  const dispatch = useAppDispatch();
  const {
    searchQuery,
    searchLoading,
    searchResults,
    searchHistory,
    suggestions,
    error,
  } = useAppSelector((state: RootState) => state.ai);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current = true;
    };
  }, []);

  // Filter suggestions based on current query
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return suggestions;
    const q = searchQuery.toLowerCase();
    return suggestions.filter((s) => s.text.toLowerCase().includes(q));
  }, [searchQuery, suggestions]);

  // Debounced search handler
  const handleSearch = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!query.trim()) {
        dispatch(setSearchResults(null));
        dispatch(setActiveFilters({}));
        return;
      }

      debounceRef.current = setTimeout(async () => {
        dispatch(setSearchLoading(true));
        dispatch(setAIError(null));
        abortRef.current = false;

        try {
          const result = await aiSearch(query);
          if (!abortRef.current) {
            dispatch(setSearchResults(result));
            dispatch(addSearchHistory(query));

            // Automatically apply filters from search result
            if (result.filters && Object.keys(result.filters).length > 0) {
              dispatch(setActiveFilters(result.filters));
            }
          }
        } catch (err) {
          if (!abortRef.current) {
            dispatch(setAIError("Search failed. Please try again."));
            dispatch(setSearchLoading(false));
          }
        }
      }, 400);
    },
    [dispatch]
  );

  // Execute search immediately (for clicking on suggestion or saved query)
  const executeSearch = useCallback(
    async (query: string) => {
      dispatch(setSearchQuery(query));
      dispatch(setSearchLoading(true));
      dispatch(setAIError(null));

      try {
        const result = await aiSearch(query);
        dispatch(setSearchResults(result));
        dispatch(addSearchHistory(query));

        if (result.filters && Object.keys(result.filters).length > 0) {
          dispatch(setActiveFilters(result.filters));
        }
      } catch (err) {
        dispatch(setAIError("Search failed. Please try again."));
        dispatch(setSearchLoading(false));
      }
    },
    [dispatch]
  );

  const clearSearch = useCallback(() => {
    dispatch(setSearchQuery(""));
    dispatch(setSearchResults(null));
    dispatch(setActiveFilters({}));
  }, [dispatch]);

  return {
    searchQuery,
    searchLoading,
    searchResults,
    searchHistory,
    filteredSuggestions,
    error,
    handleSearch,
    executeSearch,
    clearSearch,
  };
}
