import React from "react";
import { Box, Avatar, Typography, useTheme, keyframes } from "@mui/material";
import { SmartToy } from "@mui/icons-material";

const dotAnimation = keyframes`
  0% { opacity: 0.2; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-3px); }
  100% { opacity: 0.2; transform: translateY(0); }
`;

const TypingIndicator: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, mb: 2 }}>
      <Avatar
        sx={{
          bgcolor: "primary.main",
          width: 40,
          height: 40,
        }}
      >
        <SmartToy />
      </Avatar>
      
      <Box
        sx={{
          maxWidth: "75%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            AI Assistant is typing...
          </Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === "dark" ? "#2d2d2d" : "#f5f5f5",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            height: 40,
          }}
        >
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "text.secondary",
                animation: `${dotAnimation} 1.4s infinite ease-in-out both`,
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TypingIndicator;
