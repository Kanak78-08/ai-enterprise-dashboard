import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { History as HistoryIcon } from "@mui/icons-material";
import type { SearchHistoryItem } from "../../types/ai";

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelect: (query: string) => void;
  darkMode?: boolean;
}

export default function SearchHistory({
  history,
  onSelect,
  darkMode = false,
}: SearchHistoryProps) {
  if (history.length === 0) return null;

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

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
        🕐 Recent Searches
      </Typography>
      <List dense disablePadding>
        {history.map((item) => (
          <ListItemButton
            key={item.id}
            onClick={() => onSelect(item.query)}
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
              <HistoryIcon
                sx={{ fontSize: 18, color: darkMode ? "#666" : "#bbb" }}
              />
            </ListItemIcon>
            <ListItemText
              primary={item.query}
              {...({ primaryTypographyProps: {
                fontSize: "0.85rem",
                color: darkMode ? "#e2e2e2" : "#1a1a1a",
                fontWeight: 500,
              }} as any)}
            />
            <Typography
              variant="caption"
              sx={{ color: darkMode ? "#555" : "#bbb", fontSize: "0.7rem" }}
            >
              {formatTime(item.timestamp)}
            </Typography>
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ borderColor: darkMode ? "#333" : "#eee", mx: 2, my: 0.5 }} />
    </Box>
  );
}
