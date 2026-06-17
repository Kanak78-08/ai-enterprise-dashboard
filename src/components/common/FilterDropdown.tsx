import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";

interface FilterDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  darkMode?: boolean;
}

export default function FilterDropdown({ label, value, onChange, options, darkMode }: FilterDropdownProps) {
  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      {label && <InputLabel sx={{ color: darkMode ? "#999" : "inherit" }}>{label}</InputLabel>}
      <Select
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          bgcolor: darkMode ? "#1e1e1e" : "white",
          color: darkMode ? "#fff" : "inherit",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: darkMode ? "#333" : "#e0e0e0",
          },
          "& .MuiSvgIcon-root": {
            color: darkMode ? "#999" : "inherit",
          },
        }}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
