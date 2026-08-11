import { useState, useEffect } from "react";
import {
  Box, Typography, Button, TextField, InputAdornment, Chip, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Tooltip, Divider, useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as RunIcon,
  FilterList as FilterIcon,
  AutoAwesome as AIIcon,
  AccessTime as RecentIcon,
} from "@mui/icons-material";
import {
  getPrompts, savePrompt, updatePrompt, deletePrompt, usePromptById,
} from "../../services/aiWorkflowService";
import type { PromptTemplate, PromptCategory } from "../../types/aiWorkflow";

const CATEGORIES: PromptCategory[] = ["Reports", "Analytics", "Operations", "Communication", "Custom"];

const CATEGORY_COLORS: Record<PromptCategory, string> = {
  Reports: "#5844FF",
  Analytics: "#00C896",
  Operations: "#FFB347",
  Communication: "#4FC3F7",
  Custom: "#AB47BC",
};

interface PromptLibraryProps {
  onRunPrompt?: (prompt: string) => void;
}

export default function PromptLibrary({ onRunPrompt }: PromptLibraryProps) {
  const theme = useTheme();
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<PromptCategory | "All" | "Favorites" | "Recent">("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ name: "", prompt: "", category: "Custom" as PromptCategory });
  const [runSnack, setRunSnack] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getPrompts().then((items) => {
      if (mounted) setPrompts(items);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const reload = async () => {
    setPrompts(await getPrompts());
  };

  const handleToggleFavorite = async (id: string, current: boolean) => {
    await updatePrompt(id, { isFavorite: !current });
    await reload();
  };

  const handleDelete = async (id: string) => {
    await deletePrompt(id);
    await reload();
  };

  const handleRun = async (p: PromptTemplate) => {
    await usePromptById(p.id);
    await reload();
    onRunPrompt?.(p.prompt);
    setRunSnack(p.name);
    setTimeout(() => setRunSnack(null), 3000);
  };

  const handleAddPrompt = async () => {
    if (!newPrompt.name.trim() || !newPrompt.prompt.trim()) return;
    await savePrompt({ ...newPrompt, isFavorite: false });
    await reload();
    setDialogOpen(false);
    setNewPrompt({ name: "", prompt: "", category: "Custom" });
  };

  // Filtering
  const filtered = prompts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.prompt.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (activeCategory === "All") return true;
    if (activeCategory === "Favorites") return p.isFavorite;
    if (activeCategory === "Recent") return !!p.lastUsed;
    return p.category === activeCategory;
  });

  const sortedFiltered = [...filtered].sort((a, b) => {
    if (activeCategory === "Recent") return (b.lastUsed || 0) - (a.lastUsed || 0);
    return b.usedCount - a.usedCount;
  });

  const favCount = prompts.filter((p) => p.isFavorite).length;
  const recentCount = prompts.filter((p) => p.lastUsed).length;

  return (
    <Box>
      {runSnack && (
        <Paper elevation={6} sx={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          px: 3, py: 1.5, borderRadius: 2, zIndex: 9999,
          background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
          color: "white", display: "flex", alignItems: "center", gap: 1,
        }}>
          <AIIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Running: {runSnack}</Typography>
        </Paper>
      )}

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Prompt Library</Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {prompts.length} saved templates · {favCount} favorites
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{
            borderRadius: 2, textTransform: "none", fontWeight: 600,
            background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
          }}
        >
          New Prompt
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth size="small"
        placeholder="Search prompts…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.secondary" }} /></InputAdornment>,
          },
        }}
        sx={{ mb: 2.5, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      />

      {/* Category Tabs */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
        {(["All", "Favorites", "Recent", ...CATEGORIES] as const).map((cat) => {
          const isActive = activeCategory === cat;
          const color = cat in CATEGORY_COLORS ? CATEGORY_COLORS[cat as PromptCategory] : "#5844FF";
          const count = cat === "All" ? prompts.length
            : cat === "Favorites" ? favCount
            : cat === "Recent" ? recentCount
            : prompts.filter((p) => p.category === cat).length;
          return (
            <Chip
              key={cat}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {cat === "Favorites" && <StarIcon sx={{ fontSize: 13 }} />}
                  {cat === "Recent" && <RecentIcon sx={{ fontSize: 13 }} />}
                  {cat}
                  {count > 0 && (
                    <Box sx={{
                      ml: 0.5, fontSize: "0.65rem", background: isActive ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)",
                      borderRadius: "50%", width: 16, height: 16,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {count}
                    </Box>
                  )}
                </Box>
              }
              onClick={() => setActiveCategory(cat)}
              sx={{
                cursor: "pointer", fontWeight: isActive ? 700 : 400,
                background: isActive ? `${color}15` : "transparent",
                border: `1.5px solid ${isActive ? color : theme.palette.divider}`,
                color: isActive ? color : "text.secondary",
                transition: "all 0.2s",
                "&:hover": { background: `${color}10`, color },
              }}
            />
          );
        })}
      </Box>

      {/* Prompt Cards */}
      {sortedFiltered.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
          <FilterIcon sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
          <Typography variant="body2">No prompts found. Try a different search or category.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {sortedFiltered.map((p) => {
            const catColor = CATEGORY_COLORS[p.category] || "#5844FF";
            return (
              <Paper
                key={p.id}
                elevation={0}
                sx={{
                  p: 2.5,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  borderLeft: `4px solid ${catColor}`,
                  transition: "all 0.2s",
                  "&:hover": { boxShadow: `0 4px 20px ${catColor}18`, borderColor: `${catColor}60` },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75, flexWrap: "wrap" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{p.name}</Typography>
                      <Chip
                        label={p.category}
                        size="small"
                        sx={{ background: `${catColor}15`, color: catColor, fontSize: "0.65rem", height: 18 }}
                      />
                      {p.usedCount > 0 && (
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Used {p.usedCount}×
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.6,
                        mb: 1.5,
                      }}
                    >
                      {p.prompt}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<RunIcon />}
                      onClick={() => handleRun(p)}
                      sx={{
                        borderRadius: 1.5, textTransform: "none", fontSize: "0.8rem", fontWeight: 600,
                        background: `linear-gradient(135deg, ${catColor} 0%, ${catColor}cc 100%)`,
                        boxShadow: `0 2px 8px ${catColor}30`,
                      }}
                    >
                      Run Prompt
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Tooltip title={p.isFavorite ? "Remove from favorites" : "Add to favorites"}>
                      <IconButton size="small" onClick={() => handleToggleFavorite(p.id, p.isFavorite)}>
                        {p.isFavorite ? <StarIcon sx={{ color: "#FFB347", fontSize: 18 }} /> : <StarBorderIcon sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete prompt">
                      <IconButton size="small" onClick={() => handleDelete(p.id)} sx={{ opacity: 0.5, "&:hover": { opacity: 1, color: "error.main" } }}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}

      {/* Add Prompt Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
          <AIIcon sx={{ color: "#5844FF" }} /> New Prompt Template
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth size="small" label="Prompt Name"
              value={newPrompt.name}
              onChange={(e) => setNewPrompt((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Weekly Report Generator"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              select fullWidth size="small" label="Category"
              value={newPrompt.category}
              onChange={(e) => setNewPrompt((p) => ({ ...p, category: e.target.value as PromptCategory }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField
              fullWidth multiline rows={4} size="small" label="Prompt Text"
              value={newPrompt.prompt}
              onChange={(e) => setNewPrompt((p) => ({ ...p, prompt: e.target.value }))}
              placeholder="Enter the full prompt template…"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: "none", borderRadius: 2 }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddPrompt}
            disabled={!newPrompt.name.trim() || !newPrompt.prompt.trim()}
            sx={{
              borderRadius: 2, textTransform: "none", fontWeight: 700,
              background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
            }}
          >
            Save Prompt
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
