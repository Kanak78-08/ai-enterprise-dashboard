import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingStateProps {
  message?: string;
  darkMode?: boolean;
  size?: number;
}

export const LoadingState = ({
  message = "Loading...",
  darkMode = false,
  size = 40,
}: LoadingStateProps) => {
  const textColor = darkMode ? "#9CA3AF" : "#6B7280";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        minHeight: "200px",
        gap: 2,
      }}
    >
      <CircularProgress
        size={size}
        thickness={4}
        sx={{
          color: "#5844FF",
          animation: "spin 2s linear infinite",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
      <Typography
        sx={{
          color: textColor,
          fontSize: "0.95rem",
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};
