import { useEffect, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Stack, Typography } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearActiveFilters, setActiveFilters } from "../../redux/ai/aiSlice";
import type { DashboardFilters } from "../../types/ai";

const STATUS_OPTIONS = ["", "Completed", "Pending", "Failed"];
const PRIORITY_OPTIONS = ["", "High", "Medium", "Low"];
const CATEGORY_OPTIONS = ["", "Sales", "Operations", "Analytics", "Maintenance"];
const DATE_RANGE_OPTIONS = ["", "Today", "This Week", "Last Week", "This Month", "Last Month"];

interface FilterToolbarProps {
  darkMode?: boolean;
}

export default function FilterToolbar({ darkMode = false }: FilterToolbarProps) {
  const dispatch = useAppDispatch();
  const { activeFilters } = useAppSelector((state) => state.ai);

  const [filters, setFilters] = useState<DashboardFilters>({
    status: activeFilters.status || "",
    category: activeFilters.category || "",
    priority: activeFilters.priority || "",
    dateRange: activeFilters.dateRange || "",
    createdBy: activeFilters.createdBy || "",
  });

  useEffect(() => {
    setFilters({
      status: activeFilters.status || "",
      category: activeFilters.category || "",
      priority: activeFilters.priority || "",
      dateRange: activeFilters.dateRange || "",
      createdBy: activeFilters.createdBy || "",
    });
  }, [activeFilters]);

  const updateFilters = (key: keyof DashboardFilters, value: string) => {
    const next = { ...filters, [key]: value || undefined };
    setFilters(next);
    dispatch(setActiveFilters(next));
  };

  const handleClear = () => {
    setFilters({});
    dispatch(clearActiveFilters());
  };

  const fieldStyles = {
    minWidth: 140,
    backgroundColor: darkMode ? "#1b1b28" : "#fff",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        py: 2,
        px: 2,
        borderRadius: "16px",
        backgroundColor: darkMode ? "rgba(255,255,255,0.04)" : "rgba(88,68,255,0.04)",
        border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(88,68,255,0.15)"}`,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 2, alignItems: "center", flex: 1, flexWrap: "wrap" }}>
        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", alignItems: "center" }}>
          <Typography sx={{ fontWeight: 700, color: darkMode ? "#e2e2e2" : "#1f2937" }}>Quick Filters</Typography>
        </Stack>

        <FormControl size="small" sx={fieldStyles}>
          <InputLabel sx={{ color: darkMode ? "#999" : "inherit" }}>Status</InputLabel>
          <Select
            value={filters.status || ""}
            label="Status"
            onChange={(event: SelectChangeEvent) => updateFilters("status", event.target.value)}
            sx={{ color: darkMode ? "#fff" : "inherit" }}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option || "All"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={fieldStyles}>
          <InputLabel sx={{ color: darkMode ? "#999" : "inherit" }}>Priority</InputLabel>
          <Select
            value={filters.priority || ""}
            label="Priority"
            onChange={(event: SelectChangeEvent) => updateFilters("priority", event.target.value)}
            sx={{ color: darkMode ? "#fff" : "inherit" }}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option || "All"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={fieldStyles}>
          <InputLabel sx={{ color: darkMode ? "#999" : "inherit" }}>Category</InputLabel>
          <Select
            value={filters.category || ""}
            label="Category"
            onChange={(event: SelectChangeEvent) => updateFilters("category", event.target.value)}
            sx={{ color: darkMode ? "#fff" : "inherit" }}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option || "All"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={fieldStyles}>
          <InputLabel sx={{ color: darkMode ? "#999" : "inherit" }}>Date Range</InputLabel>
          <Select
            value={filters.dateRange || ""}
            label="Date Range"
            onChange={(event: SelectChangeEvent) => updateFilters("dateRange", event.target.value)}
            sx={{ color: darkMode ? "#fff" : "inherit" }}
          >
            {DATE_RANGE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option || "All"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Created By"
          value={filters.createdBy || ""}
          onChange={(event) => updateFilters("createdBy", event.target.value)}
          sx={fieldStyles}
          slotProps={{
            inputLabel: { style: { color: darkMode ? "#999" : undefined } },
            input: { style: { color: darkMode ? "#fff" : undefined } },
          }}
        />
      </Box>

      <Button
        variant="outlined"
        onClick={handleClear}
        sx={{ minWidth: 112, textTransform: "none", borderRadius: "12px", borderColor: darkMode ? "rgba(255,255,255,0.16)" : "rgba(107,114,128,0.25)", color: darkMode ? "#d1d5db" : "#4b5563" }}
      >
        Clear Filters
      </Button>
    </Box>
  );
}
