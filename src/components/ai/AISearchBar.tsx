import { useState, useRef, useEffect } from "react";
import {
  Box,
  InputBase,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Chip,
  Fade,
  ClickAwayListener,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  AutoAwesome as AIIcon,
} from "@mui/icons-material";
import { useAISearch } from "../../hooks/useAISearch";
import SearchSuggestions from "./SearchSuggestions";
import SearchHistory from "./SearchHistory";

interface AISearchBarProps {
  darkMode?: boolean;
}

export default function AISearchBar({ darkMode = false }: AISearchBarProps) {
  const {
    searchQuery,
    searchLoading,
    searchResults,
    searchHistory,
    filteredSuggestions,
    handleSearch,
    executeSearch,
    clearSearch,
  } = useAISearch();

  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const showDropdown = focused && searchQuery.length === 0;
  const showSuggestions = focused && searchQuery.length > 0 && !searchLoading;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const bgColor = darkMode ? "rgba(255,255,255,0.06)" : "rgba(88,68,255,0.04)";
  const borderColor = focused
    ? darkMode
      ? "#7c6aff"
      : "#5844FF"
    : darkMode
    ? "rgba(255,255,255,0.1)"
    : "rgba(88,68,255,0.15)";
  const textColor = darkMode ? "#e2e2e2" : "#1a1a1a";

  return (
    <ClickAwayListener onClickAway={() => setFocused(false)}>
      <Box sx={{ position: "relative", width: "100%", maxWidth: 640 }}>
        {/* Search Input */}
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.75,
            borderRadius: "16px",
            border: `1.5px solid ${borderColor}`,
            backgroundColor: bgColor,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: focused
              ? darkMode
                ? "0 0 0 3px rgba(124,106,255,0.15), 0 8px 32px rgba(0,0,0,0.3)"
                : "0 0 0 3px rgba(88,68,255,0.1), 0 8px 32px rgba(88,68,255,0.08)"
              : "none",
            "&:hover": {
              borderColor: darkMode ? "#7c6aff" : "#5844FF",
              backgroundColor: darkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(88,68,255,0.06)",
            },
          }}
        >
          {searchLoading ? (
            <CircularProgress size={20} sx={{ color: "#5844FF" }} />
          ) : (
            <AIIcon
              sx={{
                color: focused ? "#5844FF" : darkMode ? "#888" : "#999",
                fontSize: 22,
                transition: "color 0.2s ease",
              }}
            />
          )}

          <InputBase
            inputRef={inputRef}
            placeholder="Ask AI to search... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            sx={{
              flex: 1,
              fontSize: "0.95rem",
              color: textColor,
              "& input::placeholder": {
                color: darkMode ? "#888" : "#999",
                opacity: 1,
              },
            }}
            id="ai-search-input"
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                executeSearch(searchQuery);
                setFocused(false);
              }
              if (e.key === "Escape") {
                setFocused(false);
                inputRef.current?.blur();
              }
            }}
          />

          {searchQuery && (
            <IconButton
              size="small"
              onClick={clearSearch}
              sx={{
                color: darkMode ? "#888" : "#999",
                "&:hover": { color: "#EF4444" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}

          <Chip
            label="AI"
            size="small"
            sx={{
              background: "linear-gradient(135deg, #5844FF 0%, #7c6aff 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.7rem",
              height: 24,
              "& .MuiChip-label": { px: 1 },
            }}
          />
        </Paper>

        {/* Search Result Message */}
        {searchResults?.message && !focused && (
          <Fade in>
            <Box
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <SearchIcon sx={{ fontSize: 16, color: "#5844FF" }} />
              <Typography
                variant="body2"
                sx={{ color: darkMode ? "#aaa" : "#666", fontSize: "0.8rem" }}
              >
                {searchResults.message}
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Dropdown: History + Suggestions */}
        <Fade in={showDropdown || showSuggestions}>
          <Paper
            elevation={8}
            sx={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              zIndex: 1300,
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: darkMode ? "#1e1e2e" : "#fff",
              border: `1px solid ${darkMode ? "#333" : "#e5e7eb"}`,
              boxShadow: darkMode
                ? "0 16px 48px rgba(0,0,0,0.5)"
                : "0 16px 48px rgba(0,0,0,0.12)",
              display:
                showDropdown || showSuggestions ? "block" : "none",
            }}
          >
            {showDropdown && searchHistory.length > 0 && (
              <SearchHistory
                history={searchHistory}
                onSelect={(query) => {
                  executeSearch(query);
                  setFocused(false);
                }}
                darkMode={darkMode}
              />
            )}

            <SearchSuggestions
              suggestions={
                showSuggestions ? filteredSuggestions : filteredSuggestions.slice(0, 5)
              }
              onSelect={(query) => {
                executeSearch(query);
                setFocused(false);
              }}
              darkMode={darkMode}
            />
          </Paper>
        </Fade>
      </Box>
    </ClickAwayListener>
  );
}
