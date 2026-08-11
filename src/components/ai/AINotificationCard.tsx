import { useState } from "react";
import {
  Box, Typography, Button, TextField, Grid,
  CircularProgress, Paper, Alert, Chip, IconButton, useTheme,
} from "@mui/material";
import {
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as CriticalIcon,
  Info as InfoIcon,
  AutoAwesome as AIIcon,
  ExpandMore as ExpandIcon,
  Delete as DeleteIcon,
  NotificationsActive as BellIcon,
} from "@mui/icons-material";
import { generateNotification } from "../../services/aiWorkflowService";
import type { NotificationType, GeneratedNotification } from "../../types/aiWorkflow";

const TYPE_CONFIG: Record<NotificationType, {
  color: string;
  bg: string;
  icon: React.ElementType;
  label: string;
}> = {
  success: { color: "#00C896", bg: "rgba(0,200,150,0.08)", icon: SuccessIcon, label: "Success" },
  warning: { color: "#FFB347", bg: "rgba(255,179,71,0.08)", icon: WarningIcon, label: "Warning" },
  critical: { color: "#FF6B6B", bg: "rgba(255,107,107,0.08)", icon: CriticalIcon, label: "Critical" },
  info: { color: "#4FC3F7", bg: "rgba(79,195,247,0.08)", icon: InfoIcon, label: "Info" },
};

const PRESET_CONTEXTS: Record<NotificationType, string> = {
  success: "Weekly Operations Report Ready",
  warning: "Pending Reports Need Attention",
  critical: "High Failure Rate Detected",
  info: "New Dashboard Insights Available",
};

interface AINotificationCardProps {
  notification: GeneratedNotification;
  onDismiss: (id: string) => void;
}

function NotificationCard({ notification, onDismiss }: AINotificationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cfg = TYPE_CONFIG[notification.type];
  const Icon = cfg.icon;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2, mb: 1.5,
        border: `1px solid ${cfg.color}40`,
        borderLeft: `4px solid ${cfg.color}`,
        borderRadius: 2,
        background: cfg.bg,
        transition: "all 0.2s",
        "&:hover": { boxShadow: `0 4px 16px ${cfg.color}20` },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Icon sx={{ color: cfg.color, mt: 0.25, flexShrink: 0 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{notification.title}</Typography>
            <Chip label={cfg.label} size="small" sx={{ background: `${cfg.color}20`, color: cfg.color, height: 18, fontSize: "0.65rem" }} />
            <Typography variant="caption" sx={{ color: "text.secondary", ml: "auto", flexShrink: 0 }}>
              {notification.generatedAt}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: expanded ? "unset" : 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.6,
            }}
          >
            {notification.message}
          </Typography>
          {notification.message.length > 120 && (
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              endIcon={<ExpandIcon sx={{ transform: expanded ? "rotate(180deg)" : "none", transition: "0.2s" }} />}
              sx={{ mt: 0.5, textTransform: "none", color: cfg.color, p: 0, fontSize: "0.75rem" }}
            >
              {expanded ? "Show less" : "Show more"}
            </Button>
          )}
          {notification.action && (
            <Button
              size="small"
              variant="outlined"
              sx={{ mt: 1, borderRadius: 1.5, textTransform: "none", fontSize: "0.75rem", borderColor: cfg.color, color: cfg.color }}
            >
              {notification.action}
            </Button>
          )}
        </Box>
        <IconButton size="small" onClick={() => onDismiss(notification.id)} sx={{ opacity: 0.5, "&:hover": { opacity: 1 } }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default function AINotificationGenerator() {
  const theme = useTheme();
  const [type, setType] = useState<NotificationType>("success");
  const [context, setContext] = useState(PRESET_CONTEXTS.success);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<GeneratedNotification[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleTypeChange = (t: NotificationType) => {
    setType(t);
    setContext(PRESET_CONTEXTS[t]);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const n = await generateNotification({ type, context });
      setNotifications((prev) => [n, ...prev]);
    } catch {
      setError("Failed to generate notification.");
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3, mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          background: theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
            : "linear-gradient(135deg, #f8f7ff 0%, #fff8f0 100%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box sx={{
            width: 42, height: 42, borderRadius: 2,
            background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BellIcon sx={{ color: "white", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>AI Notification Generator</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Generate intelligent notifications from dashboard events
            </Typography>
          </Box>
        </Box>

        {/* Type Selector */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>
            Notification Type
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {(Object.keys(TYPE_CONFIG) as NotificationType[]).map((t) => {
              const cfg = TYPE_CONFIG[t];
              return (
                <Chip
                  key={t}
                  label={cfg.label}
                  onClick={() => handleTypeChange(t)}
                  sx={{
                    cursor: "pointer",
                    fontWeight: 600,
                    background: type === t ? cfg.bg : "transparent",
                    border: `2px solid ${type === t ? cfg.color : "transparent"}`,
                    color: type === t ? cfg.color : "text.secondary",
                    transition: "all 0.2s",
                    "&:hover": { background: cfg.bg, color: cfg.color },
                  }}
                />
              );
            })}
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth size="small" label="Notification Context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe the event or context for this notification"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>
        </Grid>

        {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}

        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AIIcon />}
          onClick={handleGenerate}
          disabled={loading}
          sx={{
            mt: 3, borderRadius: 2, textTransform: "none", fontWeight: 700, py: 1.5,
            background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
            boxShadow: "0 4px 16px rgba(88,68,255,0.35)",
          }}
        >
          {loading ? "Generating Notification…" : "✨ Generate AI Notification"}
        </Button>
      </Paper>

      {/* Notification Feed */}
      {notifications.length > 0 ? (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Generated Notifications ({notifications.length})
            </Typography>
            <Button size="small" onClick={() => setNotifications([])} sx={{ textTransform: "none", color: "error.main" }}>
              Clear All
            </Button>
          </Box>
          {notifications.map((n) => (
            <NotificationCard key={n.id} notification={n} onDismiss={handleDismiss} />
          ))}
        </Box>
      ) : (
        <Box sx={{
          textAlign: "center", py: 8,
          color: "text.secondary",
          border: `2px dashed ${theme.palette.divider}`,
          borderRadius: 3,
        }}>
          <BellIcon sx={{ fontSize: 64, opacity: 0.2, mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>No Notifications Generated</Typography>
          <Typography variant="body2">Select a type and context, then generate AI notifications.</Typography>
        </Box>
      )}
    </Box>
  );
}
