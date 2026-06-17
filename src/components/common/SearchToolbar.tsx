import { TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface SearchToolbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  darkMode?: boolean;
}

export default function SearchToolbar({ value, onChange, placeholder = "Search...", darkMode }: SearchToolbarProps) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size="small"
      variant="outlined"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: darkMode ? "#999" : "#666" }} />
            </InputAdornment>
          ),
          sx: {
            bgcolor: darkMode ? "#1e1e1e" : "white",
            color: darkMode ? "#fff" : "inherit",
            "& fieldset": {
              borderColor: darkMode ? "#333" : "#e0e0e0",
            },
          },
        }
      }}
      sx={{ minWidth: 250 }}
    />
  );
}
