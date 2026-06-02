import { Box, Typography } from "@mui/material";
import { InfoOutlined as InfoIcon } from "@mui/icons-material";

interface EmptyStateProps {
  message: string;
  darkMode?: boolean;
}

export const EmptyState = ({ message, darkMode = false }: EmptyStateProps) => {
  const textColor = darkMode ? "#9CA3AF" : "#6B7280";
  const iconColor = darkMode ? "#4B5563" : "#D1D5DB";

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
      }}
    >
      <InfoIcon
        sx={{
          fontSize: "3rem",
          color: iconColor,
          marginBottom: "1rem",
          opacity: 0.6,
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
