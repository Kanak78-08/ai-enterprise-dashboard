import React from "react";
import { Box, Typography, Avatar, IconButton, Tooltip, useTheme } from "@mui/material";
import { ContentCopy as CopyIcon, SmartToy, Person } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import type { Message } from "./ChatWindow";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAI = message.sender === "ai";
  const theme = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isAI ? "row" : "row-reverse",
        alignItems: "flex-start",
        gap: 2,
        mb: 2,
      }}
    >
      <Avatar
        sx={{
          bgcolor: isAI ? "primary.main" : "secondary.main",
          width: 40,
          height: 40,
        }}
      >
        {isAI ? <SmartToy /> : <Person />}
      </Avatar>

      <Box
        sx={{
          maxWidth: "75%",
          display: "flex",
          flexDirection: "column",
          alignItems: isAI ? "flex-start" : "flex-end",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            {isAI ? "AI Assistant" : "You"} • {message.timestamp}
          </Typography>
        </Box>
        
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: isAI 
              ? (theme.palette.mode === "dark" ? "#2d2d2d" : "#f5f5f5")
              : "primary.main",
            color: isAI ? "text.primary" : "primary.contrastText",
            position: "relative",
            "& p": { m: 0, mb: 1, "&:last-child": { mb: 0 } },
            "& ul, & ol": { mt: 0, mb: 1, pl: 2 },
            "& li": { mb: 0.5 },
          }}
        >
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </Box>
        
        {isAI && (
          <Tooltip title="Copy response">
            <IconButton size="small" onClick={handleCopy} sx={{ mt: 0.5 }}>
              <CopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default ChatMessage;
