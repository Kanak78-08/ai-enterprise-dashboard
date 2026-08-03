import {
  Card, Box, Typography, Skeleton, IconButton, Tooltip, Chip, Fade, Divider,
} from "@mui/material";
import {
  AutoAwesome as AIIcon, Refresh as RefreshIcon, ErrorOutlined as CriticalIcon,
  Warning as WarningIcon, Info as InfoIcon, CheckCircle as SuccessIcon,
  ArrowForward as ActionIcon,
} from "@mui/icons-material";
import type { AIRecommendation, RecommendationSeverity } from "../../types/ai";

interface Props { recommendations: AIRecommendation[]; loading: boolean; onRefresh: () => void; darkMode?: boolean; }

const SEV: Record<RecommendationSeverity, { icon: typeof CriticalIcon; color: string; bg: string; label: string }> = {
  critical: { icon: CriticalIcon, color: "#EF4444", bg: "rgba(239,68,68,0.1)", label: "Critical" },
  warning: { icon: WarningIcon, color: "#F59E0B", bg: "rgba(245,158,11,0.1)", label: "Warning" },
  info: { icon: InfoIcon, color: "#3B82F6", bg: "rgba(59,130,246,0.1)", label: "Info" },
  success: { icon: SuccessIcon, color: "#10B981", bg: "rgba(16,185,129,0.1)", label: "Good" },
};

export default function AIRecommendations({ recommendations, loading, onRefresh, darkMode = false }: Props) {
  const bg = darkMode ? "#1a1a1a" : "#fff";
  const border = darkMode ? "#333" : "#e5e7eb";
  const txt = darkMode ? "#e2e2e2" : "#1a1a1a";

  return (
    <Card sx={{ p: 0, backgroundColor: bg, border: `1px solid ${border}`, borderRadius: "16px", boxShadow: darkMode ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden", height: "100%", transition: "all 0.3s ease", "&:hover": { boxShadow: darkMode ? "0 8px 24px rgba(0,0,0,0.5)" : "0 8px 24px rgba(0,0,0,0.1)" } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, pb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 32, height: 32, borderRadius: "8px", background: "linear-gradient(135deg, #F59E0B, #EF4444)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AIIcon sx={{ color: "#fff", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: txt }}>AI Recommendations</Typography>
        </Box>
        <Tooltip title="Refresh"><IconButton size="small" onClick={onRefresh} disabled={loading} sx={{ color: darkMode ? "#888" : "#999", "&:hover": { color: "#5844FF" }, animation: loading ? "spin 1s linear infinite" : "none", "@keyframes spin": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } } }}><RefreshIcon fontSize="small" /></IconButton></Tooltip>
      </Box>
      <Divider sx={{ borderColor: darkMode ? "#2a2a2a" : "#f0f0f0" }} />
      <Box sx={{ p: 2, pt: 1.5 }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[1, 2, 3].map(i => (<Box key={i}><Skeleton variant="text" width="60%" height={20} /><Skeleton variant="text" width="90%" height={16} /></Box>))}
          </Box>
        ) : recommendations.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {recommendations.map((rec, idx) => {
              const c = SEV[rec.severity]; const Icon = c.icon;
              return (
                <Fade in key={rec.id} style={{ transitionDelay: `${idx * 100}ms` }}>
                  <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: darkMode ? `${c.color}10` : c.bg, border: `1px solid ${c.color}30`, transition: "all 0.2s ease", "&:hover": { backgroundColor: `${c.color}20`, transform: "translateX(4px)" } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                      <Icon sx={{ fontSize: 20, color: c.color }} />
                      <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: txt, flex: 1 }}>{rec.title}</Typography>
                      <Chip label={c.label} size="small" sx={{ backgroundColor: `${c.color}20`, color: c.color, fontWeight: 700, fontSize: "0.65rem", height: 20 }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: darkMode ? "#aaa" : "#666", fontSize: "0.8rem", mb: 1, lineHeight: 1.5 }}>{rec.description}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1, py: 0.5, borderRadius: "8px", backgroundColor: darkMode ? "rgba(88,68,255,0.1)" : "rgba(88,68,255,0.05)" }}>
                      <ActionIcon sx={{ fontSize: 14, color: "#5844FF" }} />
                      <Typography sx={{ fontSize: "0.75rem", color: "#5844FF", fontWeight: 600 }}>{rec.suggestedAction}</Typography>
                    </Box>
                  </Box>
                </Fade>
              );
            })}
          </Box>
        ) : (
          <Box sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <AIIcon sx={{ fontSize: 32, color: darkMode ? "#555" : "#ccc" }} />
            <Typography variant="body2" sx={{ color: darkMode ? "#666" : "#999", textAlign: "center" }}>Click refresh to generate AI recommendations</Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
}
