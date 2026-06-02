import { Card, Box, Typography, Skeleton } from "@mui/material";
import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  darkMode?: boolean;
  height?: string;
}

export const ChartCard = ({
  title,
  children,
  loading = false,
  error,
  onRetry,
  darkMode = false,
  height = "400px",
}: ChartCardProps) => {
  const cardBg = darkMode ? "#1a1a1a" : "white";
  const textColor = darkMode ? "#fff" : "#1a1a1a";
  const borderColor = darkMode ? "#333" : "#e5e7eb";

  if (loading) {
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
          height: height,
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
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            height: "100%",
          }}
        >
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={200} sx={{ flex: 1 }} />
          <Skeleton variant="rectangular" height={30} />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        sx={{
          padding: "1.5rem",
          backgroundColor: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: "0.75rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: height,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: textColor,
            marginBottom: "1rem",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: "#EF4444",
            fontSize: "0.875rem",
            marginBottom: "1rem",
          }}
        >
          {error}
        </Typography>
        {onRetry && (
          <Typography
            component="button"
            onClick={onRetry}
            sx={{
              cursor: "pointer",
              color: "#5844FF",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              background: "none",
              textDecoration: "underline",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            Retry
          </Typography>
        )}
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
        height: height,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: darkMode
            ? "0 8px 24px rgba(0, 0, 0, 0.6)"
            : "0 8px 24px rgba(0, 0, 0, 0.12)",
          borderColor: darkMode ? "#444" : "#d1d5db",
        },
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
        {title}
      </Typography>
      <Box sx={{ height: "calc(100% - 2rem)" }}>{children}</Box>
    </Card>
  );
};
