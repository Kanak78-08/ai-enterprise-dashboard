import { useState } from "react";
import {
  Box, Typography, Button, Grid, MenuItem, TextField,
  CircularProgress, Alert, Paper, useTheme, Chip,
} from "@mui/material";
import {
  AutoAwesome as AIIcon,
  Assessment as ReportIcon,
} from "@mui/icons-material";
import { generateAIReport } from "../../../services/aiWorkflowService";
import type { GenerateReportRequest, GeneratedReport, ReportType, DateRange } from "../../../types/aiWorkflow";
import ReportPreview from "./ReportPreview";

const REPORT_TYPES: ReportType[] = ["Weekly", "Monthly", "Quarterly", "Annual"];
const DATE_RANGES: DateRange[] = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "Last Year"];
const TEAMS = ["All Teams", "Operations", "Maintenance", "Quality", "Production", "IT", "HR", "Finance"];
const CATEGORIES = ["All Categories", "Maintenance", "Safety", "Quality", "Production", "Compliance", "IT", "Finance"];

const QUICK_PRESETS = [
  { label: "Weekly Ops", reportType: "Weekly" as ReportType, dateRange: "Last 7 Days" as DateRange, team: "Operations" },
  { label: "Monthly QA", reportType: "Monthly" as ReportType, dateRange: "Last 30 Days" as DateRange, team: "Quality" },
  { label: "Quarterly Review", reportType: "Quarterly" as ReportType, dateRange: "Last 90 Days" as DateRange, team: "All Teams" },
];

export default function AIReportGenerator() {
  const theme = useTheme();
  const [form, setForm] = useState<GenerateReportRequest>({
    reportType: "Weekly",
    dateRange: "Last 7 Days",
    team: "All Teams",
    category: "All Categories",
  });
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof GenerateReportRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateAIReport(form);
      setReport(result);
    } catch {
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (preset: typeof QUICK_PRESETS[0]) => {
    setForm((prev) => ({ ...prev, ...preset }));
  };

  return (
    <Box>
      {/* Config Panel */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          background: theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
            : "linear-gradient(135deg, #f8f7ff 0%, #f0eeff 100%)",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 42, height: 42, borderRadius: 2,
              background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ReportIcon sx={{ color: "white", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Configure Report</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Select parameters to generate an executive AI report
            </Typography>
          </Box>
        </Box>

        {/* Quick Presets */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>
            Quick Presets
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {QUICK_PRESETS.map((p) => (
              <Chip
                key={p.label}
                label={p.label}
                onClick={() => handlePreset(p)}
                variant="outlined"
                size="small"
                sx={{
                  cursor: "pointer",
                  borderColor: "#5844FF",
                  color: "#5844FF",
                  "&:hover": { background: "rgba(88,68,255,0.08)" },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Form Fields */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select fullWidth size="small" label="Report Type"
              value={form.reportType} onChange={handleChange("reportType")}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              {REPORT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select fullWidth size="small" label="Date Range"
              value={form.dateRange} onChange={handleChange("dateRange")}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              {DATE_RANGES.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select fullWidth size="small" label="Team"
              value={form.team || "All Teams"} onChange={handleChange("team")}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              {TEAMS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select fullWidth size="small" label="Category"
              value={form.category || "All Categories"} onChange={handleChange("category")}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>

        {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}

        {/* Generate Button */}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AIIcon />}
            onClick={handleGenerate}
            disabled={loading}
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              py: 1.5,
              background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
              boxShadow: "0 4px 20px rgba(88,68,255,0.4)",
              "&:hover": { boxShadow: "0 6px 28px rgba(88,68,255,0.5)" },
            }}
          >
            {loading ? "Generating AI Report…" : "✨ Generate AI Report"}
          </Button>
        </Box>
      </Paper>

      {/* Report Preview */}
      {report && (
        <ReportPreview
          report={report}
          onRegenerate={handleGenerate}
          isRegenerating={loading}
        />
      )}

      {/* Empty State */}
      {!report && !loading && (
        <Box
          sx={{
            textAlign: "center", py: 8,
            color: "text.secondary",
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: 3,
          }}
        >
          <ReportIcon sx={{ fontSize: 64, opacity: 0.2, mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            No Report Generated Yet
          </Typography>
          <Typography variant="body2">
            Configure the parameters above and click "Generate AI Report" to create an executive report.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
