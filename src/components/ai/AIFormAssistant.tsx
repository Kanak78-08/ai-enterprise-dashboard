import { useState } from "react";
import {
  Box, Typography, Button, TextField, MenuItem, Grid,
  CircularProgress, Paper, Chip, Alert, Divider, useTheme,
} from "@mui/material";
import {
  AutoFixHigh as AutofillIcon,
  Edit as EditIcon,
  CheckCircle as DoneIcon,
} from "@mui/icons-material";
import { autofillForm } from "../../services/aiWorkflowService";
import type { AutofillResponse } from "../../types/aiWorkflow";

const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const CATEGORIES = ["Maintenance", "Safety", "Quality", "Production", "Compliance", "IT", "Finance", "General", "Human Resources", "Operations"];
const DATE_RANGES = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "Last Year", "Custom"];

interface AIFormAssistantProps {
  onAutofillComplete?: (data: AutofillResponse) => void;
}

export default function AIFormAssistant({ onAutofillComplete }: AIFormAssistantProps) {
  const theme = useTheme();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AutofillResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAutofill = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await autofillForm({ prompt });
      setFormData(result);
      setSuccess(true);
      onAutofillComplete?.(result);
    } catch {
      setError("Failed to autofill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof AutofillResponse) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => prev ? { ...prev, [field]: e.target.value } : prev);
  };

  const EXAMPLE_PROMPTS = [
    "Generate monthly maintenance report for Gurgaon plant",
    "Create weekly safety audit for Mumbai operations",
    "High priority quality review for production team",
    "Quarterly finance compliance report for Delhi",
  ];

  return (
    <Box>
      {/* AI Prompt Input */}
      <Paper
        elevation={0}
        sx={{
          p: 3, mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          background: theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
            : "linear-gradient(135deg, #f8f7ff 0%, #fff0f8 100%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <AutofillIcon sx={{ color: "#5844FF", fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Smart Form Autofill</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Describe your report in plain English — AI will populate the form
            </Typography>
          </Box>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder='e.g. "Generate monthly maintenance report for Gurgaon plant with high priority"'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
          }}
        />

        {/* Example prompts */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, display: "block" }}>
            Try an example:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {EXAMPLE_PROMPTS.map((ex) => (
              <Chip
                key={ex}
                label={ex}
                size="small"
                onClick={() => setPrompt(ex)}
                variant="outlined"
                sx={{
                  cursor: "pointer", fontSize: "0.7rem",
                  borderColor: "rgba(88,68,255,0.3)",
                  color: "#5844FF",
                  "&:hover": { background: "rgba(88,68,255,0.06)" },
                }}
              />
            ))}
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} icon={<DoneIcon />}>Form autofilled successfully! You can edit the fields below.</Alert>}

        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutofillIcon />}
          onClick={handleAutofill}
          disabled={loading || !prompt.trim()}
          fullWidth
          sx={{
            borderRadius: 2, textTransform: "none", fontWeight: 700, py: 1.25,
            background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
            boxShadow: "0 4px 16px rgba(88,68,255,0.35)",
          }}
        >
          {loading ? "Extracting form fields…" : "✨ Autofill Using AI"}
        </Button>
      </Paper>

      {/* Editable Generated Fields */}
      {formData && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
            <EditIcon sx={{ color: "#5844FF" }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              AI-Generated Form Fields
            </Typography>
            <Chip label="Editable" size="small" sx={{ background: "rgba(0,200,150,0.1)", color: "#00C896", ml: "auto" }} />
          </Box>
          <Divider sx={{ mb: 2.5 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth size="small" label="Report Title"
                value={formData.title}
                onChange={handleFieldChange("title")}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select fullWidth size="small" label="Priority"
                value={formData.priority}
                onChange={handleFieldChange("priority")}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                {PRIORITIES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select fullWidth size="small" label="Category"
                value={formData.category}
                onChange={handleFieldChange("category")}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            {formData.plant !== undefined && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth size="small" label="Plant / Location"
                  value={formData.plant}
                  onChange={handleFieldChange("plant")}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: formData.plant !== undefined ? 6 : 12 }}>
              <TextField
                select fullWidth size="small" label="Date Range"
                value={formData.dateRange || "Last 30 Days"}
                onChange={handleFieldChange("dateRange")}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                {DATE_RANGES.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </TextField>
            </Grid>
            {formData.team && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth size="small" label="Team"
                  value={formData.team}
                  onChange={handleFieldChange("team")}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth multiline rows={3} size="small" label="Description"
                value={formData.description || ""}
                onChange={handleFieldChange("description")}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", gap: 1.5 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 2, textTransform: "none", fontWeight: 700,
                background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
              }}
            >
              Submit Report
            </Button>
            <Button
              variant="outlined"
              onClick={() => { setFormData(null); setSuccess(false); setPrompt(""); }}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Clear
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
