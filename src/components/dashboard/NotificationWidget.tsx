import {
  Card,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Skeleton,
  Stack,
} from "@mui/material";
import { Notifications as AlertIcon } from "@mui/icons-material";
import { EmptyState } from "../common/EmptyState";
import { ErrorState } from "../common/ErrorState";

interface Notification {
  id: number;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp?: string;
}

interface NotificationWidgetProps {
  notifications: Notification[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  darkMode?: boolean;
}

export const NotificationWidget = ({
  notifications,
  loading = false,
  error,
  onRetry,
  darkMode = false,
}: NotificationWidgetProps) => {
  const cardBg = darkMode ? "#1a1a1a" : "white";
  const textColor = darkMode ? "#fff" : "#1a1a1a";
  const borderColor = darkMode ? "#333" : "#e5e7eb";
  const subtleText = darkMode ? "#9CA3AF" : "#6B7280";

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "warning":
        return "warning";
      case "success":
        return "success";
      case "error":
        return "error";
      default:
        return "info";
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "warning":
        return darkMode
          ? "rgba(245, 158, 11, 0.1)"
          : "rgba(245, 158, 11, 0.05)";
      case "success":
        return darkMode
          ? "rgba(16, 185, 129, 0.1)"
          : "rgba(16, 185, 129, 0.05)";
      case "error":
        return darkMode
          ? "rgba(239, 68, 68, 0.1)"
          : "rgba(239, 68, 68, 0.05)";
      default:
        return darkMode
          ? "rgba(59, 130, 246, 0.1)"
          : "rgba(59, 130, 246, 0.05)";
    }
  };

  const renderSkeleton = () => (
    <Stack spacing={1}>
      {[...Array(3)].map((_, i) => (
        <Box key={i}>
          <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
        </Box>
      ))}
    </Stack>
  );

  if (error) {
    return (
      <Card
        sx={{
          padding: "1.5rem",
          backgroundColor: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: "0.75rem",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: textColor,
            marginBottom: "1.5rem",
          }}
        >
          Notifications
        </Typography>
        <ErrorState message={error} onRetry={onRetry} darkMode={darkMode} />
      </Card>
    );
  }

  if (!loading && notifications.length === 0) {
    return (
      <Card
        sx={{
          padding: "1.5rem",
          backgroundColor: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: "0.75rem",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: textColor,
            marginBottom: "1.5rem",
          }}
        >
          Notifications
        </Typography>
        <EmptyState message="No notifications available" darkMode={darkMode} />
      </Card>
    );
  }

  return (
    <Card
      sx={{
        padding: "1.5rem",
        backgroundColor: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: "0.75rem",
        boxShadow: darkMode
          ? "0 1px 3px rgba(0, 0, 0, 0.5)"
          : "0 1px 2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Typography
        sx={{
          fontSize: "1.125rem",
          fontWeight: 600,
          color: textColor,
          marginBottom: "1.5rem",
        }}
      >
        Notifications
      </Typography>

      {loading ? (
        renderSkeleton()
      ) : (
        <List sx={{ padding: 0 }}>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              sx={{
                padding: "1rem",
                marginBottom: "0.5rem",
                backgroundColor: getNotificationBg(notification.type),
                borderRadius: "0.5rem",
                border: `1px solid ${
                  darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
                }`,
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: darkMode
                    ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                    : "0 2px 8px rgba(0, 0, 0, 0.1)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <AlertIcon
                sx={{
                  color:
                    notification.type === "warning"
                      ? "#F59E0B"
                      : notification.type === "success"
                        ? "#10B981"
                        : notification.type === "error"
                          ? "#EF4444"
                          : "#3B82F6",
                  marginRight: "0.75rem",
                  flexShrink: 0,
                }}
              />
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: textColor,
                    }}
                  >
                    {notification.message}
                  </Typography>
                }
                secondary={
                  notification.timestamp && (
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: subtleText,
                        marginTop: "0.25rem",
                      }}
                    >
                      {notification.timestamp}
                    </Typography>
                  )
                }
              />
              <Chip
                label={notification.type}
                size="small"
                color={getNotificationColor(notification.type) as "warning" | "success" | "error" | "info"}
                sx={{
                  marginLeft: "0.5rem",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  );
};
