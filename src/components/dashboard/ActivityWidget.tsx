import {
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
} from "@mui/material";
import { EmptyState } from "../common/EmptyState";
import { ErrorState } from "../common/ErrorState";

interface Activity {
  id: number;
  user: string;
  action: string;
  status: string;
  timestamp?: string;
}

interface ActivityWidgetProps {
  activities: Activity[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  darkMode?: boolean;
}

export const ActivityWidget = ({
  activities,
  loading = false,
  error,
  onRetry,
  darkMode = false,
}: ActivityWidgetProps) => {
  const cardBg = darkMode ? "#1a1a1a" : "white";
  const textColor = darkMode ? "#fff" : "#1a1a1a";
  const borderColor = darkMode ? "#333" : "#e5e7eb";
  const subtleText = darkMode ? "#9CA3AF" : "#6B7280";
  const hoverBg = darkMode ? "#2a2a2a" : "#f9fafb";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Failed":
        return "error";
      default:
        return "default";
    }
  };

  const renderSkeleton = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: subtleText }}>User</TableCell>
            <TableCell sx={{ color: subtleText }}>Action</TableCell>
            <TableCell sx={{ color: subtleText }}>Status</TableCell>
            <TableCell sx={{ color: subtleText }}>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(4)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton width="70%" />
              </TableCell>
              <TableCell>
                <Skeleton width="80%" />
              </TableCell>
              <TableCell>
                <Skeleton width="60%" />
              </TableCell>
              <TableCell>
                <Skeleton width="50%" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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
          Recent Activities
        </Typography>
        <ErrorState message={error} onRetry={onRetry} darkMode={darkMode} />
      </Card>
    );
  }

  if (!loading && activities.length === 0) {
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
          Recent Activities
        </Typography>
        <EmptyState message="No activities available" darkMode={darkMode} />
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
        Recent Activities
      </Typography>

      {loading ? (
        renderSkeleton()
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "#f9fafb",
                }}
              >
                <TableCell
                  sx={{
                    color: subtleText,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  User
                </TableCell>
                <TableCell
                  sx={{
                    color: subtleText,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Action
                </TableCell>
                <TableCell
                  sx={{
                    color: subtleText,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    color: subtleText,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Time
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((activity) => (
                <TableRow
                  key={activity.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: hoverBg,
                    },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <TableCell sx={{ color: textColor, fontSize: "0.875rem" }}>
                    {activity.user}
                  </TableCell>
                  <TableCell sx={{ color: textColor, fontSize: "0.875rem" }}>
                    {activity.action}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={activity.status}
                      color={getStatusColor(activity.status) as "success" | "warning" | "error" | "default"}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: subtleText, fontSize: "0.875rem" }}>
                    {activity.timestamp}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  );
};
