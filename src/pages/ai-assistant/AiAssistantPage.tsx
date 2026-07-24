import React from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import ChatWindow from "../../components/ai/ChatWindow";

const AiAssistantPage = () => {
  const theme = useTheme();

  return (
    <Box sx={{ height: "calc(100vh - 100px)", display: "flex", flexDirection: "column", p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        AI Assistant
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3, color: "text.secondary" }}>
        Ask questions about dashboard data, get summaries, and explore analytics.
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          overflow: "hidden",
          borderRadius: 2,
          backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
        }}
      >
        <ChatWindow />
      </Paper>
    </Box>
  );
};

export default AiAssistantPage;
