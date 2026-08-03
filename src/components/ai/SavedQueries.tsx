import { useState } from "react";
import { Card, Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Tooltip, TextField, Chip, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button, Fade } from "@mui/material";
import { Star as StarIcon, Delete as DeleteIcon, Edit as EditIcon, PlayArrow as RunIcon, Add as AddIcon, BookmarkBorder as EmptyIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addSavedQuery, removeSavedQuery, renameSavedQuery, incrementSavedQueryUsage } from "../../redux/ai/aiSlice";
import { useAISearch } from "../../hooks/useAISearch";

interface Props { darkMode?: boolean; }

export default function SavedQueries({ darkMode = false }: Props) {
  const dispatch = useAppDispatch();
  const { savedQueries } = useAppSelector((s) => s.ai);
  const { executeSearch, searchQuery } = useAISearch();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [queryName, setQueryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const bg = darkMode ? "#1a1a1a" : "#fff";
  const border = darkMode ? "#333" : "#e5e7eb";
  const txt = darkMode ? "#e2e2e2" : "#1a1a1a";

  const handleSave = () => {
    if (queryName.trim() && searchQuery.trim()) {
      dispatch(addSavedQuery({ name: queryName.trim(), query: searchQuery }));
      setQueryName("");
      setSaveDialogOpen(false);
    }
  };

  const handleRename = () => {
    if (editingId && queryName.trim()) {
      dispatch(renameSavedQuery({ id: editingId, name: queryName.trim() }));
      setEditingId(null);
      setQueryName("");
      setRenameDialogOpen(false);
    }
  };

  const handleRun = (id: string, query: string) => {
    dispatch(incrementSavedQueryUsage(id));
    executeSearch(query);
  };

  return (
    <>
      <Card sx={{ backgroundColor: bg, border: `1px solid ${border}`, borderRadius: "16px", boxShadow: darkMode ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, pb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StarIcon sx={{ fontSize: 20, color: "#F59E0B" }} />
            <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: txt }}>Saved AI Queries</Typography>
          </Box>
          <Tooltip title="Save current search">
            <IconButton size="small" onClick={() => { setQueryName(searchQuery || ""); setSaveDialogOpen(true); }} sx={{ color: darkMode ? "#888" : "#999", "&:hover": { color: "#5844FF" } }}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider sx={{ borderColor: darkMode ? "#2a2a2a" : "#f0f0f0" }} />
        <Box sx={{ p: 1 }}>
          {savedQueries.length > 0 ? (
            <List dense disablePadding>
              {savedQueries.map((q, idx) => (
                <Fade in key={q.id} style={{ transitionDelay: `${idx * 50}ms` }}>
                  <ListItem disablePadding secondaryAction={
                    <Box sx={{ display: "flex", gap: 0.25 }}>
                      <IconButton size="small" onClick={() => handleRun(q.id, q.query)} sx={{ color: "#10B981" }}><RunIcon sx={{ fontSize: 16 }} /></IconButton>
                      <IconButton size="small" onClick={() => { setEditingId(q.id); setQueryName(q.name); setRenameDialogOpen(true); }} sx={{ color: darkMode ? "#666" : "#bbb" }}><EditIcon sx={{ fontSize: 14 }} /></IconButton>
                      <IconButton size="small" onClick={() => dispatch(removeSavedQuery(q.id))} sx={{ color: darkMode ? "#666" : "#bbb", "&:hover": { color: "#EF4444" } }}><DeleteIcon sx={{ fontSize: 14 }} /></IconButton>
                    </Box>
                  }>
                    <ListItemButton onClick={() => handleRun(q.id, q.query)} sx={{ borderRadius: "8px", py: 0.75 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}><StarIcon sx={{ fontSize: 16, color: "#F59E0B" }} /></ListItemIcon>
                      <ListItemText primary={q.name} secondary={q.query} {...({ primaryTypographyProps: { fontSize: "0.82rem", fontWeight: 600, color: txt }, secondaryTypographyProps: { fontSize: "0.7rem", color: darkMode ? "#888" : "#999", noWrap: true } } as any)} />
                      {q.usedCount > 0 && <Chip label={`${q.usedCount}×`} size="small" sx={{ height: 18, fontSize: "0.6rem", mr: 8, backgroundColor: darkMode ? "#2a2a2a" : "#f3f4f6", color: darkMode ? "#888" : "#999" }} />}
                    </ListItemButton>
                  </ListItem>
                </Fade>
              ))}
            </List>
          ) : (
            <Box sx={{ py: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <EmptyIcon sx={{ fontSize: 28, color: darkMode ? "#555" : "#ccc" }} />
              <Typography variant="body2" sx={{ color: darkMode ? "#666" : "#999", fontSize: "0.8rem" }}>No saved queries yet</Typography>
            </Box>
          )}
        </Box>
      </Card>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="xs" fullWidth {...({ PaperProps: { sx: { borderRadius: "16px", backgroundColor: bg } } } as any)}>
        <DialogTitle sx={{ color: txt }}>Save AI Query</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth size="small" label="Query Name" value={queryName} onChange={(e) => setQueryName(e.target.value)} sx={{ mt: 1 }} onKeyDown={(e) => e.key === "Enter" && handleSave()} />
          <Typography variant="caption" sx={{ color: darkMode ? "#888" : "#999", mt: 1, display: "block" }}>Query: {searchQuery || "(empty)"}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSaveDialogOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!queryName.trim()} sx={{ textTransform: "none", borderRadius: "8px", background: "linear-gradient(135deg, #5844FF, #7c6aff)" }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)} maxWidth="xs" fullWidth {...({ PaperProps: { sx: { borderRadius: "16px", backgroundColor: bg } } } as any)}>
        <DialogTitle sx={{ color: txt }}>Rename Query</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth size="small" label="New Name" value={queryName} onChange={(e) => setQueryName(e.target.value)} sx={{ mt: 1 }} onKeyDown={(e) => e.key === "Enter" && handleRename()} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRenameDialogOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={handleRename} disabled={!queryName.trim()} sx={{ textTransform: "none", borderRadius: "8px", background: "linear-gradient(135deg, #5844FF, #7c6aff)" }}>Rename</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
