import {
  Card,
  Box,
  Typography,
  Skeleton,
  IconButton,
  Tooltip,
  Chip,
  Fade,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  ContentCopy as CopyIcon,
  AutoAwesome as AIIcon,
  TrendingUp as UpIcon,
  TrendingDown as DownIcon,
  TrendingFlat as StableIcon,
} from "@mui/icons-material";
import { useState } from "react";
import type { AISummaryResponse } from "../../types/ai";

interface AISummaryCardProps {
  summary: AISummaryResponse | null;
  loading: boolean;
  onRefresh: () => void;
  darkMode?: boolean;
}

export default function AISummaryCard({
  summary,
  loading,
  onRefresh,
  darkMode = false,
}: AISummaryCardProps) {
  const [copied, setCopied] = useState(false);

  const cardBg = darkMode
    ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)"
    : "linear-gradient(135deg, #fafbff 0%, #f0edff 50%, #fafbff 100%)";
  const borderColor = darkMode ? "rgba(88,68,255,0.3)" : "rgba(88,68,255,0.15)";
  const textColor = darkMode ? "#e2e2e2" : "#1a1a1a";

  const handleCopy = async () => {
    if (!summary) return;
    const text = summary.summary.join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <UpIcon sx={{ fontSize: 16, color: "#10B981" }} />;
      case "down":
        return <DownIcon sx={{ fontSize: 16, color: "#EF4444" }} />;
      case "stable":
        return <StableIcon sx={{ fontSize: 16, color: "#F59E0B" }} />;
    }
  };

  return (
    <Card
      sx={{
        p: 0,
        background: cardBg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: "16px",
        boxShadow: darkMode
          ? "0 4px 24px rgba(0,0,0,0.3)"
          : "0 4px 24px rgba(88,68,255,0.06)",
        overflow: "hidden",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: darkMode
            ? "0 8px 32px rgba(0,0,0,0.5)"
            : "0 8px 32px rgba(88,68,255,0.12)",
          borderColor: darkMode ? "rgba(88,68,255,0.5)" : "rgba(88,68,255,0.3)",
        },
      }}
    >
      {/* Decorative gradient line at top */}
      <Box
        sx={{
          height: 3,
          background: "linear-gradient(90deg, #5844FF, #7c6aff, #a78bfa, #5844FF)",
          backgroundSize: "200% 100%",
          animation: "shimmer 3s ease-in-out infinite",
          "@keyframes shimmer": {
            "0%": { backgroundPosition: "200% 0" },
            "100%": { backgroundPosition: "-200% 0" },
          },
        }}
      />

      <Box sx={{ p: 2.5 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #5844FF, #7c6aff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(88,68,255,0.3)",
              }}
            >
              <AIIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: textColor,
                  lineHeight: 1.2,
                }}
              >
                AI Dashboard Summary
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: darkMode ? "#888" : "#999",
                  fontSize: "0.7rem",
                }}
              >
                {summary
                  ? `Generated ${new Date(summary.generatedAt).toLocaleTimeString()}`
                  : "Click refresh to generate"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title={copied ? "Copied!" : "Copy summary"}>
              <IconButton
                size="small"
                onClick={handleCopy}
                disabled={!summary || loading}
                sx={{
                  color: copied ? "#10B981" : darkMode ? "#888" : "#999",
                  "&:hover": { color: "#5844FF" },
                }}
              >
                <CopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh Summary">
              <IconButton
                size="small"
                onClick={onRefresh}
                disabled={loading}
                sx={{
                  color: darkMode ? "#888" : "#999",
                  "&:hover": { color: "#5844FF" },
                  animation: loading ? "spin 1s linear infinite" : "none",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Summary Content */}
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Skeleton variant="text" width="90%" height={20} />
            <Skeleton variant="text" width="85%" height={20} />
            <Skeleton variant="text" width="70%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
            <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
              <Skeleton variant="rounded" width={100} height={48} />
              <Skeleton variant="rounded" width={100} height={48} />
              <Skeleton variant="rounded" width={100} height={48} />
            </Box>
          </Box>
        ) : summary ? (
          <Fade in>
            <Box>
              {/* Summary Points */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mb: 2 }}>
                {summary.summary.map((point, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.5rem",
                        color: "#5844FF",
                        mt: "6px",
                        lineHeight: 1,
                      }}
                    >
                      ●
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: darkMode ? "#ccc" : "#444",
                        fontSize: "0.85rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {point}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Highlights */}
              {summary.highlights && (
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                  {summary.highlights.map((h, idx) => (
                    <Chip
                      key={idx}
                      icon={getTrendIcon(h.trend)}
                      label={`${h.label}: ${h.value}`}
                      size="small"
                      sx={{
                        backgroundColor: darkMode
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(88,68,255,0.06)",
                        border: `1px solid ${darkMode ? "#333" : "rgba(88,68,255,0.15)"}`,
                        color: darkMode ? "#ddd" : "#333",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        height: 32,
                        "& .MuiChip-icon": { ml: 0.5 },
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Fade>
        ) : (
          <Box
            sx={{
              py: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AIIcon sx={{ fontSize: 32, color: darkMode ? "#555" : "#ccc" }} />
            <Typography
              variant="body2"
              sx={{ color: darkMode ? "#666" : "#999", textAlign: "center" }}
            >
              Click the refresh button to generate an AI summary
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
}
