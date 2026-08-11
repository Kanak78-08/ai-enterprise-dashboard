import { Box, Typography, Chip, Paper, useTheme } from "@mui/material";
import {
  Assessment as ReportIcon,
  Schedule as TimeIcon,
  Group as TeamIcon,
} from "@mui/icons-material";
import type { GeneratedReport } from "../../../types/aiWorkflow";
import ReportSection from "./ReportSection";
import ExportToolbar from "./ExportToolbar";

interface ReportPreviewProps {
  report: GeneratedReport;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export default function ReportPreview({ report, onRegenerate, isRegenerating }: ReportPreviewProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <ReportIcon sx={{ fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
            {report.title}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            icon={<ReportIcon sx={{ color: "white !important", fontSize: "0.85rem" }} />}
            label={report.reportType}
            size="small"
            sx={{ background: "rgba(255,255,255,0.2)", color: "white", border: "none" }}
          />
          <Chip
            icon={<TimeIcon sx={{ color: "white !important", fontSize: "0.85rem" }} />}
            label={report.dateRange}
            size="small"
            sx={{ background: "rgba(255,255,255,0.2)", color: "white", border: "none" }}
          />
          {report.team && (
            <Chip
              icon={<TeamIcon sx={{ color: "white !important", fontSize: "0.85rem" }} />}
              label={report.team}
              size="small"
              sx={{ background: "rgba(255,255,255,0.2)", color: "white", border: "none" }}
            />
          )}
        </Box>
        <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: "block" }}>
          Generated: {report.generatedAt}
        </Typography>
      </Box>

      {/* Export Toolbar */}
      <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <ExportToolbar report={report} onRegenerate={onRegenerate} isRegenerating={isRegenerating} />
      </Box>

      {/* Sections */}
      <Box sx={{ p: 3 }}>
        <Typography variant="caption" sx={{ color: "text.secondary", mb: 2, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>
          {report.sections.length} Sections Generated
        </Typography>
        {report.sections.map((section, i) => (
          <ReportSection key={i} section={section} index={i} />
        ))}
      </Box>
    </Paper>
  );
}
