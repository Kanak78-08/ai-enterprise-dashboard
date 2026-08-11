import { useState, useEffect, useRef } from "react";
import {
  Box, Typography, Button, TextField, Paper, Avatar, Chip,
  Divider, CircularProgress, useTheme,
} from "@mui/material";
import {
  Add as NewIcon,
  Send as SendIcon,
  SmartToy as AIIcon,
  Person as UserIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import {
  getConversations, createConversation, addMessageToConversation,
  deleteConversation, sendContextualMessage,
} from "../../services/aiWorkflowService";
import type { Conversation, ConversationMessage } from "../../types/aiWorkflow";
import { ConversationCard } from "./ConversationCard";

export default function ConversationHistory() {
  const theme = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    getConversations().then((convs) => {
      if (!mounted) return;
      setConversations(convs);
      if (convs.length > 0) setActiveConvId(convs[0].id);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const reload = async () => {
    const convs = await getConversations();
    setConversations(convs);
    return convs;
  };

  const activeConv = conversations.find((c) => c.id === activeConvId) ?? null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  const handleNewConversation = async () => {
    const conv = await createConversation("New conversation");
    await reload();
    setActiveConvId(conv.id);
  };

  const handleDelete = async (id: string) => {
    await deleteConversation(id);
    const remaining = await reload();
    if (activeConvId === id) {
      setActiveConvId(remaining[0]?.id ?? null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");

    let convId = activeConvId;

    // Create conversation if none
    if (!convId) {
      const conv = await createConversation(text);
      await reload();
      setActiveConvId(conv.id);
      convId = conv.id;
    }

    // Add user message
    const userMsg: ConversationMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    await addMessageToConversation(convId, userMsg);
    await reload();

    setLoading(true);
    try {
      const history = (await getConversations()).find((c) => c.id === convId)?.messages ?? [];
      const response = await sendContextualMessage(convId, text, history);
      const aiMsg: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      };
      await addMessageToConversation(convId, aiMsg);
      await reload();
    } finally {
      setLoading(false);
    }
  };

  // Group conversations by time
  const now = Date.now();
  const DAY = 86400000;
  const grouped: { label: string; items: Conversation[] }[] = [
    { label: "Today", items: conversations.filter((c) => now - c.updatedAt < DAY) },
    { label: "Yesterday", items: conversations.filter((c) => now - c.updatedAt >= DAY && now - c.updatedAt < 2 * DAY) },
    { label: "Last Week", items: conversations.filter((c) => now - c.updatedAt >= 2 * DAY && now - c.updatedAt < 8 * DAY) },
    { label: "Older", items: conversations.filter((c) => now - c.updatedAt >= 8 * DAY) },
  ];

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 180px)", gap: 2, overflow: "hidden" }}>
      {/* Sidebar – History List */}
      <Paper
        elevation={0}
        sx={{
          width: 280, flexShrink: 0,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HistoryIcon sx={{ color: "#5844FF", fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Conversation History</Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<NewIcon />}
              onClick={handleNewConversation}
              sx={{
                borderRadius: 1.5, textTransform: "none", fontSize: "0.75rem",
                background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
                minWidth: 0, px: 1.5,
              }}
            >
              New
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>
          {conversations.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
              <HistoryIcon sx={{ fontSize: 40, opacity: 0.2, mb: 1 }} />
              <Typography variant="caption">No conversations yet.</Typography>
            </Box>
          ) : (
            grouped.filter((g) => g.items.length > 0).map((group) => (
              <Box key={group.label}>
                <Typography variant="caption" sx={{
                  color: "text.secondary", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: 1, fontSize: "0.65rem",
                  px: 0.5, mb: 0.5, display: "block",
                }}>
                  {group.label}
                </Typography>
                {group.items.map((conv) => (
                  <ConversationCard
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === activeConvId}
                    onSelect={setActiveConvId}
                    onDelete={handleDelete}
                  />
                ))}
                <Box sx={{ mb: 1.5 }} />
              </Box>
            ))
          )}
        </Box>
      </Paper>

      {/* Main Chat Window */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Chat Header */}
        <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <AIIcon sx={{ color: "white", fontSize: 18 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {activeConv?.title || "Start a New Conversation"}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {activeConv
                ? `${activeConv.messages.length} messages · Context-aware AI`
                : "AI remembers previous messages within this conversation"}
            </Typography>
          </Box>
          {activeConv && (
            <Chip
              label="Context Active"
              size="small"
              sx={{ ml: "auto", background: "rgba(0,200,150,0.1)", color: "#00C896", fontWeight: 600 }}
            />
          )}
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
          {!activeConv && (
            <Box sx={{ m: "auto", textAlign: "center", color: "text.secondary" }}>
              <AIIcon sx={{ fontSize: 64, opacity: 0.15, mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Context-Aware AI Chat</Typography>
              <Typography variant="body2" sx={{ maxWidth: 380, mx: "auto" }}>
                Start a conversation. The AI will remember your previous messages and understand follow-up questions.
              </Typography>
            </Box>
          )}
          {activeConv?.messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <Avatar sx={{
                width: 32, height: 32, flexShrink: 0,
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)"
                  : theme.palette.mode === "dark" ? "#333" : "#f0f0f0",
              }}>
                {msg.role === "user"
                  ? <UserIcon sx={{ fontSize: 16, color: "white" }} />
                  : <AIIcon sx={{ fontSize: 16, color: "#5844FF" }} />}
              </Avatar>
              <Paper
                elevation={0}
                sx={{
                  p: 1.75,
                  maxWidth: "75%",
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)"
                    : theme.palette.mode === "dark" ? "#1e1e1e" : "#f8f8f8",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: msg.role === "user" ? "white" : "text.primary",
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.6, display: "block", mt: 0.5, textAlign: msg.role === "user" ? "right" : "left",
                    color: msg.role === "user" ? "white" : "text.secondary" }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Typography>
              </Paper>
            </Box>
          ))}
          {loading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ width: 32, height: 32, background: theme.palette.mode === "dark" ? "#333" : "#f0f0f0" }}>
                <AIIcon sx={{ fontSize: 16, color: "#5844FF" }} />
              </Avatar>
              <Box sx={{
                px: 2, py: 1.5, borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.mode === "dark" ? "#1e1e1e" : "#f8f8f8",
                display: "flex", alignItems: "center", gap: 1,
              }}>
                <CircularProgress size={14} thickness={5} sx={{ color: "#5844FF" }} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>AI is thinking…</Typography>
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Divider />

        {/* Input */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask a follow-up question…"
              disabled={loading}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              sx={{
                borderRadius: 2, minWidth: 48, px: 2,
                background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
              }}
            >
              <SendIcon />
            </Button>
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.75, display: "block" }}>
            ↵ Send · The AI understands your conversation context automatically
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
