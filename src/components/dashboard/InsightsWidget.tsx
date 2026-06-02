import {
  Card,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
} from "@mui/material";
import { TrendingUp as TrendingUpIcon } from "@mui/icons-material";
import { EmptyState } from "../common/EmptyState";
import { ErrorState } from "../common/ErrorState";

interface Insight {
  id: number;
  text: string;
  metric?: string;
  change?: string;
}

interface InsightsWidgetProps {
  insights: Insight[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  darkMode?: boolean;
}

export const InsightsWidget = ({
  insights,
  loading = false,
  error,
  onRetry,
  darkMode = false,
}: InsightsWidgetProps) => {
  const cardBg = darkMode ? "#1a1a1a" : "white";
  const textColor = darkMode ? "#fff" : "#1a1a1a";
  const borderColor = darkMode ? "#333" : "#e5e7eb";
  const accentColor = "#5844FF";

  const renderSkeleton = () => (
    <Stack spacing={1.5}>
      {[...Array(3)].map((_, i) => (
        <Box key={i}>
          <Skeleton variant="rectangular" height={50} sx={{ mb: 0.5 }} />
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
          Key Insights
        </Typography>
        <ErrorState message={error} onRetry={onRetry} darkMode={darkMode} />
      </Card>
    );
  }

  if (!loading && insights.length === 0) {
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
          Key Insights
        </Typography>
        <EmptyState message="No insights available" darkMode={darkMode} />
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
        Key Insights
      </Typography>

      {loading ? (
        renderSkeleton()
      ) : (
        <List sx={{ padding: 0 }}>
          {insights.map((insight) => (
            <ListItem
              key={insight.id}
              sx={{
                padding: "1rem",
                marginBottom: "0.5rem",
                backgroundColor: darkMode
                  ? "rgba(88, 68, 255, 0.05)"
                  : "rgba(88, 68, 255, 0.03)",
                borderRadius: "0.5rem",
                border: `1px solid ${darkMode ? "rgba(88, 68, 255, 0.2)" : "rgba(88, 68, 255, 0.1)"}`,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: darkMode
                    ? "rgba(88, 68, 255, 0.1)"
                    : "rgba(88, 68, 255, 0.08)",
                  borderColor: accentColor,
                  boxShadow: darkMode
                    ? "0 2px 8px rgba(88, 68, 255, 0.2)"
                    : "0 2px 8px rgba(88, 68, 255, 0.1)",
                },
              }}
            >
              <TrendingUpIcon
                sx={{
                  color: accentColor,
                  marginRight: "0.75rem",
                  flexShrink: 0,
                }}
              />
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: textColor,
                    }}
                  >
                    {insight.text}
                  </Typography>
                }
                secondary={
                  insight.change && (
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: accentColor,
                        fontWeight: 600,
                        marginTop: "0.25rem",
                      }}
                    >
                      {insight.change}
                    </Typography>
                  )
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  );
};
