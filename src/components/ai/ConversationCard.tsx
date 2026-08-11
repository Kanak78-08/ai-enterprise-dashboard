import { Box, Typography, Chip, Paper, IconButton, Avatar, Tooltip, useTheme } from "@mui/material";
import { Delete as DeleteIcon, SmartToy as AIIcon } from "@mui/icons-material";
import type { Conversation } from "../../types/aiWorkflow";

interface ConversationCardProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationCard({ conversation, isActive, onSelect, onDelete }: ConversationCardProps) {
  const theme = useTheme();
  const lastMsg = conversation.messages[conversation.messages.length - 1];
  const msgCount = conversation.messages.length;

  return (
    <Paper
      elevation={0}
      onClick={() => onSelect(conversation.id)}
      sx={{
        p: 1.75,
        mb: 1,
        border: `1.5px solid ${isActive ? "#5844FF" : theme.palette.divider}`,
        borderRadius: 2,
        cursor: "pointer",
        background: isActive
          ? theme.palette.mode === "dark" ? "rgba(88,68,255,0.12)" : "rgba(88,68,255,0.05)"
          : "transparent",
        transition: "all 0.2s",
        "&:hover": {
          borderColor: "#5844FF80",
          background: theme.palette.mode === "dark" ? "rgba(88,68,255,0.08)" : "rgba(88,68,255,0.04)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Avatar
          sx={{
            width: 32, height: 32, flexShrink: 0,
            background: isActive ? "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)" : (theme.palette.mode === "dark" ? "#333" : "#f0f0f0"),
          }}
        >
          <AIIcon sx={{ fontSize: 16, color: isActive ? "white" : "text.secondary" }} />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600, mb: 0.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {conversation.title}
          </Typography>
          {lastMsg && (
            <Typography variant="caption" sx={{
              color: "text.secondary",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}>
              {lastMsg.role === "user" ? "You: " : "AI: "}{lastMsg.content}
            </Typography>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.65rem" }}>
              {new Date(conversation.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </Typography>
            {msgCount > 0 && (
              <Chip label={`${msgCount} msg`} size="small" sx={{ height: 16, fontSize: "0.6rem", bgcolor: "rgba(88,68,255,0.08)", color: "#5844FF" }} />
            )}
          </Box>
        </Box>
        <Tooltip title="Delete conversation">
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onDelete(conversation.id); }}
            sx={{ opacity: 0, ".MuiPaper-root:hover &": { opacity: 1 }, "&:hover": { color: "error.main" } }}
          >
            <DeleteIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
}
