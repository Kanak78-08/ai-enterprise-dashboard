import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { TipsAndUpdates as SuggestIcon } from "@mui/icons-material";
import type { SearchSuggestion } from "../../types/ai";

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSelect: (query: string) => void;
  darkMode?: boolean;
}

export default function SearchSuggestions({
  suggestions,
  onSelect,
  darkMode = false,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <Box sx={{ py: 1 }}>
      <Typography
        variant="overline"
        sx={{
          px: 2,
          pb: 0.5,
          display: "block",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: darkMode ? "#888" : "#999",
          textTransform: "uppercase",
        }}
      >
        💡 Suggestions
      </Typography>
      <List dense disablePadding>
        {suggestions.map((suggestion) => (
          <ListItemButton
            key={suggestion.id}
            onClick={() => onSelect(suggestion.text)}
            sx={{
              px: 2,
              py: 0.75,
              borderRadius: "8px",
              mx: 1,
              transition: "all 0.15s ease",
              "&:hover": {
                backgroundColor: darkMode
                  ? "rgba(88,68,255,0.15)"
                  : "rgba(88,68,255,0.06)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <SuggestIcon
                sx={{ fontSize: 18, color: "#F59E0B" }}
              />
            </ListItemIcon>
            <ListItemText
              primary={suggestion.text}
                {...({ primaryTypographyProps: {
                  fontSize: "0.85rem",
                  color: darkMode ? "#e2e2e2" : "#1a1a1a",
                  fontWeight: 500,
                }} as any)}
            />
            {suggestion.icon && (
              <Typography sx={{ fontSize: "1rem", ml: 1 }}>
                {suggestion.icon}
              </Typography>
            )}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
