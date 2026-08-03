import { Box, Chip, Typography, Fade } from "@mui/material";
import {
  FilterList as FilterIcon,
  Close as CloseIcon,
  AutoAwesome as AIIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { removeFilter, clearActiveFilters } from "../../redux/ai/aiSlice";
import type { DashboardFilters } from "../../types/ai";

interface ActiveFiltersProps {
  darkMode?: boolean;
}

const FILTER_LABELS: Record<keyof DashboardFilters, string> = {
  status: "Status",
  priority: "Priority",
  category: "Category",
  createdBy: "Created By",
  dateRange: "Date Range",
  startDate: "Start Date",
  endDate: "End Date",
};

const FILTER_COLORS: Record<string, string> = {
  status: "#5844FF",
  priority: "#EF4444",
  category: "#10B981",
  createdBy: "#F59E0B",
  dateRange: "#8B5CF6",
  startDate: "#06B6D4",
  endDate: "#EC4899",
};

export default function ActiveFilters({ darkMode = false }: ActiveFiltersProps) {
  const dispatch = useAppDispatch();
  const { activeFilters } = useAppSelector((state) => state.ai);

  const filterEntries = Object.entries(activeFilters).filter(
    ([, value]) => value !== undefined && value !== ""
  );

  if (filterEntries.length === 0) return null;

  return (
    <Fade in>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
          py: 1,
          px: 2,
          borderRadius: "12px",
          backgroundColor: darkMode
            ? "rgba(88,68,255,0.08)"
            : "rgba(88,68,255,0.04)",
          border: `1px solid ${darkMode ? "rgba(88,68,255,0.2)" : "rgba(88,68,255,0.1)"}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1 }}>
          <AIIcon sx={{ fontSize: 16, color: "#5844FF" }} />
          <FilterIcon sx={{ fontSize: 16, color: "#5844FF" }} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: "#5844FF",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            AI Filters
          </Typography>
        </Box>

        {filterEntries.map(([key, value]) => (
          <Chip
            key={key}
            label={`${FILTER_LABELS[key as keyof DashboardFilters] || key}: ${value}`}
            size="small"
            onDelete={() => dispatch(removeFilter(key))}
            deleteIcon={<CloseIcon sx={{ fontSize: "14px !important" }} />}
            sx={{
              backgroundColor: `${FILTER_COLORS[key] || "#5844FF"}15`,
              color: FILTER_COLORS[key] || "#5844FF",
              border: `1px solid ${FILTER_COLORS[key] || "#5844FF"}40`,
              fontWeight: 600,
              fontSize: "0.75rem",
              height: 28,
              "& .MuiChip-deleteIcon": {
                color: `${FILTER_COLORS[key] || "#5844FF"}80`,
                "&:hover": {
                  color: FILTER_COLORS[key] || "#5844FF",
                },
              },
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: `${FILTER_COLORS[key] || "#5844FF"}25`,
              },
            }}
          />
        ))}

        <Chip
          label="Clear All"
          size="small"
          variant="outlined"
          onClick={() => dispatch(clearActiveFilters())}
          sx={{
            color: darkMode ? "#999" : "#666",
            borderColor: darkMode ? "#555" : "#ddd",
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 28,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: darkMode
                ? "rgba(239,68,68,0.15)"
                : "rgba(239,68,68,0.08)",
              borderColor: "#EF4444",
              color: "#EF4444",
            },
          }}
        />
      </Box>
    </Fade>
  );
}
