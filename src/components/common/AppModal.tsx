import type { ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  darkMode?: boolean;
}

export default function AppModal({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "sm",
  darkMode = false,
}: AppModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      sx={{
        "& .MuiDialog-paper": {
          bgcolor: darkMode ? "#141414" : "white",
          color: darkMode ? "#fff" : "inherit",
          border: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`,
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: darkMode ? "#999" : "grey.500",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: darkMode ? "#333" : "inherit" }}>
        <Box sx={{ py: 1 }}>{children}</Box>
      </DialogContent>
      {actions && (
        <DialogActions sx={{ p: 2 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}
