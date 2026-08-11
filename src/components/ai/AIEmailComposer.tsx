import { useState } from "react";
import {
  Box, Typography, Button, TextField, MenuItem, Grid,
  CircularProgress, Paper, Alert, Snackbar, Divider, Chip, useTheme,
} from "@mui/material";
import {
  Email as EmailIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  AutoAwesome as AIIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { generateEmail } from "../../services/aiWorkflowService";
import type { EmailContext, GeneratedEmail } from "../../types/aiWorkflow";

const EMAIL_CONTEXTS: EmailContext[] = [
  "Share Weekly Dashboard",
  "Monthly Report Summary",
  "Failure Alert",
  "Performance Update",
  "Custom",
];

export default function AIEmailComposer() {
  const theme = useTheme();
  const [context, setContext] = useState<EmailContext>("Share Weekly Dashboard");
  const [customContext, setCustomContext] = useState("");
  const [recipientName, setRecipientName] = useState("Team");
  const [senderName, setSenderName] = useState("Operations Team");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<GeneratedEmail | null>(null);
  const [editedBody, setEditedBody] = useState("");
  const [editedSubject, setEditedSubject] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState({ open: false, msg: "" });

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateEmail({
        context,
        customContext: context === "Custom" ? customContext : undefined,
        recipientName,
        senderName,
      });
      setEmail(result);
      setEditedSubject(result.subject);
      setEditedBody(result.body);
    } catch {
      setError("Failed to generate email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const text = `Subject: ${editedSubject}\n\n${editedBody}`;
    await navigator.clipboard.writeText(text);
    setSnack({ open: true, msg: "Email copied to clipboard!" });
  };

  const handleDownload = () => {
    const text = `Subject: ${editedSubject}\n\n${editedBody}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email_draft.txt";
    a.click();
    URL.revokeObjectURL(url);
    setSnack({ open: true, msg: "Email downloaded!" });
  };

  return (
    <Box>
      {/* Config Panel */}
      <Paper
        elevation={0}
        sx={{
          p: 3, mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          background: theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
            : "linear-gradient(135deg, #f8f7ff 0%, #f0f8ff 100%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box sx={{
            width: 42, height: 42, borderRadius: 2,
            background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <EmailIcon sx={{ color: "white", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>AI Email Composer</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Generate professional emails from dashboard data
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select fullWidth size="small" label="Email Context"
              value={context}
              onChange={(e) => setContext(e.target.value as EmailContext)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              {EMAIL_CONTEXTS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>
          {context === "Custom" && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth size="small" label="Custom Context"
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="Describe what this email is about"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
          )}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth size="small" label="Recipient Name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth size="small" label="Sender Name"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Grid>
        </Grid>

        {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}

        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AIIcon />}
          onClick={handleGenerate}
          disabled={loading}
          sx={{
            mt: 3, borderRadius: 2, textTransform: "none", fontWeight: 700, py: 1.5,
            background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
            boxShadow: "0 4px 16px rgba(88,68,255,0.35)",
          }}
        >
          {loading ? "Drafting Email…" : "✨ Generate Email Draft"}
        </Button>
      </Paper>

      {/* Email Preview */}
      {email && (
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3, overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box sx={{
            px: 3, py: 2,
            background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
            color: "white",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon />
              <Typography sx={{ fontWeight: 700 }}>Email Draft</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip label="Editable" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white" }} />
              <Chip label={`Generated ${email.generatedAt}`} size="small" sx={{ background: "rgba(255,255,255,0.15)", color: "white", fontSize: "0.7rem" }} />
            </Box>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* Action buttons */}
            <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
              <Button variant="outlined" size="small" startIcon={<AIIcon />} onClick={handleGenerate} disabled={loading} sx={{ borderRadius: 2, textTransform: "none" }}>
                Regenerate
              </Button>
              <Button variant="outlined" size="small" startIcon={<CopyIcon />} onClick={handleCopy} sx={{ borderRadius: 2, textTransform: "none" }}>
                Copy
              </Button>
              <Button variant="contained" size="small" startIcon={<DownloadIcon />} onClick={handleDownload}
                sx={{ borderRadius: 2, textTransform: "none", background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)" }}>
                Download
              </Button>
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            {/* Subject */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.8 }}>
                  Subject
                </Typography>
                <EditIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              </Box>
              <TextField
                fullWidth size="small"
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 2, fontWeight: 600 },
                }}
              />
            </Box>

            {/* Body */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.8 }}>
                  Body
                </Typography>
                <EditIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              </Box>
              <TextField
                fullWidth multiline rows={14}
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontFamily: "inherit",
                    fontSize: "0.9rem",
                    lineHeight: 1.8,
                  },
                }}
              />
            </Box>
          </Box>
        </Paper>
      )}

      {!email && !loading && (
        <Box sx={{
          textAlign: "center", py: 8,
          color: "text.secondary",
          border: `2px dashed ${theme.palette.divider}`,
          borderRadius: 3,
        }}>
          <EmailIcon sx={{ fontSize: 64, opacity: 0.2, mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>No Email Draft Yet</Typography>
          <Typography variant="body2">Configure the options above and click "Generate Email Draft".</Typography>
        </Box>
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ open: false, msg: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
