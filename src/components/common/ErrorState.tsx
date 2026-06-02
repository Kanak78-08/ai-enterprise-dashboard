import { Box, Typography, Button } from "@mui/material";
import { ErrorOutlined as ErrorIcon } from "@mui/icons-material";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  darkMode?: boolean;
}

export const ErrorState = ({
  message,
  onRetry,
  darkMode = false,
}: ErrorStateProps) => {
  const textColor = darkMode ? "#EF4444" : "#DC2626";
  const bgColor = darkMode ? "rgba(239, 68, 68, 0.1)" : "rgba(220, 38, 38, 0.1)";
  const buttonBgColor = darkMode ? "rgba(239, 68, 68, 0.2)" : "rgba(220, 38, 38, 0.15)";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        minHeight: "150px",
        textAlign: "center",
        backgroundColor: bgColor,
        borderRadius: "0.5rem",
      }}
    >
      <ErrorIcon
        sx={{
          fontSize: "2.5rem",
          color: textColor,
          marginBottom: "1rem",
        }}
      />
      <Typography
        sx={{
          color: textColor,
          fontSize: "0.95rem",
          fontWeight: 500,
          marginBottom: "1rem",
        }}
      >
        {message}
      </Typography>
      {onRetry && (
        <Button
          onClick={onRetry}
          size="small"
          sx={{
            backgroundColor: buttonBgColor,
            color: textColor,
            "&:hover": {
              backgroundColor: darkMode
                ? "rgba(239, 68, 68, 0.3)"
                : "rgba(220, 38, 38, 0.25)",
            },
          }}
        >
          Retry
        </Button>
      )}
    </Box>
  );
};
