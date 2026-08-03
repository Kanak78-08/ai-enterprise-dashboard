import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Skeleton, Chip, IconButton, Fade } from "@mui/material";
import { Close as CloseIcon, AutoAwesome as AIIcon, Insights as InsightIcon } from "@mui/icons-material";
import type { ExplainChartResponse } from "../../types/ai";

interface Props {
  open: boolean;
  onClose: () => void;
  explanation: ExplainChartResponse | null;
  loading: boolean;
  chartTitle?: string;
  darkMode?: boolean;
}

export default function ExplainChartModal({ open, onClose, explanation, loading, chartTitle = "Chart", darkMode = false }: Props) {
  const bg = darkMode ? "#1a1a2e" : "#fff";
  const txt = darkMode ? "#e2e2e2" : "#1a1a1a";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth {...({ PaperProps: {
      sx: { borderRadius: "20px", backgroundColor: bg, border: `1px solid ${darkMode ? "#333" : "#e5e7eb"}`, overflow: "hidden" }
    }} as any)}>
      {/* Gradient top line */}
      <Box sx={{ height: 3, background: "linear-gradient(90deg, #5844FF, #7c6aff, #a78bfa)" }} />

      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, #5844FF, #7c6aff)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AIIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: txt }}>AI Chart Explanation</Typography>
            <Typography variant="caption" sx={{ color: darkMode ? "#888" : "#999" }}>{chartTitle}</Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: darkMode ? "#888" : "#999" }}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Skeleton variant="text" width="100%" height={24} />
            <Skeleton variant="text" width="90%" height={24} />
            <Skeleton variant="text" width="85%" height={24} />
            <Box sx={{ mt: 2 }}><Skeleton variant="rounded" width="100%" height={120} /></Box>
          </Box>
        ) : explanation ? (
          <Fade in>
            <Box>
              {/* Main explanation */}
              <Typography sx={{ color: darkMode ? "#ccc" : "#444", fontSize: "0.9rem", lineHeight: 1.7, mb: 2.5 }}>{explanation.explanation}</Typography>

              {/* Trend badge */}
              {explanation.trend && (
                <Box sx={{ mb: 2 }}>
                  <Chip label={`Trend: ${explanation.trend}`} size="small" sx={{
                    background: explanation.trend === "upward" ? "rgba(16,185,129,0.15)" : explanation.trend === "downward" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                    color: explanation.trend === "upward" ? "#10B981" : explanation.trend === "downward" ? "#EF4444" : "#F59E0B",
                    fontWeight: 700, fontSize: "0.75rem", textTransform: "capitalize"
                  }} />
                </Box>
              )}

              {/* Key Insights */}
              <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: txt, mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                <InsightIcon sx={{ fontSize: 18, color: "#5844FF" }} /> Key Insights
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                {explanation.keyInsights.map((insight, idx) => (
                  <Box key={idx} sx={{
                    display: "flex", alignItems: "flex-start", gap: 1, p: 1, borderRadius: "8px",
                    backgroundColor: darkMode ? "rgba(88,68,255,0.06)" : "rgba(88,68,255,0.03)",
                    border: `1px solid ${darkMode ? "rgba(88,68,255,0.15)" : "rgba(88,68,255,0.08)"}`,
                  }}>
                    <Typography sx={{ fontSize: "0.75rem", color: "#5844FF", fontWeight: 700, mt: "2px" }}>#{idx + 1}</Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? "#bbb" : "#555", fontSize: "0.82rem" }}>{insight}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Fade>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "10px", textTransform: "none", borderColor: darkMode ? "#444" : "#ddd", color: darkMode ? "#aaa" : "#666" }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
