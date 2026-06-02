import { Card, Box, Typography, Skeleton } from "@mui/material";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  bgColor?: string;
  trend?: string;
  loading?: boolean;
  darkMode?: boolean;
}

export const KpiCard = ({
  title,
  value,
  icon,
  color = "#5844FF",
  bgColor = "rgba(88, 68, 255, 0.1)",
  trend = "+0%",
  loading = false,
  darkMode = false,
}: KpiCardProps) => {
  const cardBg = darkMode ? "#1a1a1a" : "white";
  const textColor = darkMode ? "#fff" : "#1a1a1a";
  const subtleText = darkMode ? "#9CA3AF" : "#6B7280";

  return (
    <Card
      sx={{
        padding: "1.5rem",
        backgroundColor: cardBg,
        border: `1px solid ${darkMode ? "#333" : "#e5e7eb"}`,
        borderRadius: "0.75rem",
        boxShadow: darkMode
          ? "0 1px 3px rgba(0, 0, 0, 0.5)"
          : "0 1px 2px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: darkMode
            ? "0 4px 12px rgba(0, 0, 0, 0.7)"
            : "0 4px 12px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-4px)",
          borderColor: color,
        },
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "100%",
          height: "100%",
          background: `linear-gradient(90deg, transparent, ${color}20, transparent)`,
          transition: "left 0.5s ease",
        },
        "&:hover::before": {
          left: "100%",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: subtleText,
              marginBottom: "0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {title}
          </Typography>

          {loading ? (
            <>
              <Skeleton
                variant="text"
                width="60%"
                height={32}
                sx={{ marginBottom: "0.5rem" }}
              />
              <Skeleton variant="text" width="40%" height={20} />
            </>
          ) : (
            <>
              <Typography
                sx={{
                  fontSize: "1.875rem",
                  fontWeight: 700,
                  color: textColor,
                  marginBottom: "0.5rem",
                  transition: "all 0.2s ease",
                }}
              >
                {value}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: color,
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                }}
              >
                {trend}
              </Typography>
            </>
          )}
        </Box>

        {icon && (
          <Box
            sx={{
              width: "3rem",
              height: "3rem",
              backgroundColor: bgColor,
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "1rem",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "& svg": {
                transition: "transform 0.3s ease",
              },
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </Card>
  );
};
